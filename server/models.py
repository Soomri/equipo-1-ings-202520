"""
SQLAlchemy ORM models module.

This module defines all database models for the Market Prices Plaze API,
including user management, email verification, and market price tracking.
Models are organized into two main categories: user-related and market-related.

Note:
    Column names in Spanish are maintained to match the existing database schema.
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, DECIMAL, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import DOUBLE_PRECISION
from sqlalchemy.sql import func
from database import Base
from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional

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
    rol = Column(String, default="usuario")  # "usuario" or "admin"
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

class Precio(Base):
    """
    ORM model for product prices at different markets (tabla: precios).
    """

    __tablename__ = "precios"

    precio_id = Column(Integer, primary_key=True, index=True)
    producto_id = Column(Integer, ForeignKey("productos.producto_id"), nullable=False)
    plaza_id = Column(Integer, ForeignKey("plazas_mercado.plaza_id", ondelete="CASCADE"), nullable=False)
    precio_por_kg = Column(DECIMAL(10, 2), nullable=False)
    tendencia = Column(String, nullable=True)
    fecha = Column(Date, nullable=False)
    fuente_dato = Column(String, nullable=True)
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())
    fecha_actualizacion = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    producto = relationship("Producto", back_populates="precios")
    plaza = relationship("PlazaMercado", back_populates="precios")


# =============================
# ORM Model (SQLAlchemy)
# =============================

class PlazaMercado(Base):
    __tablename__ = "plazas_mercado"

    plaza_id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    direccion = Column(String, nullable=False)
    ciudad = Column(String, nullable=False)
    coordenadas = Column(String, nullable=False)
    estado = Column(String, default="activa")
    horarios = Column(String, nullable=False)
    numero_comerciantes = Column(Integer)
    tipos_productos = Column(Text)
    datos_contacto = Column(String)
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())
    fecha_actualizacion = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    # Inverse relationship to Price model
    precios = relationship("Precio", back_populates="plaza", cascade="all, delete-orphan")

# =============================
# Pydantic Model (for request)
# =============================

class PlazaCreate(BaseModel):
    nombre: str
    direccion: str
    ciudad: str
    coordenadas: str
    horarios: str
    numero_comerciantes: Optional[int] = None
    tipos_productos: Optional[str] = None
    datos_contacto: Optional[str] = None


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

    precios = relationship("Precio", back_populates="producto")