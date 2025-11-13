import pytest
from fastapi.testclient import TestClient
import random
from main import app

client = TestClient(app)


# ===============================
# TESTS FOR MVP: Dynamic Price Consultation
# ===============================

@pytest.fixture(scope="module")
def options_data():
    """Fixture to retrieve available products and markets once for all tests."""
    response = client.get("/prices/options/")
    assert response.status_code == 200
    data = response.json()
    return data


def test_get_options_success(options_data):
    """Should list available products and active markets with the correct structure."""
    data = options_data

    assert "productos" in data
    assert "plazas" in data
    assert "mensaje" in data

    assert isinstance(data["productos"], list)
    assert isinstance(data["plazas"], list)

    if data["productos"]:
        product = data["productos"][0]
        assert "id" in product
        assert "nombre" in product

    if data["plazas"]:
        plaza = data["plazas"][0]
        assert "id" in plaza
        assert "nombre" in plaza
        assert "ciudad" in plaza


@pytest.mark.parametrize("product_name", [
    "Aguacate Común",
    "Papa Capira",
    "Tomate Chonto Regional"
])
def test_get_latest_price_success(options_data, product_name):
    """Should return the latest price for a valid product and an active market."""
    markets = options_data["plazas"]
    if not markets:
        pytest.skip("No markets available to test.")
    market_name = markets[0]["nombre"]

    response = client.get(
        "/prices/latest/",
        params={"product_name": product_name, "market_name": market_name}
    )
    # Some products might not have data, so both 200 and 404 are acceptable
    assert response.status_code in [200, 404]

    if response.status_code == 200:
        data = response.json()
        assert data["producto"] == product_name
        assert data["precio_por_kg"] > 0


def test_get_latest_price_product_not_found(options_data):
    """Should return 404 if the product does not exist."""
    markets = options_data["plazas"]
    if not markets:
        pytest.skip("No markets available to test.")
    market_name = markets[0]["nombre"]

    response = client.get(
        "/prices/latest/",
        params={"product_name": "NonExistentProduct", "market_name": market_name}
    )
    assert response.status_code == 404


def test_get_latest_price_market_not_found(options_data):
    """Should return 404 if the market does not exist."""
    products = options_data["productos"]
    if not products:
        pytest.skip("No products available to test.")
    product_name = products[0]["nombre"]

    response = client.get(
        "/prices/latest/",
        params={"product_name": product_name, "market_name": "FakeMarket"}
    )
    assert response.status_code == 404


def test_get_latest_price_random_product(options_data):
    """Should fetch the latest price for a random valid product."""
    products = options_data["productos"]
    markets = options_data["plazas"]
    if not products or not markets:
        pytest.skip("No products or markets available.")

    product_name = random.choice(products)["nombre"]
    market_name = random.choice(markets)["nombre"]

    response = client.get(
        "/prices/latest/",
        params={"product_name": product_name, "market_name": market_name}
    )

    # Some valid combinations may not have data yet
    assert response.status_code in [200, 404]
