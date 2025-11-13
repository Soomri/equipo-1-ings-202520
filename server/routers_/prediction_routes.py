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


@router.get("/graph")
def get_prediction_graph(
    product_name: str = Query(...)
):
    """
    Serves the generated HTML graph for a product's price prediction.
    The graph is created by the Prophet model and saved as an HTML file.
    """
    # Construct the path to the HTML file
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    file_name = f"prediccion_{product_name.lower().replace(' ', '_')}.html"
    graph_path = os.path.join(base_dir, "data", file_name)

    # Check if file exists
    if not os.path.exists(graph_path):
        return {
            "status": "error",
            "message": f"No se encontró el gráfico para '{product_name}'. "
                      f"Genera primero la predicción usando el endpoint /predictions/"
        }

    # Serve the HTML file
    return FileResponse(
        path=graph_path,
        media_type="text/html",
        filename=file_name
    )