"""
Price routes module for product queries in market plazas.

This module provides endpoints to query updated prices, list available
products and market plazas in Medellín.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import SessionLocal

router = APIRouter(prefix="/prices", tags=["Prices"])


# --- Database dependency ---
def get_db():
    """
    Database session generator.

    Creates a new SQLAlchemy session for each request and guarantees
    its proper closure after use.

    Yields:
        Session: Active database session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --- Endpoint 1: Get the latest price ---
@router.get("/latest/")
def get_latest_price(
    product_name: str,
    market_name: str,
    db: Session = Depends(get_db)
):
    """
    Retrieve the most recent price of a product in a specific plaza.

    Searches for the last recorded price for a product in a market plaza
    in Medellín. If no exact matches are found, it suggests similar products
    based on the first characters of the name.

    Args:
        product_name (str): Name of the product to search (accepts partial
                           matches, case-insensitive).
        market_name (str): Name of the market plaza (accepts partial
                          matches, case-insensitive).
        db (Session): Database session injected by dependency.

    Returns:
        dict: Dictionary with the following fields:
            - producto (str): Name of the product found.
            - plaza (str): Name of the market plaza.
            - precio_por_kg (float): Price per kilogram in COP.
            - ultima_actualizacion (date): Date of the last record.
            - mensaje (str): Confirmation message.

    Raises:
        HTTPException: 404 if product/plaza is not found, includes
                      suggestions for similar products if available.

    Example:
        >>> get_latest_price("tomate", "minorista", db)
        {
            "producto": "Tomate chonto",
            "plaza": "Minorista",
            "precio_por_kg": 2500.0,
            "ultima_actualizacion": "2025-10-12",
            "mensaje": "Consulta realizada exitosamente."
        }
    """
    # Main query: search for the most recent price
    query = text("""
        SELECT p.precio_por_kg, p.fecha, pr.nombre AS producto, pl.nombre AS plaza
        FROM precios p
        JOIN productos pr ON pr.producto_id = p.producto_id
        JOIN plazas_mercado pl ON pl.plaza_id = p.plaza_id
        WHERE pr.nombre ILIKE :product_name
          AND pl.nombre ILIKE :market_name
          AND pl.ciudad = 'Medellín'
        ORDER BY p.fecha DESC
        LIMIT 1
    """)

    result = db.execute(
        query,
        {
            "product_name": f"%{product_name}%",
            "market_name": f"%{market_name}%"
        }
    ).fetchone()

    # If no results, search for similar products to suggest
    if not result:
        suggestion_query = text("""
            SELECT nombre 
            FROM productos
            WHERE nombre ILIKE :similar
            ORDER BY nombre ASC
            LIMIT 5
        """)
        
        suggestions = db.execute(
            suggestion_query,
            {"similar": f"%{product_name[:3]}%"}
        ).fetchall()
        
        suggested_names = [s.nombre for s in suggestions]

        if suggested_names:
            raise HTTPException(
                status_code=404,
                detail={
                    "message": (
                        "No exact results found. "
                        "Did you mean one of these?"
                    ),
                    "suggestions": suggested_names
                }
            )
        else:
            raise HTTPException(
                status_code=404,
                detail="No results found for your search."
            )

    return {
        "producto": result.producto,
        "plaza": result.plaza,
        "precio_por_kg": float(result.precio_por_kg),
        "ultima_actualizacion": result.fecha,
        "mensaje": "Consulta realizada exitosamente."
    }


# --- Endpoint 2: Get all available options ---
@router.get("/options/")
def get_options(db: Session = Depends(get_db)):
    """
    Get all available options for price queries.

    Returns complete lists of available products and market plazas
    in Medellín, useful for populating forms or selectors in frontend.

    Args:
        db (Session): Database session injected by dependency.

    Returns:
        dict: Dictionary with the following fields:
            - productos (list[dict]): List of products with id and name.
            - plazas (list[dict]): List of plazas with id, name and city.
            - mensaje (str): Confirmation message.

    Example:
        >>> get_options(db)
        {
            "productos": [
                {"id": 1, "nombre": "Tomate chonto"},
                {"id": 2, "nombre": "Cebolla cabezona"}
            ],
            "plazas": [
                {"id": 1, "nombre": "Minorista", "ciudad": "Medellín"}
            ],
            "mensaje": "Opciones disponibles obtenidas correctamente."
        }
    """
    # Get all available products
    productos_query = text("""
        SELECT producto_id, nombre
        FROM productos
        ORDER BY nombre ASC
    """)
    productos = db.execute(productos_query).fetchall()

    # Get all market plazas in Medellín
    plazas_query = text("""
        SELECT plaza_id, nombre, ciudad
        FROM plazas_mercado
        WHERE ciudad ILIKE 'Medellín'
        ORDER BY nombre ASC
    """)
    plazas = db.execute(plazas_query).fetchall()

    return {
        "productos": [
            {"id": row.producto_id, "nombre": row.nombre}
            for row in productos
        ],
        "plazas": [
            {
                "id": row.plaza_id,
                "nombre": row.nombre,
                "ciudad": row.ciudad
            }
            for row in plazas
        ],
        "mensaje": "Opciones disponibles obtenidas correctamente."
    }


# --- Endpoint 3: List all products ---
@router.get("/products/")
def list_products(db: Session = Depends(get_db)):
    """
    List all available products in the system.

    Returns a complete list of products ordered alphabetically,
    without additional filters.

    Args:
        db (Session): Database session injected by dependency.

    Returns:
        dict: Dictionary with the following fields:
            - productos (list[dict]): List of products with id and name.
            - mensaje (str): Confirmation message.

    Example:
        >>> list_products(db)
        {
            "productos": [
                {"id": 1, "nombre": "Aguacate"},
                {"id": 2, "nombre": "Arveja verde"}
            ],
            "mensaje": "Lista de productos obtenida exitosamente."
        }
    """
    query = text("""
        SELECT producto_id, nombre
        FROM productos
        ORDER BY nombre ASC
    """)
    result = db.execute(query).fetchall()

    return {
        "productos": [
            {"id": row.producto_id, "nombre": row.nombre}
            for row in result
        ],
        "mensaje": "Lista de productos obtenida exitosamente."
    }


# --- Endpoint 4: List all markets in Medellín ---
@router.get("/markets/medellin/")
def list_medellin_markets(db: Session = Depends(get_db)):
    """
    List all market plazas located in Medellín.

    Returns a complete list of market plazas filtered by city,
    ordered alphabetically by name.

    Args:
        db (Session): Database session injected by dependency.

    Returns:
        dict: Dictionary with the following fields:
            - plazas (list[dict]): List of plazas with id, name and city.
            - mensaje (str): Confirmation message.

    Example:
        >>> list_medellin_markets(db)
        {
            "plazas": [
                {"id": 1, "nombre": "Minorista", "ciudad": "Medellín"},
                {"id": 2, "nombre": "La América", "ciudad": "Medellín"}
            ],
            "mensaje": "Lista de plazas de Medellín obtenida exitosamente."
        }
    """
    query = text("""
        SELECT plaza_id, nombre, ciudad
        FROM plazas_mercado
        WHERE ciudad = 'Medellín'
        ORDER BY nombre ASC
    """)
    result = db.execute(query).fetchall()

    return {
        "plazas": [
            {
                "id": row.plaza_id,
                "nombre": row.nombre,
                "ciudad": row.ciudad
            }
            for row in result
        ],
        "mensaje": "Lista de plazas de Medellín obtenida exitosamente."
    }