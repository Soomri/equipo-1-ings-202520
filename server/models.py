"""
SQLAlchemy ORM models for the Market Prices Plaze application.

This module defines the database schema using SQLAlchemy's declarative base.
Models are organized into two main categories:
- User-related models: Authentication and password recovery
- Market-related models: Products, markets, and price data

Database Schema:
    The schema maintains Spanish column names to match the existing database
    structure, ensuring compatibility with legacy systems and data.

Relationships:
    - User ↔ EmailLink: One-to-many (user can have multiple recovery links)
    - Price ↔ Producto: Many-to-one (multiple prices per product)
    - Price ↔ PlazaMercado: Many-to-one (multiple prices per market)

Usage:
    from models import User, Price, Producto
    from database import SessionLocal

    db = SessionLocal()
    user = db.query(User).filter(User.correo == "user@example.com").first()
"""

from datetime import datetime

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, DECIMAL, ForeignKey
from sqlalchemy.orm import relationship

from database import Base


# ===============================
# USER-RELATED MODELS
# ===============================

class User(Base):
    """
    User account model for authentication and authorization.

    Stores user credentials, roles, and account security information including
    failed login attempt tracking and temporary account locks.

    Attributes:
        usuario_id (int): Primary key, unique user identifier.
        nombre (str): User's full name.
        correo (str): User's email address (unique, indexed for fast lookups).
        contrasena_hash (str): Argon2 hashed password.
        rol (str): User role ("usuario" or "admin"). Default: "usuario".
        intentos_fallidos (int): Count of consecutive failed login attempts.
                                Default: 0.
        cuenta_bloqueada_hasta (datetime): Timestamp until which account is
                                          locked. None if not locked.

    Relationships:
        enlaces (List[EmailLink]): Password recovery and verification links
                                   associated with this user.

    Table:
        usuarios

    Indexes:
        - usuario_id (primary key)
        - correo (unique index for fast email lookups)

    Example:
        >>> user = User(
        ...     nombre="John Doe",
        ...     correo="john@example.com",
        ...     contrasena_hash=argon2.hash("password123"),
        ...     rol="usuario"
        ... )
        >>> db.add(user)
        >>> db.commit()
    """
    __tablename__ = "usuarios"

    usuario_id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    correo = Column(String, unique=True, index=True, nullable=False)
    contrasena_hash = Column(String, nullable=False)
    rol = Column(String, default="usuario")
    intentos_fallidos = Column(Integer, default=0)
    cuenta_bloqueada_hasta = Column(DateTime, nullable=True)

    # Relationships
    enlaces = relationship("EmailLink", back_populates="user")


class EmailLink(Base):
    """
    Email verification and password recovery link model.

    Stores time-limited, single-use tokens for password recovery and email
    verification workflows. Links automatically expire after a set duration.

    Attributes:
        enlace_id (int): Primary key, unique link identifier.
        usuario_id (int): Foreign key to usuarios table.
        enlace_url (str): Unique token/URL for the recovery link (max 500 chars).
        tipo (str): Link type identifier (e.g., "password_recovery",
                   "email_verification"). Max 30 characters.
        expira_en (datetime): Expiration timestamp (typically 1 hour from
                             creation).
        usado (bool): Whether the link has been used. Default: False.
        fecha_creacion (datetime): Link creation timestamp. Auto-set to UTC now.

    Relationships:
        user (User): The user account this link belongs to.

    Table:
        enlaces_correo

    Indexes:
        - enlace_id (primary key)
        - enlace_url (unique for token validation)

    Security Notes:
        - Links should expire within 1 hour for security
        - Links can only be used once (checked via 'usado' flag)
        - Tokens should be cryptographically random (e.g., UUID4)

    Example:
        >>> from datetime import timedelta
        >>> link = EmailLink(
        ...     usuario_id=user.usuario_id,
        ...     enlace_url=str(uuid4()),
        ...     tipo="password_recovery",
        ...     expira_en=datetime.utcnow() + timedelta(hours=1)
        ... )
        >>> db.add(link)
        >>> db.commit()
    """
    __tablename__ = "enlaces_correo"

    enlace_id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.usuario_id"), nullable=False)
    enlace_url = Column(String(500), unique=True, nullable=False)
    tipo = Column(String(30), nullable=False)
    expira_en = Column(DateTime, nullable=False)
    usado = Column(Boolean, default=False)
    fecha_creacion = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="enlaces")


# ===============================
# MARKET-RELATED MODELS
# ===============================

class Price(Base):
    """
    Product price record model.

    Stores historical price data for products at specific market plazas.
    Each record represents the price per kilogram of a product at a
    particular market on a specific date.

    Attributes:
        price_id (int): Primary key, unique price record identifier.
        product_id (int): Foreign key to productos table.
        market_id (int): Foreign key to plazas_mercado table.
        price_per_kg (Decimal): Price per kilogram in Colombian Pesos (COP).
                               Precision: 10 digits, 2 decimal places.
        date (date): Date when this price was recorded.

    Relationships:
        producto (Producto): The product this price belongs to.
        plaza (PlazaMercado): The market plaza where this price applies.

    Table:
        precios

    Indexes:
        - price_id (primary key)

    Data Integrity:
        - Combination of (product_id, market_id, date) should typically
          be unique to avoid duplicate price entries
        - Prices are stored as DECIMAL for precise financial calculations

    Example:
        >>> from decimal import Decimal
        >>> from datetime import date
        >>> 
        >>> price = Price(
        ...     product_id=1,
        ...     market_id=2,
        ...     price_per_kg=Decimal("2500.00"),
        ...     date=date.today()
        ... )
        >>> db.add(price)
        >>> db.commit()
    """
    __tablename__ = "precios"

    price_id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("productos.producto_id"), nullable=False)
    market_id = Column(Integer, ForeignKey("plazas_mercado.plaza_id"), nullable=False)
    price_per_kg = Column(DECIMAL(10, 2), nullable=False)
    date = Column(Date, nullable=False)

    # Relationships
    producto = relationship("Producto", back_populates="precios")
    plaza = relationship("PlazaMercado", back_populates="precios")


class PlazaMercado(Base):
    """
    Market plaza model.

    Represents physical market locations in Colombian cities where
    agricultural products are sold.

    Attributes:
        plaza_id (int): Primary key, unique market identifier.
        nombre (str): Market name (e.g., "Minorista", "La América").
        ciudad (str): City where the market is located (e.g., "Medellín").

    Relationships:
        precios (List[Price]): All price records for products sold in
                              this market plaza.

    Table:
        plazas_mercado

    Indexes:
        - plaza_id (primary key)

    Example:
        >>> plaza = PlazaMercado(
        ...     nombre="Plaza Minorista",
        ...     ciudad="Medellín"
        ... )
        >>> db.add(plaza)
        >>> db.commit()
    """
    __tablename__ = "plazas_mercado"

    plaza_id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    ciudad = Column(String, nullable=False)

    # Relationships
    precios = relationship("Price", back_populates="plaza")


class Producto(Base):
    """
    Agricultural product model.

    Represents individual products available in Medellín market plazas,
    such as vegetables, fruits, and other agricultural goods.

    Attributes:
        producto_id (int): Primary key, unique product identifier.
        nombre (str): Product name in Spanish (unique across system).

    Relationships:
        precios (List[Price]): All price records for this product across
                              different markets and dates.

    Table:
        productos

    Indexes:
        - producto_id (primary key)
        - nombre (unique for product name validation)

    Example:
        >>> producto = Producto(nombre="Tomate chonto")
        >>> db.add(producto)
        >>> db.commit()
    """
    __tablename__ = "productos"

    producto_id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True, nullable=False)

    # Relationships
    precios = relationship("Price", back_populates="producto")