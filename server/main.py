"""
Main application module for Market Prices Plaze API.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers_.user_registration import router as user_registration_router
from routers_ import auth, password_recovery
from routers_.prices import router as prices_router
from database import Base, engine
from dotenv import load_dotenv
from routers_.health_routes import router as health_router
from routers_.maintenance_routes import router as maintenance_router
from routers_.price_history import router as price_history_router
from routers_.prediction_routes import router as prediction_router  # 👈 AGREGAR ESTA LÍNEA

# Load environment variables
load_dotenv()

# Create tables if they do not exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Market Prices Plaze API 🛒")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(user_registration_router)
app.include_router(auth.router, tags=["Auth"])
app.include_router(password_recovery.router, tags=["Password Recovery"])
app.include_router(prices_router, tags=["Prices"])
app.include_router(health_router)
app.include_router(maintenance_router)
app.include_router(price_history_router)
app.include_router(prediction_router)  # 👈 AGREGAR ESTA LÍNEA

@app.get("/")
def root():
    return {"message": "API funcionando 🚀"}