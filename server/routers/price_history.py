"""
This module provides a RESTful endpoint for retrieving and analyzing
the historical price variation of products over a specified period.
Now it uses the table `historial_precios` to include multiple time points.
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
    """Finds products with similar names using partial matching."""
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
    """Analyzes the product's price history to detect trend periods."""
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
    months: int = Query(12, description="Número de meses a consultar (por defecto: 12)")
) -> Dict:
    """
    Retrieves and analyzes the historical price variation of a product.
    Uses historial_precios to ensure complete visualization of price changes.
    """
    db = SessionLocal()
    try:
        product_name_normalized = product_name.replace("-", " ").replace("_", " ").strip()
        start_date = datetime.utcnow() - timedelta(days=30 * months)

        # ✅ Query now uses historial_precios instead of precios
        query = text("""
            SELECT 
                hp.fecha_precio AS fecha,
                hp.precio_historico AS precio_por_kg
            FROM historial_precios AS hp
            JOIN productos AS prod ON hp.producto_id = prod.producto_id
            WHERE LOWER(REPLACE(REPLACE(prod.nombre, ' ', ''), '-', '')) = 
                  LOWER(REPLACE(REPLACE(:product_name, ' ', ''), '-', ''))
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
                    detail=f"No se encontraron datos para '{product_name}'. ¿Quisiste decir: {', '.join(similar)}?"
                )
            raise HTTPException(
                status_code=404,
                detail=f"No se encontraron datos históricos para '{product_name}' en los últimos {months} meses."
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
