import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_login_success():
    """Test successful login returns token and correct message"""
    response = client.post("/auth/login", json={"email": "lau24091@gmail.com", "password": "@Apolo1234"})
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["mensaje"] == "Inicio de sesión exitoso"


def test_login_invalid_password():
    """Test invalid password returns 400 error"""
    response = client.post("/auth/login", json={"email": "lau24091@gmail.com", "password": "incorrecta"})
    assert response.status_code == 400


def test_login_invalid_email_format():
    """Test invalid email format returns validation error"""
    response = client.post("/auth/login", json={"email": "correo_invalido", "password": "123"})
    assert response.status_code == 422


def test_logout_success():
    """Test successful logout"""
    login = client.post("/auth/login", json={"email": "lau24091@gmail.com", "password": "@Apolo1234"})
    token = login.json().get("access_token")
    logout = client.post("/auth/logout", headers={"Authorization": f"Bearer {token}"})
    assert logout.status_code == 200


def test_full_auth_flow():
    """Integration: login -> logout"""
    login = client.post("/auth/login", json={"email": "lau24091@gmail.com", "password": "@Apolo1234"})
    assert login.status_code == 200
    token = login.json()["access_token"]

    logout = client.post("/auth/logout", headers={"Authorization": f"Bearer {token}"})
    assert logout.status_code == 200
