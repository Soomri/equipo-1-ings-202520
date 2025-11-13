import pytest
from unittest.mock import MagicMock

@pytest.fixture(autouse=True)
def mock_supabase(monkeypatch):
    """Evita conexión real a Supabase durante los tests."""
    mock_client = MagicMock()
    monkeypatch.setattr("routers_.user_registration.create_client", lambda url, key: mock_client)
