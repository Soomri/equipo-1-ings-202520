"""
User registration routes module.

This module handles user registration functionality, including email validation,
password complexity checks, and secure password hashing using Argon2.
"""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, constr
from supabase import create_client, Client
from passlib.hash import argon2
import os
import re
from functools import lru_cache

# Router instance
router = APIRouter(prefix="/registro", tags=["User Registration"])

# ✅ Safe Supabase client initialization
@lru_cache
def get_supabase_client() -> Client:
    """
    Lazily initialize the Supabase client, raising clear error if credentials are missing.
    """
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    if not url or not key:
        raise ValueError("Missing Supabase credentials in environment variables.")
    return create_client(url, key)


# Input model for user registration
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: constr(min_length=8)


# Validate password complexity
def validate_password(password: str) -> tuple[bool, str]:
    if len(password) < 8:
        return False, "La contraseña debe tener al menos 8 caracteres."
    if not re.search(r"[A-Z]", password):
        return False, "La contraseña debe contener al menos una letra mayúscula."
    if not re.search(r"[0-9]", password):
        return False, "La contraseña debe contener al menos un número."
    if not re.search(r"[!@#$%^&*]", password):
        return False, "La contraseña debe contener al menos un carácter especial (!@#$%^&*)."
    return True, ""


@router.post("/")
def register_user(user: UserRegister):
    """
    Register a new user in the system.
    """
    supabase = get_supabase_client()

    try:
        existing = supabase.table("usuarios").select("*").eq("correo", user.email).execute()
        if existing.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Este correo ya ha sido registrado."
            )

        is_valid, message = validate_password(user.password)
        if not is_valid:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=message)

        hashed_password = argon2.hash(user.password)

        response = supabase.table("usuarios").insert({
            "nombre": user.name,
            "correo": user.email,
            "contrasena_hash": hashed_password,
        }).execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="El usuario no se pudo crear debido a un error interno."
            )

        created_user = response.data[0]
        created_user.pop("contrasena_hash", None)

        return {"message": "Usuario creado correctamente.", "user": created_user}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error inesperado en el servidor: {str(e)}"
        )
