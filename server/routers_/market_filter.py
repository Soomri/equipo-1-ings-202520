"""
Market Filter Router Module.

This module provides API endpoints for filtering and comparing product prices
across different marketplaces (plazas). It includes functionality for retrieving
available marketplaces, filtering product prices by location, and comparing
prices across multiple locations.
"""

from typing import Dict, Optional
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

    This endpoint is useful for populating filter dropdowns on the frontend,
    allowing users to select from available marketplaces.

    Returns:
        Dict: A dictionary containing:
            - total_plazas (int): Total number of active marketplaces
            - plazas (List[Dict]): List of marketplace objects with:
                - plaza_id: Unique identifier
                - nombre: Marketplace name
                - ciudad: City location
                - estado: Status (active/inactive)

    Raises:
        HTTPException: 500 error if database query fails

    Example:
        >>> response = get_available_plazas()
        >>> print(response['total_plazas'])
        5
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


@router.get("/")
def get_product_prices(
    product_name: str = Query(
        ...,
        description="Nombre del producto a buscar"
    ),
    plaza_name: Optional[str] = Query(
        None,
        description="Nombre de la plaza de mercado para filtrar (opcional)"
    )
) -> Dict:
    """
    Retrieve product prices with optional marketplace filtering.

    This endpoint searches for product prices across marketplaces. Users can
    optionally filter results by a specific marketplace name. The search
    handles name variations (spaces, hyphens, case-insensitive).

    Args:
        product_name (str): Name of the product to search for (required)
        plaza_name (Optional[str]): Name of the marketplace to filter by
            (optional). If not provided, shows results from all marketplaces.

    Returns:
        Dict: A dictionary containing:
            - producto (str): Normalized product name
            - filtro_aplicado (Dict): Applied filter information
            - total_resultados (int): Total number of results
            - plazas_incluidas (List[str]): List of marketplaces included
            - estadisticas_por_plaza (List[Dict]): Statistics per marketplace
            - resultados (List[Dict]): Detailed price records

    Raises:
        HTTPException: 404 if marketplace doesn't exist or no prices found
        HTTPException: 500 if database error occurs

    Scenarios covered:
        1. Filter products in selected marketplace
        2. Search without selecting marketplace (show all)
        3. Filter persistence (handled by frontend with query params)

    Example:
        >>> # Search in all marketplaces
        >>> get_product_prices(product_name="Tomate")
        
        >>> # Filter by specific marketplace
        >>> get_product_prices(
        ...     product_name="Tomate",
        ...     plaza_name="Plaza Mayorista"
        ... )
    """
    db = SessionLocal()
    try:
        logger.info(
            f"Búsqueda iniciada - Producto: {product_name}, "
            f"Plaza: {plaza_name}"
        )

        # Normalize names (avoid errors from spaces, hyphens, or case)
        product_normalized = (
            product_name.replace("-", " ").replace("_", " ").strip()
        )
        plaza_normalized = (
            plaza_name.replace("-", " ").replace("_", " ").strip()
            if plaza_name else None
        )

        # Validate marketplace exists if filter was provided
        if plaza_normalized:
            logger.info(f"Validando plaza: {plaza_normalized}")
            plaza_check_query = """
                SELECT plaza_id, nombre 
                FROM plazas_mercado
                WHERE LOWER(REPLACE(REPLACE(nombre, ' ', ''), '-', '')) =
                      LOWER(REPLACE(REPLACE(:plaza_name, ' ', ''), '-', ''))
                AND estado = 'activa'
            """
            plaza_exists = db.execute(
                text(plaza_check_query),
                {"plaza_name": plaza_normalized}
            ).fetchone()

            if not plaza_exists:
                logger.warning(f"Plaza no encontrada: {plaza_normalized}")
                raise HTTPException(
                    status_code=404,
                    detail=(
                        f"La plaza '{plaza_name}' no existe o no está activa. "
                        "Use el endpoint /product-prices/plazas para ver las "
                        "plazas disponibles."
                    )
                )

            logger.info(f"Plaza validada correctamente: {plaza_exists.nombre}")

        # Base query
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

        # Optional marketplace filter
        if plaza_normalized:
            base_query += """
                AND LOWER(REPLACE(REPLACE(plz.nombre, ' ', ''), '-', '')) =
                    LOWER(REPLACE(REPLACE(:plaza_name, ' ', ''), '-', ''))
            """
            params["plaza_name"] = plaza_normalized

        # Final ordering by date descending
        base_query += " ORDER BY p.fecha DESC, plz.nombre ASC"

        logger.info(f"Ejecutando query con params: {params}")

        # Execute query
        result = db.execute(text(base_query), params).fetchall()

        logger.info(f"Resultados encontrados: {len(result)}")

        if not result:
            if plaza_normalized:
                raise HTTPException(
                    status_code=404,
                    detail=(
                        f"No se encontraron precios para '{product_name}' "
                        f"en la plaza '{plaza_name}'."
                    )
                )
            else:
                raise HTTPException(
                    status_code=404,
                    detail=(
                        f"No se encontraron precios para '{product_name}' "
                        "en ninguna plaza registrada."
                    )
                )

        # Structure response
        prices = [
            {
                "producto": row.producto,
                "plaza": row.plaza,
                "ciudad": row.ciudad_plaza,
                "precio_por_kg": float(row.precio_por_kg),
                "fecha": str(row.fecha)
            }
            for row in result
        ]

        plazas_unicas = sorted(list({r.plaza for r in result}))

        # Calculate statistics per marketplace
        precio_por_plaza = {}
        for row in result:
            if row.plaza not in precio_por_plaza:
                precio_por_plaza[row.plaza] = []
            precio_por_plaza[row.plaza].append(float(row.precio_por_kg))

        estadisticas_plazas = [
            {
                "plaza": plaza,
                "precio_promedio": round(sum(precios) / len(precios), 2),
                "precio_minimo": min(precios),
                "precio_maximo": max(precios),
                "registros": len(precios)
            }
            for plaza, precios in precio_por_plaza.items()
        ]

        logger.info("Respuesta generada exitosamente")

        return {
            "producto": product_normalized,
            "filtro_aplicado": {
                "plaza": plaza_name if plaza_name else None,
                "descripcion": (
                    f"Resultados filtrados por: {plaza_name}"
                    if plaza_name
                    else "Mostrando todas las plazas disponibles"
                )
            },
            "total_resultados": len(prices),
            "plazas_incluidas": plazas_unicas,
            "estadisticas_por_plaza": sorted(
                estadisticas_plazas,
                key=lambda x: x["precio_promedio"]
            ),
            "resultados": prices
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


@router.get("/compare")
def compare_prices_across_plazas(
    product_name: str = Query(
        ...,
        description="Nombre del producto a comparar"
    )
) -> Dict:
    """
    Compare prices for a product across all marketplaces.

    This endpoint aggregates and compares pricing data for a specific product
    across all active marketplaces. It provides statistical analysis including
    average, minimum, and maximum prices per marketplace, and identifies the
    most economical and most expensive locations.

    Args:
        product_name (str): Name of the product to compare (required)

    Returns:
        Dict: A dictionary containing:
            - producto (str): Normalized product name
            - total_plazas (int): Number of marketplaces compared
            - analisis (Dict): Price analysis with:
                - plaza_mas_economica: Name of cheapest marketplace
                - precio_mas_bajo: Lowest average price
                - plaza_mas_costosa: Name of most expensive marketplace
                - precio_mas_alto: Highest average price
                - diferencia_absoluta: Absolute price difference
                - diferencia_porcentual: Percentage difference
            - comparacion_por_plaza (List[Dict]): Detailed comparison per
                marketplace with statistics and most recent data date

    Raises:
        HTTPException: 404 if no prices found for the product
        HTTPException: 500 if database error occurs

    Example:
        >>> response = compare_prices_across_plazas(product_name="Tomate")
        >>> print(response['analisis']['plaza_mas_economica'])
        'Plaza Minorista'
    """
    db = SessionLocal()
    try:
        logger.info(f"Comparando precios para producto: {product_name}")

        product_normalized = (
            product_name.replace("-", " ").replace("_", " ").strip()
        )

        query = """
            SELECT
                plz.nombre AS plaza,
                plz.ciudad,
                AVG(p.precio_por_kg) AS precio_promedio,
                MIN(p.precio_por_kg) AS precio_minimo,
                MAX(p.precio_por_kg) AS precio_maximo,
                COUNT(*) AS num_registros,
                MAX(p.fecha) AS fecha_mas_reciente
            FROM precios AS p
            JOIN productos AS prod ON p.producto_id = prod.producto_id
            JOIN plazas_mercado AS plz ON p.plaza_id = plz.plaza_id
            WHERE LOWER(REPLACE(REPLACE(prod.nombre, ' ', ''), '-', '')) =
                  LOWER(REPLACE(REPLACE(:product_name, ' ', ''), '-', ''))
            AND plz.estado = 'activa'
            GROUP BY plz.plaza_id, plz.nombre, plz.ciudad
            ORDER BY precio_promedio ASC
        """

        result = db.execute(
            text(query),
            {"product_name": product_normalized}
        ).fetchall()

        if not result:
            raise HTTPException(
                status_code=404,
                detail=(
                    f"No se encontraron precios para '{product_name}' "
                    "en ninguna plaza."
                )
            )

        comparacion = [
            {
                "plaza": row.plaza,
                "ciudad": row.ciudad,
                "precio_promedio": round(float(row.precio_promedio), 2),
                "precio_minimo": float(row.precio_minimo),
                "precio_maximo": float(row.precio_maximo),
                "num_registros": row.num_registros,
                "fecha_mas_reciente": str(row.fecha_mas_reciente)
            }
            for row in result
        ]

        # Find best and worst prices
        mejor_precio = min(comparacion, key=lambda x: x["precio_promedio"])
        peor_precio = max(comparacion, key=lambda x: x["precio_promedio"])
        diferencia = round(
            peor_precio["precio_promedio"] - mejor_precio["precio_promedio"],
            2
        )
        porcentaje_diferencia = round(
            (diferencia / mejor_precio["precio_promedio"]) * 100,
            2
        )

        logger.info(f"Comparación completada: {len(comparacion)} plazas")

        return {
            "producto": product_normalized,
            "total_plazas": len(comparacion),
            "analisis": {
                "plaza_mas_economica": mejor_precio["plaza"],
                "precio_mas_bajo": mejor_precio["precio_promedio"],
                "plaza_mas_costosa": peor_precio["plaza"],
                "precio_mas_alto": peor_precio["precio_promedio"],
                "diferencia_absoluta": diferencia,
                "diferencia_porcentual": f"{porcentaje_diferencia}%"
            },
            "comparacion_por_plaza": comparacion
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error en comparación: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Error al comparar precios: {str(e)}"
        )
    finally:
        db.close()