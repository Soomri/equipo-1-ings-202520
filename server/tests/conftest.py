import pytest
from unittest.mock import MagicMock

@pytest.fixture(autouse=True)
def mock_supabase(monkeypatch):
    """Avoids real connection to Supabase during tests"""
    # Fake environment variables so create_client doesn't fail
    monkeypatch.setenv("SUPABASE_URL", "https://fake-url.supabase.co")
    monkeypatch.setenv("SUPABASE_KEY", "fake-key")

    # Create a mock Supabase client
    mock_client = MagicMock()
    mock_client.auth = MagicMock()
    mock_client.table = MagicMock()

    # Replace create_client with a mock that returns the fake client
    monkeypatch.setattr("routers_.user_registration.create_client", lambda url, key: mock_client)

    # Return the mock so tests can optionally inspect it
    return mock_client
