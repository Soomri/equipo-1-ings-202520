import pytest
from unittest.mock import MagicMock

@pytest.fixture(autouse=True)
def mock_supabase(monkeypatch):
    """Avoids real connection to Supabase during tests"""
    mock_client = MagicMock()
    monkeypatch.setattr("routers_.user_registration.create_client", lambda url, key: mock_client)
