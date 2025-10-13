"""
This module provides a RESTful endpoint for retrieving and analyzing
the historical price variation of products over a specified period.
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
    Finds products with similar names using partial matching.
    
    Args:
        db: Database session
        product_name (str): Product name to search for
        limit (int): Maximum number of suggestions to return
        
    Returns:
        List[str]: List of similar product names
    """
    try:
        query = text("""
            SELECT DISTINCT prod.nombre
            FROM productos AS prod
            WHERE LOWER(prod.nombre) LIKE LOWER(:search_pattern)
            LIMIT :limit
        """)
        
        search_pattern = f"%{product_name}%"
        result = db.execute(query, {
            "search_pattern": search_pattern,
            "limit": limit
        }).fetchall()
        
        return [row[0] for row in result]
    except Exception:
        return []


def analyze_periods(history: List[Dict]) -> List[Dict]:
    """
    Analyzes the product's price history to detect trend periods.

    This function identifies consecutive periods of price increase,
    decrease, or stability based on a ±2% variation threshold.

    Args:
        history (List[Dict]): List of price records with 'fecha' and 'precio_por_kg' keys.

    Returns:
        List[Dict]: List of detected trend periods, each including:
            - fecha_inicio: Period start date
            - fecha_fin: Period end date
            - precio_inicio: Initial price in the period
            - precio_fin: Final price in the period
            - tendencia: Type of trend ("Aumento", "Disminución", "Estabilidad")
            - variacion_porcentual: Percentage change across the period
    """
    if len(history) < 2:
        return []

    periods = []
    i = 0

    while i < len(history) - 1:
        period_start = history[i]
        initial_price = period_start["precio_por_kg"]
        current_trend = None
        j = i + 1

        # Identify how far the current trend continues
        while j < len(history):
            current_price = history[j]["precio_por_kg"]
            previous_price = history[j - 1]["precio_por_kg"]

            # Calculate percentage variation
            variation = ((current_price - previous_price) / previous_price) * 100

            # Determine the trend type
            if variation > 2:
                new_trend = "Aumento"
            elif variation < -2:
                new_trend = "Disminución"
            else:
                new_trend = "Estabilidad"

            # If trend changes, close the period
            if current_trend is None:
                current_trend = new_trend
            elif current_trend != new_trend:
                break

            j += 1

        # Register detected period
        period_end = history[j - 1]
        period_variation = ((period_end["precio_por_kg"] - initial_price) / initial_price) * 100

        periods.append({
            "fecha_inicio": period_start["fecha"],
            "fecha_fin": period_end["fecha"],
            "precio_inicio": initial_price,
            "precio_fin": period_end["precio_por_kg"],
            "tendencia": current_trend,
            "variacion_porcentual": round(period_variation, 2)
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

    Queries the database for price data of the given product within
    the specified time range, calculates general statistics, detects
    trend periods, and returns a structured JSON response in Spanish.

    Args:
        product_name (str): Name of the product to analyze.
        months (int): Number of months to include in the query (default: 12).

    Returns:
        Dict: JSON object containing:
            - producto: Normalized product name
            - periodo_meses: Number of months analyzed
            - fecha_inicio, fecha_fin: Range of analyzed data
            - tendencia_general: Global trend ("Aumento", "Disminución", "Estabilidad")
            - estadisticas: General numeric metrics
            - periodos: List of detected trend periods
            - historial: Detailed chronological list of prices

    Raises:
        HTTPException:
            - 404 if no data found (with suggestions if partial match found)
            - 500 if an SQL or database error occurs
    """
    db = SessionLocal()
    try:
        # Normalize input product name for comparison
        product_name_normalized = product_name.replace("-", " ").replace("_", " ").strip()

        # Define SQL query for product price history
        query = text("""
            SELECT 
                p.fecha,
                p.precio_por_kg
            FROM precios AS p
            JOIN productos AS prod ON p.producto_id = prod.producto_id
            WHERE LOWER(REPLACE(REPLACE(prod.nombre, ' ', ''), '-', '')) = 
                  LOWER(REPLACE(REPLACE(:product_name, ' ', ''), '-', ''))
              AND p.fecha >= :start_date
            ORDER BY p.fecha ASC
        """)

        # Compute time window start date
        start_date = datetime.utcnow() - timedelta(days=30 * months)

        # Execute SQL query and handle possible exceptions
        try:
            result = db.execute(query, {
                "product_name": product_name_normalized,
                "start_date": start_date
            }).fetchall()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error en la base de datos: {str(e)}")

        # Handle empty result set - try to find similar products
        if not result:
            similar_products = find_similar_products(db, product_name_normalized)
            
            if similar_products:
                suggestions = ", ".join(similar_products)
                raise HTTPException(
                    status_code=404,
                    detail=f"No se encontraron datos históricos para '{product_name}' en los últimos {months} meses. ¿Quisiste decir alguno de estos productos? {suggestions}"
                )
            else:
                raise HTTPException(
                    status_code=404,
                    detail=f"No se encontraron datos históricos para '{product_name}' en los últimos {months} meses."
                )

        # Convert results into structured history list
        history = []
        for r in result:
            date_value = r[0]
            if isinstance(date_value, str):
                try:
                    date_value = datetime.fromisoformat(date_value)
                except Exception:
                    pass  # Keep as string if cannot parse

            history.append({
                "fecha": date_value.isoformat() if hasattr(date_value, "isoformat") else str(date_value),
                "precio_por_kg": float(r[1])
            })

        # Compute overall statistics
        initial_price = history[0]["precio_por_kg"]
        final_price = history[-1]["precio_por_kg"]
        percent_variation = ((final_price - initial_price) / initial_price) * 100

        if percent_variation > 5:
            overall_trend = "Aumento"
        elif percent_variation < -5:
            overall_trend = "Disminución"
        else:
            overall_trend = "Estabilidad"

        prices = [item["precio_por_kg"] for item in history]
        average_price = sum(prices) / len(prices)
        max_price = max(prices)
        min_price = min(prices)

        # Detect specific trend periods
        periods = analyze_periods(history)

        # Return structured response in Spanish
        return {
            "producto": product_name_normalized,
            "periodo_meses": months,
            "fecha_inicio": history[0]["fecha"],
            "fecha_fin": history[-1]["fecha"],
            "tendencia_general": overall_trend,
            "estadisticas": {
                "precio_inicial": initial_price,
                "precio_final": final_price,
                "precio_promedio": round(average_price, 2),
                "precio_maximo": max_price,
                "precio_minimo": min_price,
                "variacion_porcentual": round(percent_variation, 2),
                "total_registros": len(history)
            },
            "periodos": periods,
            "historial": history
        }

    finally:
        # Ensure DB session is always closed
        db.close()