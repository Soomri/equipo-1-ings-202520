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
from routers_ import plazas_routes
from routers_.health_routes import router as health_router
from routers_.maintenance_routes import router as maintenance_router
from routers_.price_history import router as price_history_router
from routers_.markets import router as markets_router
from routers_.market_filter import router as market_filter_router
from routers_.prediction_routes import router as prediction_router
from routers_.auth import router as auth_router
from routers_.plazas_routes import router as plazas_router
from routers_.plaza_router import router as plaza_router
from routers_.markets import router as markets_router
from routers_.prediction_routes import router as prediction_router
from routers_.market_filter import router as market_filter_router


# Create tables if they do not exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Market Prices Plaze API 🛒")

bearer_scheme = HTTPBearer()

# ========================================
# CORS Configuration
# ========================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========================================
# Global error handler
# ========================================
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    if exc.status_code == 403:
        return JSONResponse(status_code=403, content={"detail": "Acceso prohibido: no tienes permisos o no estás autenticado."})
    elif exc.status_code == 401:
        return JSONResponse(status_code=401, content={"detail": "No estás autenticado o tu token no es válido."})
    else:
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

# ========================================
# Routers
# ========================================
app.include_router(user_registration_router)
app.include_router(auth.router)
app.include_router(password_recovery.router, tags=["Password Recovery"])
app.include_router(prices_router, tags=["Prices"])
app.include_router(health_router)
app.include_router(maintenance_router)
app.include_router(price_history_router)

# --- Market & Plaza routes ---
app.include_router(plaza_router, tags=["Plazas de Mercado"])  # Public GET endpoints
app.include_router(plazas_routes.router)  # Admin POST/PUT/DELETE endpoints
app.include_router(markets_router, tags=["Markets"])
app.include_router(prediction_router)
app.include_router(market_filter_router, tags=["Product Prices"])


@app.get("/")
def root():
    """Root endpoint of the API."""
    return {"message": "API funcionando 🚀"}
