"""
Market Filter Router Module.

This module provides API endpoints for filtering and comparing product prices
across different marketplaces (plazas).
"""

from typing import Dict, List, Optional
import logging

from fastapi import APIRouter, HTTPException, Query
from sqlalchemy import text

from database import SessionLocal


# Configure logging for debugging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/product-prices",
    tags=["Product Prices"]
)


@router.get("/plazas")
def get_available_plazas() -> Dict:
    """
    Retrieve the list of available and active marketplaces.

    Returns:
        Dict: A dictionary containing:
            - total_plazas (int): Total number of active marketplaces
            - plazas (List[Dict]): List of marketplace objects

    Raises:
        HTTPException: 500 error if database query fails
    """
    db = SessionLocal()
    try:
        logger.info("Obteniendo lista de plazas disponibles")

        query = """
            SELECT 
                plaza_id,
                nombre,
                ciudad,
                estado
            FROM plazas_mercado
            WHERE estado = 'activa'
            ORDER BY nombre
        """
        result = db.execute(text(query)).fetchall()

        plazas = [
            {
                "plaza_id": row.plaza_id,
                "nombre": row.nombre,
                "ciudad": row.ciudad,
                "estado": row.estado
            }
            for row in result
        ]

        logger.info(f"Se encontraron {len(plazas)} plazas")

        return {
            "total_plazas": len(plazas),
            "plazas": plazas
        }
    except Exception as e:
        logger.error(f"Error al obtener plazas: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener plazas: {str(e)}"
        )
    finally:
        db.close()


@router.get("/compare")
def compare_product_prices(
    product_name: str = Query(
        ...,
        description="Nombre del producto a buscar"
    ),
    plaza_names: Optional[List[str]] = Query(
        None,
        description="Lista de plazas para comparar (opcional). Si no se especifica, muestra todas."
    )
) -> Dict:
    """
    Compare product prices across marketplaces.

    This unified endpoint handles both scenarios:
    1. Compare prices across ALL marketplaces (when plaza_names is None/empty)
    2. Compare prices in SELECTED marketplaces (when plaza_names is provided)

    Args:
        product_name (str): Name of the product to search for (required)
        plaza_names (Optional[List[str]]): List of marketplace names to compare.
            If None or empty, shows results from all marketplaces.

    Returns:
        Dict: A dictionary containing:
            - producto (str): Normalized product name
            - modo_comparacion (str): "todas" or "seleccionadas"
            - plazas_filtradas (List[str] or None): Names of selected plazas or None
            - total_resultados (int): Total number of results
            - plazas_con_datos (List[str]): Marketplaces that have data
            - comparacion (List[Dict]): Price records grouped by marketplace
            - estadisticas (Dict): Price statistics

    Raises:
        HTTPException: 404 if no prices found
        HTTPException: 500 if database error occurs

    Examples:
        >>> # Compare across ALL marketplaces
        >>> compare_product_prices(product_name="Aguacate Común")
        
        >>> # Compare in SELECTED marketplaces
        >>> compare_product_prices(
        ...     product_name="Aguacate Común",
        ...     plaza_names=["Plaza Mayorista", "Plaza Minorista"]
        ... )
    """
    db = SessionLocal()
    try:
        # Normalize product name
        product_normalized = (
            product_name.replace("-", " ").replace("_", " ").strip()
        )

        # Determine comparison mode
        filter_mode = bool(plaza_names and len(plaza_names) > 0)
        
        logger.info(
            f"Búsqueda iniciada - Producto: {product_name}, "
            f"Modo: {'filtrado' if filter_mode else 'todas las plazas'}, "
            f"Plazas: {plaza_names if filter_mode else 'N/A'}"
        )

        # Build query
        base_query = """
            SELECT
                prod.nombre AS producto,
                plz.nombre AS plaza,
                plz.ciudad AS ciudad_plaza,
                p.precio_por_kg,
                p.fecha
            FROM precios AS p
            JOIN productos AS prod ON p.producto_id = prod.producto_id
            JOIN plazas_mercado AS plz ON p.plaza_id = plz.plaza_id
            WHERE LOWER(REPLACE(REPLACE(prod.nombre, ' ', ''), '-', '')) =
                  LOWER(REPLACE(REPLACE(:product_name, ' ', ''), '-', ''))
            AND plz.estado = 'activa'
        """

        params = {"product_name": product_normalized}

        # Add plaza filter if specified
        if filter_mode:
            # Normalize plaza names
            plaza_names_normalized = [
                p.replace("-", " ").replace("_", " ").strip() 
                for p in plaza_names
            ]
            
            # Validate plazas exist
            placeholders = ", ".join([f":plaza_{i}" for i in range(len(plaza_names_normalized))])
            validation_query = f"""
                SELECT nombre 
                FROM plazas_mercado
                WHERE LOWER(REPLACE(REPLACE(nombre, ' ', ''), '-', '')) IN (
                    {', '.join([f"LOWER(REPLACE(REPLACE(:plaza_{i}, ' ', ''), '-', ''))" for i in range(len(plaza_names_normalized))])}
                )
                AND estado = 'activa'
            """
            
            validation_params = {f"plaza_{i}": name for i, name in enumerate(plaza_names_normalized)}
            valid_plazas = db.execute(text(validation_query), validation_params).fetchall()
            
            if len(valid_plazas) != len(plaza_names_normalized):
                found = [p.nombre for p in valid_plazas]
                missing = [p for p in plaza_names_normalized if p not in found]
                raise HTTPException(
                    status_code=404,
                    detail=f"Algunas plazas no existen o no están activas: {missing}"
                )

            # Add filter to main query
            base_query += f"""
                AND LOWER(REPLACE(REPLACE(plz.nombre, ' ', ''), '-', '')) IN (
                    {', '.join([f"LOWER(REPLACE(REPLACE(:plaza_{i}, ' ', ''), '-', ''))" for i in range(len(plaza_names_normalized))])}
                )
            """
            params.update(validation_params)

        # Order results
        base_query += " ORDER BY plz.nombre ASC, p.fecha DESC"

        logger.info(f"Ejecutando query con params: {params}")

        # Execute query
        result = db.execute(text(base_query), params).fetchall()

        logger.info(f"Resultados encontrados: {len(result)}")

        if not result:
            detail_msg = (
                f"No se encontraron precios para '{product_name}' "
                f"en {'las plazas seleccionadas' if filter_mode else 'ninguna plaza registrada'}."
            )
            raise HTTPException(status_code=404, detail=detail_msg)

        # Group results by plaza
        plazas_data = {}
        all_prices = []
        
        for row in result:
            plaza_name = row.plaza
            price = float(row.precio_por_kg)
            all_prices.append(price)
            
            if plaza_name not in plazas_data:
                plazas_data[plaza_name] = {
                    "plaza": plaza_name,
                    "ciudad": row.ciudad_plaza,
                    "precios": []
                }
            
            plazas_data[plaza_name]["precios"].append({
                "precio_por_kg": price,
                "fecha": str(row.fecha)
            })

        # Calculate statistics for each plaza
        comparacion = []
        for plaza_name in sorted(plazas_data.keys()):
            plaza_info = plazas_data[plaza_name]
            precios = [p["precio_por_kg"] for p in plaza_info["precios"]]
            
            comparacion.append({
                "plaza": plaza_name,
                "ciudad": plaza_info["ciudad"],
                "precio_promedio": round(sum(precios) / len(precios), 2),
                "precio_minimo": min(precios),
                "precio_maximo": max(precios),
                "ultimo_precio": plaza_info["precios"][0]["precio_por_kg"],
                "ultima_fecha": plaza_info["precios"][0]["fecha"],
                "total_registros": len(precios)
            })

        # Global statistics
        estadisticas = {
            "precio_promedio_global": round(sum(all_prices) / len(all_prices), 2),
            "precio_minimo_global": min(all_prices),
            "precio_maximo_global": max(all_prices),
            "diferencia_max_min": round(max(all_prices) - min(all_prices), 2)
        }

        logger.info("Respuesta de comparación generada exitosamente")

        return {
            "producto": product_normalized,
            "modo_comparacion": "seleccionadas" if filter_mode else "todas",
            "plazas_filtradas": plaza_names if filter_mode else None,
            "total_resultados": len(result),
            "plazas_con_datos": list(plazas_data.keys()),
            "comparacion": comparacion,
            "estadisticas": estadisticas
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Error interno del servidor: {str(e)}"
        )
    finally:
        db.close()