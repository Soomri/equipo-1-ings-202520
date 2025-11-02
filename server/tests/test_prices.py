import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


# ===============================
# TESTS FOR MVP: Price Consultation
# ===============================

def test_get_latest_price_success():
    """Should return latest price for Aguacate Común in active market."""
    response = client.get(
        "/prices/latest/",
        params={"product_name": "Aguacate Común", "market_name": "Plaza Minorista"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["producto"] == "Aguacate Común"
    assert data["precio_por_kg"] > 0


def test_get_latest_price_product_not_found():
    """Should return 404 if the product doesn't exist."""
    response = client.get(
        "/prices/latest/",
        params={"product_name": "ProductoInventado", "market_name": "Plaza Minorista"}
    )
    assert response.status_code == 404


def test_get_latest_price_market_not_found():
    """Should return 404 if the market doesn't exist."""
    response = client.get(
        "/prices/latest/",
        params={"product_name": "Aguacate Común", "market_name": "Plaza Fantasma"}
    )
    assert response.status_code == 404


def test_get_latest_price_inactive_market():
    """Should return 403 if the market is inactive."""
    response = client.get(
        "/prices/latest/",
        params={"product_name": "Aguacate Común", "market_name": "Plaza Inactiva"}
    )
    assert response.status_code in [403, 404]


def test_get_options_success():
    """Should list available products and active markets."""
    response = client.get("/prices/options/")
    assert response.status_code == 200
    data = response.json()

    assert "productos" in data
    assert "plazas" in data
    assert "mensaje" in data

    # Validate that Aguacate Común is among the products
    product_names = [p["nombre"] for p in data["productos"]]
    assert "Aguacate Común" in product_names

    # Validate structure (not content)
    if data["productos"]:
        product = data["productos"][0]
        assert "id" in product
        assert "nombre" in product

    if data["plazas"]:
        plaza = data["plazas"][0]
        assert "id" in plaza
        assert "nombre" in plaza
        assert "ciudad" in plaza

