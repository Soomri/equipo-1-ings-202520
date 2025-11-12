"""
Main application module for Market Prices Plaze API.

This module initializes the FastAPI application, configures CORS middleware,
creates database tables, and registers all API routers for different
functional domains (authentication, prices, health checks, etc.).
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware  # CORS middleware for cross-origin requests
from fastapi.security import HTTPBearer
from routers_.user_registration import router as user_registration_router
from routers_ import auth, password_recovery
from routers_.prices import router as prices_router
from database import Base, engine
from dotenv import load_dotenv
from routers_ import plazas_routes, auth
from routers_.health_routes import router as health_router
from routers_.maintenance_routes import router as maintenance_router
from routers_.price_history import router as price_history_router
from routers_.auth import router as auth_router
from routers_.plazas_routes import router as plazas_router

# Load environment variables
load_dotenv()

# Create tables if they do not exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Market Prices Plaze API 🛒")

bearer_scheme = HTTPBearer()

# ========================================
# CORS Configuration
# ========================================
# Enable Cross-Origin Resource Sharing (CORS) to allow frontend requests
# This is required for the React frontend to communicate with the API
# Allowed origins include common development ports (3000, 5173)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",      # Create React App default port
        "http://localhost:5173",      # Vite default port
        "http://127.0.0.1:3000",      # Alternative localhost notation
        "http://127.0.0.1:5173",      # Alternative localhost notation (Vite)
    ],
    allow_credentials=True,           # Allow cookies and authentication headers
    allow_methods=["*"],              # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],              # Allow all headers (including Authorization)
)

#  Global error handler  
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    # Handle forbidden access (403)
    if exc.status_code == 403:
        return JSONResponse(
            status_code=403,
            content={"detail": "Acceso prohibido: no tienes permisos o no estás autenticado."}
        )
    # Handle unauthorized access (401)
    elif exc.status_code == 401:
        return JSONResponse(
            status_code=401,
            content={"detail": "No estás autenticado o tu token no es válido."}
        )
    # Default behavior for other HTTP exceptions
    else:
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail},
        )


# Include routers
app.include_router(user_registration_router)
app.include_router(auth.router)
app.include_router(password_recovery.router, tags=["Password Recovery"])
app.include_router(prices_router, tags=["Prices"])
app.include_router(health_router)
app.include_router(maintenance_router)
app.include_router(price_history_router)
app.include_router(plazas_routes.router)


@app.get("/")
def root():
    """
    Root endpoint of the API.

    This endpoint serves as a simple health check and welcome message
    for the Market Prices Plaze API. It confirms that the application
    is running and accessible.

    Returns:
        dict: A dictionary containing:
            - message (str): Confirmation message that the API is operational.

    Example:
        >>> response = root()
        >>> print(response)
        {'message': 'API funcionando 🚀'}

    Note:
        This endpoint does not require authentication and can be used
        for basic connectivity testing.
    """
    return {"message": "API funcionando 🚀"}