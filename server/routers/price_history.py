from fastapi import APIRouter, HTTPException, Query
from database import SessionLocal
from sqlalchemy import text
from datetime import datetime, timedelta
from typing import List, Dict

router = APIRouter(
    prefix="/price-history",
    tags=["Price History"]
)

def analyze_periods(history: List[Dict]) -> List[Dict]:
    """
    Analyzes price history and detects periods of increase, decrease or stability.
    """
    if len(history) < 2:
        return []
    
    periods = []
    i = 0
    
    while i < len(history) - 1:
        period_start = history[i]
        initial_price = period_start["price_per_kg"]
        current_trend = None
        j = i + 1
        
        # Find how far the same trend continues
        while j < len(history):
            current_price = history[j]["price_per_kg"]
            previous_price = history[j-1]["price_per_kg"]
            
            variation = ((current_price - previous_price) / previous_price) * 100
            
            # Determine segment trend
            if variation > 2:
                new_trend = "Increase"
            elif variation < -2:
                new_trend = "Decrease"
            else:
                new_trend = "Stability"
            
            # If trend changes, close the period
            if current_trend is None:
                current_trend = new_trend
            elif current_trend != new_trend:
                break
            
            j += 1
        
        # Register the period
        period_end = history[j-1]
        period_variation = ((period_end["price_per_kg"] - initial_price) / initial_price) * 100
        
        periods.append({
            "start_date": period_start["date"],
            "end_date": period_end["date"],
            "start_price": initial_price,
            "end_price": period_end["price_per_kg"],
            "trend": current_trend,
            "percent_variation": round(period_variation, 2)
        })
        
        i = j
    
    return periods


@router.get("/{product_name}")
def get_price_history(
    product_name: str, 
    months: int = Query(12, description="Number of months to query (default: 12)")
):
    db = SessionLocal()
    try:
        product_name_normalized = product_name.replace("-", " ").replace("_", " ").strip()

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

        start_date = datetime.utcnow() - timedelta(days=30 * months)

        try:
            result = db.execute(query, {
                "product_name": product_name_normalized,
                "start_date": start_date
            }).fetchall()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"SQL Error: {str(e)}")

        if not result:
            raise HTTPException(
                status_code=404,
                detail=f"No historical data found for {product_name} in the last {months} months."
            )

        history = []
        for r in result:
            date_value = r[0]
            if isinstance(date_value, str):
                try:
                    date_value = datetime.fromisoformat(date_value)
                except Exception:
                    pass  # keep as string if cannot parse
            history.append({
                "date": date_value.isoformat() if hasattr(date_value, "isoformat") else str(date_value),
                "price_per_kg": float(r[1])
            })

        initial_price = history[0]["price_per_kg"]
        final_price = history[-1]["price_per_kg"]
        percent_variation = ((final_price - initial_price) / initial_price) * 100

        if percent_variation > 5:
            overall_trend = "Increase"
        elif percent_variation < -5:
            overall_trend = "Decrease"
        else:
            overall_trend = "Stability"

        prices = [item["price_per_kg"] for item in history]
        average_price = sum(prices) / len(prices)
        max_price = max(prices)
        min_price = min(prices)

        periods = analyze_periods(history)

        return {
            "product": product_name_normalized,
            "period_months": months,
            "start_date": history[0]["date"],
            "end_date": history[-1]["date"],
            "overall_trend": overall_trend,
            "statistics": {
                "initial_price": initial_price,
                "final_price": final_price,
                "average_price": round(average_price, 2),
                "max_price": max_price,
                "min_price": min_price,
                "percent_variation": round(percent_variation, 2),
                "total_records": len(history)
            },
            "periods": periods,
            "history": history
        }

    finally:
        db.close()
