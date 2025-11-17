"""
Load Balancer Simulator module.

This module implements a simple load balancer that distributes incoming
requests across multiple backend instances using a random selection algorithm.
"""

from fastapi import FastAPI
import httpx
import random

app = FastAPI(title="Load Balancer Simulator")

# List of backend instances (different ports)
BACKENDS = [
    "http://127.0.0.1:8000",
    "http://127.0.0.1:8001",
]

@app.get("/{path:path}")
async def proxy(path: str):
    """
    Forward the GET request to a randomly selected backend instance.

    This function acts as a reverse proxy, distributing incoming requests
    across available backend servers using random selection. It helps
    balance the load and provides basic fault tolerance.

    Args:
        path (str): The request path to forward to the backend instance.
            Captures all path segments after the base URL.

    Returns:
        dict: The JSON response from the backend instance if successful,
            or an error dictionary containing:
            - error (str): Error message indicating which backend failed.
            - details (str): Detailed exception information.

    Example:
        >>> # Request to /health will be forwarded to a random backend
        >>> # e.g., http://127.0.0.1:8000/health or http://127.0.0.1:8001/health
    """
    backend = random.choice(BACKENDS)
    url = f"{backend}/{path}"
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url)
            return response.json()
        except Exception as e:
            return {"error": f"Fallo en {backend}", "details": str(e)}