"""
Prediction routes module.

This module exposes endpoints to trigger price predictions for products.
It connects with the Prophet-based prediction service and returns
forecasted prices along with the path of the generated Plotly graph.
"""

from fastapi import APIRouter, Query
from fastapi import Request
from fastapi.responses import FileResponse
from typing import Optional
from services.prediction_service import predict_prices
import os

router = APIRouter(
    prefix="/predictions",
    tags=["Predictions"]
)

@router.get("/")
def get_prediction(
    request: Request,
    product_name: str = Query(...),
    months_ahead: Optional[int] = Query(6)
):
    result = predict_prices(product_name, months_ahead)

    if "error" in result:
        return {"status": "error", "message": result["error"]}

    # Build full URL for the graph
    base_url = str(request.base_url).rstrip("/")
    graph_url = f"{base_url}/predictions/graph?product_name={product_name}"

    return {
        "status": "success",
        "product": product_name,
        "months_ahead": months_ahead,
        "graph_url": graph_url,
        "predictions": result
    }