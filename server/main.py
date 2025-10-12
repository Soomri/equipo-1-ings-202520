# main.py
from fastapi import FastAPI
from routers_ import auth, password_recovery
from routers.prices import router as prices_router
from database import Base, engine
from dotenv import load_dotenv


# ===============================
# ENVIRONMENT & DATABASE SETUP
# ===============================

# Load environment variables from .env file
load_dotenv()

# Create all database tables if they don't exist
# This runs synchronously on application startup
Base.metadata.create_all(bind=engine)


# ===============================
# APPLICATION INITIALIZATION
# ===============================

app = FastAPI(title="Market Prices Plaze API 🛒")

# ===============================
# ROUTER REGISTRATION
# ===============================

# Authentication endpoints (login, logout)
app.include_router(auth.router, tags=["Auth"])

# Password recovery endpoints (request reset, reset password)
app.include_router(password_recovery.router, tags=["Password Recovery"])

# Price query endpoints (latest prices, products, markets)
app.include_router(prices_router, tags=["Prices"])

# ===============================
# ROOT ENDPOINT
# ===============================

@app.get("/")
def root():
    """
    Check the endpoint for API status verification.

    This endpoint provides a simple way to verify that the API is running
    and accessible. Useful for monitoring systems, load balancers, and
    integration tests.

    Returns:
        dict: Status message with the following field:
            - message (str): Confirmation that API is operational.

    Example:
        >>> import requests
        >>> response = requests.get("http://localhost:8000/")
        >>> print(response.json())
        {"message": "API funcionando 🚀"}

    Status Codes:
        200: API is running normally
    """
    return {"message": "API funcionando 🚀"}