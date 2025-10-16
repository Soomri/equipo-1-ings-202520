"""
User registration routes module.

This module handles user registration functionality, including email validation,
password complexity checks, and secure password hashing using Argon2.
"""

from fastapi import APIRouter, HTTPException, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr, constr
from supabase import create_client, Client
from passlib.hash import argon2
from dotenv import load_dotenv
import os
import re

# Router instance
router = APIRouter(prefix="/registro", tags=["User Registration"])

# Load environment variables from /server/.env
env_path = os.path.join(os.path.dirname(__file__), "../.env")
load_dotenv(dotenv_path=env_path)

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

# Input model for user registration
class UserRegister(BaseModel):
    """
    User registration data model.

    Attributes:
        name (str): The user's full name.
        email (EmailStr): Valid email address for the user account.
        password (constr): User password with minimum 8 characters requirement.
    """
    name: str
    email: EmailStr
    password: constr(min_length=8)

# Validate password complexity
def validate_password(password: str) -> tuple[bool, str]:
    """
    Validate password complexity requirements.

    Checks if the password meets security requirements including minimum
    length, uppercase letters, numbers, and special characters.

    Args:
        password (str): The password string to validate.

    Returns:
        tuple[bool, str]: A tuple containing:
            - bool: True if password is valid, False otherwise.
            - str: Empty string if valid, error message if invalid.

    Example:
        >>> is_valid, message = validate_password("Test123!")
        >>> print(is_valid)
        True
        >>> is_valid, message = validate_password("weak")
        >>> print(message)
        'La contraseña debe tener al menos 8 caracteres.'
    """
    if len(password) < 8:
        return False, "La contraseña debe tener al menos 8 caracteres."
    if not re.search(r"[A-Z]", password):
        return False, "La contraseña debe contener al menos una letra mayúscula."
    if not re.search(r"[0-9]", password):
        return False, "La contraseña debe contener al menos un número."
    if not re.search(r"[!@#$%^&*]", password):
        return False, "La contraseña debe contener al menos un carácter especial (!@#$%^&*)."
    return True, ""

# Register user endpoint
@router.post("/")
def register_user(user: UserRegister):
    """
    Register a new user in the system.

    This endpoint handles the complete user registration process including:
    - Email uniqueness validation
    - Password complexity verification
    - Secure password hashing with Argon2
    - User data persistence in the database

    Args:
        user (UserRegister): User registration data containing name, email,
            and password.

    Returns:
        dict: A dictionary containing:
            - message (str): Success message.
            - user (dict): Created user data without password hash.

    Raises:
        HTTPException: 400 BAD REQUEST if:
            - Email is already registered.
            - Password doesn't meet complexity requirements.
        HTTPException: 503 SERVICE UNAVAILABLE if database connection fails.
        HTTPException: 500 INTERNAL SERVER ERROR if user creation fails or
            unexpected errors occur.

    Example:
        >>> user_data = UserRegister(
        ...     name="John Doe",
        ...     email="john@example.com",
        ...     password="SecurePass123!"
        ... )
        >>> response = register_user(user_data)
        >>> print(response["message"])
        'Usuario creado correctamente.'
    """
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

        try:
            response = supabase.table("usuarios").insert({
                "nombre": user.name,
                "correo": user.email,
                "contrasena_hash": hashed_password,
            }).execute()
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Error al conectarse con la base de datos. Inténtalo nuevamente más tarde."
            )

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="El usuario no se pudo crear debido a un error interno."
            )

        created_user = response.data[0]
        created_user.pop("contrasena_hash", None)

        return {"message": "Usuario creado correctamente.", "user": created_user}

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error inesperado en el servidor: {str(e)}"
        )