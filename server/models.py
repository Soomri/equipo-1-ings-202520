"""
SQLAlchemy ORM models module.

This module defines all database models for the Market Prices Plaze API,
including user management, email verification, and market price tracking.
Models are organized into two main categories: user-related and market-related.

Note:
    Column names in Spanish are maintained to match the existing database schema.
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, DECIMAL, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

# ==========================
# 👤 User-related models
# ==========================
class User(Base):
    """
    ORM model for the users table.

    This model represents registered users in the system, including their
    authentication credentials, role assignments, and account security status.

    Attributes:
        usuario_id (int): Primary key, unique user identifier.
        nombre (str): User's full name.
        correo (str): User's email address (unique, indexed).
        contrasena_hash (str): Hashed password using Argon2.
        rol (str): User role, defaults to "usuario". Can be "admin" or "usuario".
        intentos_fallidos (int): Count of failed login attempts, defaults to 0.
        cuenta_bloqueada_hasta (datetime): Timestamp until account is locked,
            None if not locked.
        enlaces (relationship): One-to-many relationship with EmailLink model.

    Relationships:
        enlaces: List of email verification/recovery links associated with this user.
    """
    __tablename__ = "usuarios"

    usuario_id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    correo = Column(String, unique=True, index=True, nullable=False)
    contrasena_hash = Column(String, nullable=False)
    rol = Column(String, default="usuario")  # e.g. "usuario" or "admin"
    intentos_fallidos = Column(Integer, default=0)
    cuenta_bloqueada_hasta = Column(DateTime, nullable=True)

    enlaces = relationship("EmailLink", back_populates="user")


class EmailLink(Base):
    """
    ORM model for email verification and password recovery links.

    This model stores temporary links sent to users for email verification
    or password recovery purposes. Links have expiration times and can only
    be used once.

    Attributes:
        enlace_id (int): Primary key, unique link identifier.
        usuario_id (int): Foreign key referencing the user.
        enlace_url (str): Unique URL string for the link (max 500 chars).
        tipo (str): Link type, e.g., "password_recovery" or "email_verification"
            (max 30 chars).
        expira_en (datetime): Expiration timestamp for the link.
        usado (bool): Whether the link has been used, defaults to False.
        fecha_creacion (datetime): Link creation timestamp, defaults to UTC now.
        user (relationship): Many-to-one relationship with User model.

    Relationships:
        user: The user who owns this email link.
    """
    __tablename__ = "enlaces_correo"

    enlace_id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.usuario_id"), nullable=False)
    enlace_url = Column(String(500), unique=True, nullable=False)
    tipo = Column(String(30), nullable=False)
    expira_en = Column(DateTime, nullable=False)
    usado = Column(Boolean, default=False)
    fecha_creacion = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="enlaces")


# ==========================
# 🏪 Market-related models
# ==========================
class Price(Base):
    """
    ORM model for product prices at different markets.

    This model tracks historical and current prices of products across
    various market locations, enabling price comparison and trend analysis.

    Attributes:
        price_id (int): Primary key, unique price record identifier.
        product_id (int): Foreign key referencing the product.
        market_id (int): Foreign key referencing the market location.
        price_per_kg (Decimal): Price per kilogram with 2 decimal precision.
        date (Date): Date when this price was recorded.
        producto (relationship): Many-to-one relationship with Producto model.
        plaza (relationship): Many-to-one relationship with PlazaMercado model.

    Relationships:
        producto: The product associated with this price.
        plaza: The market where this price was recorded.
    """

    __tablename__ = "precios"

    price_id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("productos.producto_id"), nullable=False)
    market_id = Column(Integer, ForeignKey("plazas_mercado.plaza_id"), nullable=False)
    price_per_kg = Column(DECIMAL(10, 2), nullable=False)
    date = Column(Date, nullable=False)

    producto = relationship("Producto", back_populates="precios")
    plaza = relationship("PlazaMercado", back_populates="precios")


class PlazaMercado(Base):
    """
    ORM model for market locations.

    This model represents physical market locations where products are sold.
    Each market can have multiple price records for different products.

    Attributes:
        plaza_id (int): Primary key, unique market identifier.
        nombre (str): Market name.
        ciudad (str): City where the market is located.
        precios (relationship): One-to-many relationship with Price model.

    Relationships:
        precios: List of all price records for this market.
    """

    __tablename__ = "plazas_mercado"

    plaza_id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    direccion = Column(String, nullable=True)
    ciudad = Column(String, nullable=False)
    coordenadas = Column(String, nullable=True)
    estado = Column(String, default="activa") 
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
    fecha_actualizacion = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    precios = relationship("Price", back_populates="plaza")


class Producto(Base):
    """
    ORM model for products catalog.

    This model represents individual products that are tracked across
    different markets. Product names are unique to prevent duplicates.

    Attributes:
        producto_id (int): Primary key, unique product identifier.
        nombre (str): Product name (unique).
        precios (relationship): One-to-many relationship with Price model.

    Relationships:
        precios: List of all price records for this product across markets.
    """
    
    __tablename__ = "productos"

    producto_id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True, nullable=False)

    precios = relationship("Price", back_populates="producto")
