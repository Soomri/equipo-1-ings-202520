"""
Price History API module.

This module provides a RESTful endpoint for retrieving and analyzing
the historical price variation of products over a specified period.
It uses the `historial_precios` table to include multiple time points
and provides trend analysis, statistical summaries, and period detection.
"""

from fastapi import APIRouter, HTTPException, Query
from database import SessionLocal
from sqlalchemy import text
from datetime import datetime, timedelta
from typing import List, Dict

# Initialize router for the Price History API
router = APIRouter(
    prefix="/price-history",
    tags=["Price History"]
)


def find_similar_products(db, product_name: str, limit: int = 5) -> List[str]:
    """
    Find products with similar names using partial matching.

    This function performs a case-insensitive search for products whose
    names contain the search term. It's useful for suggesting alternatives
    when an exact match is not found.

    Args:
        db: SQLAlchemy database session for executing queries.
        product_name (str): The product name to search for (supports partial matches).
        limit (int, optional): Maximum number of similar products to return.
            Defaults to 5.

    Returns:
        List[str]: List of product names that match the search pattern.
            Returns empty list if no matches found or if an error occurs.

    Example:
        >>> similar = find_similar_products(db, "tomate", limit=3)
        >>> print(similar)
        ['Tomate', 'Tomate cherry', 'Tomate de árbol']
    """
    try:
        query = text("""
            SELECT DISTINCT prod.nombre
            FROM productos AS prod
            WHERE LOWER(prod.nombre) LIKE LOWER(:search_pattern)
            LIMIT :limit
        """)
        result = db.execute(query, {
            "search_pattern": f"%{product_name}%",
            "limit": limit
        }).fetchall()
        return [row[0] for row in result]
    except Exception:
        return []


def analyze_periods(history: List[Dict]) -> List[Dict]:
    """
    Analyze product price history to detect trend periods.

    This function identifies consecutive periods where prices follow a
    consistent trend (increase, decrease, or stability) and calculates
    the percentage variation for each period.

    Args:
        history (List[Dict]): List of historical price records, each containing:
            - fecha (str): Date in ISO format
            - precio_por_kg (float): Price per kilogram

    Returns:
        List[Dict]: List of detected trend periods, each containing:
            - fecha_inicio (str): Period start date
            - fecha_fin (str): Period end date
            - precio_inicio (float): Initial price
            - precio_fin (float): Final price
            - tendencia (str): Trend type ("Aumento", "Disminución", "Estabilidad")
            - variacion_porcentual (float): Percentage change during the period

    Example:
        >>> history = [
        ...     {"fecha": "2024-01-01", "precio_por_kg": 100},
        ...     {"fecha": "2024-02-01", "precio_por_kg": 110},
        ...     {"fecha": "2024-03-01", "precio_por_kg": 105}
        ... ]
        >>> periods = analyze_periods(history)
        >>> print(periods[0]["tendencia"])
        'Aumento'

    Note:
        A variation greater than 2% is considered an increase, less than -2%
        is a decrease, and between -2% and 2% is considered stability.
    """
    if len(history) < 2:
        return []

    periods = []
    i = 0

    while i < len(history) - 1:
        start = history[i]
        initial_price = start["precio_por_kg"]
        trend = None
        j = i + 1

        while j < len(history):
            current_price = history[j]["precio_por_kg"]
            previous_price = history[j - 1]["precio_por_kg"]
            variation = ((current_price - previous_price) / previous_price) * 100

            if variation > 2:
                new_trend = "Aumento"
            elif variation < -2:
                new_trend = "Disminución"
            else:
                new_trend = "Estabilidad"

            if trend is None:
                trend = new_trend
            elif trend != new_trend:
                break

            j += 1

        end = history[j - 1]
        total_var = ((end["precio_por_kg"] - initial_price) / initial_price) * 100

        periods.append({
            "fecha_inicio": start["fecha"],
            "fecha_fin": end["fecha"],
            "precio_inicio": initial_price,
            "precio_fin": end["precio_por_kg"],
            "tendencia": trend,
            "variacion_porcentual": round(total_var, 2)
        })

        i = j

    return periods


@router.get("/{product_name}")
def get_price_history(
    product_name: str,
    months: int = Query(
        12,
        ge=1,
        le=120,
        description="Número de meses a consultar (mín: 1, máx: 120, por defecto: 12)"
    )
) -> Dict:
    """
    Retrieve and analyze the historical price variation of a product.
    Only returns data if the associated market (plaza) is active.
    """
    db = SessionLocal()
    try:
        # Validate months parameter
        if months < 1 or months > 120:
            raise HTTPException(
                status_code=400,
                detail=f"El parámetro 'months' debe estar entre 1 y 120 (recibido: {months})."
            )

        product_name_normalized = product_name.replace("-", " ").replace("_", " ").strip()

        # Validate plaza status before proceeding
        check_query = text("""
            SELECT plz.estado
            FROM precios AS pr
            JOIN productos AS prod ON prod.producto_id = pr.producto_id
            JOIN plazas_mercado AS plz ON pr.plaza_id = plz.plaza_id
            WHERE LOWER(REPLACE(REPLACE(prod.nombre, ' ', ''), '-', '')) =
                LOWER(REPLACE(REPLACE(:product_name, ' ', ''), '-', ''))
            LIMIT 1
        """)

        plaza_status = db.execute(check_query, {"product_name": product_name_normalized}).fetchone()

        if plaza_status and plaza_status[0].lower() != "activa":
            raise HTTPException(status_code=403, detail="El mercado asociado a este producto está inactivo.")

        start_date = datetime.utcnow() - timedelta(days=30 * months)

        # Main query (includes filter for active plazas)
        query = text("""
            SELECT 
                hp.fecha_precio AS fecha,
                hp.precio_historico AS precio_por_kg
            FROM historial_precios AS hp
            JOIN precios AS pr ON hp.precio_id = pr.precio_id
            JOIN productos AS prod ON pr.producto_id = prod.producto_id
            JOIN plazas_mercado AS plz ON pr.plaza_id = plz.plaza_id
            WHERE LOWER(REPLACE(REPLACE(prod.nombre, ' ', ''), '-', '')) = 
                  LOWER(REPLACE(REPLACE(:product_name, ' ', ''), '-', ''))
              AND plz.estado = 'activa'
              AND hp.fecha_precio >= :start_date
            ORDER BY hp.fecha_precio ASC
        """)

        result = db.execute(query, {
            "product_name": product_name_normalized,
            "start_date": start_date
        }).fetchall()

        # Handle no data found
        if not result:
            similar = find_similar_products(db, product_name_normalized)
            if similar:
                raise HTTPException(
                    status_code=404,
                    detail=f"No se encontró historial de precios para '{product_name}'. ¿Quizás quiso decir: {', '.join(similar)}?"
                )
            raise HTTPException(
                status_code=404,
                detail=f"No se encontraron datos históricos para '{product_name}' en los últimos {months} meses "
                       f"o el mercado asociado está inactivo."
            )

        # Build structured history
        history = [{
            "fecha": (r[0].isoformat() if hasattr(r[0], "isoformat") else str(r[0])),
            "precio_por_kg": float(r[1])
        } for r in result]

        # Basic statistics
        initial_price = history[0]["precio_por_kg"]
        final_price = history[-1]["precio_por_kg"]
        percent_change = ((final_price - initial_price) / initial_price) * 100

        if percent_change > 5:
            trend_general = "Aumento"
        elif percent_change < -5:
            trend_general = "Disminución"
        else:
            trend_general = "Estabilidad"

        prices = [p["precio_por_kg"] for p in history]
        avg_price = sum(prices) / len(prices)

        # Detect specific trend periods
        periods = analyze_periods(history)

        return {
            "producto": product_name_normalized,
            "periodo_meses": months,
            "fecha_inicio": history[0]["fecha"],
            "fecha_fin": history[-1]["fecha"],
            "tendencia_general": trend_general,
            "estadisticas": {
                "precio_inicial": initial_price,
                "precio_final": final_price,
                "precio_promedio": round(avg_price, 2),
                "precio_maximo": max(prices),
                "precio_minimo": min(prices),
                "variacion_porcentual": round(percent_change, 2),
                "total_registros": len(history)
            },
            "periodos": periods,
            "historial": history
        }

    finally:
        db.close()
