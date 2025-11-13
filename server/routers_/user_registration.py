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
from functools import lru_cache
from unittest.mock import MagicMock
import os
import re

# =====================================
# Load environment variables
# =====================================
load_dotenv()

# Router instance
router = APIRouter(prefix="/registro", tags=["User Registration"])

# =====================================
# Safe Supabase client creation
# =====================================
@lru_cache
def get_supabase_client() -> Client:
    """Creates and caches a Supabase client if environment variables exist."""
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    if not url or not key:
        raise ValueError("Missing Supabase credentials")
    return create_client(url, key)


supabase: Client | None = None


def get_client_safe() -> Client:
    """
    Returns a real Supabase client if environment variables exist,
    otherwise returns a mock (for CI/CD or testing environments).
    """
    global supabase
    if supabase is None:
        try:
            supabase = get_supabase_client()
        except ValueError:
            # Avoids real connection to Supabase during tests
            return MagicMock()
    return supabase


# =====================================
# User registration model
# =====================================
class UserRegister(BaseModel):
    """User registration data model."""
    name: str
    email: EmailStr
    password: constr(min_length=8)


# =====================================
# Password validation
# =====================================
def validate_password(password: str) -> tuple[bool, str]:
    """Checks password strength requirements."""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long."
    if not re.search(r"[A-Z]", password):
        return False, "Password must include at least one uppercase letter."
    if not re.search(r"[a-z]", password):
        return False, "Password must include at least one lowercase letter."
    if not re.search(r"\d", password):
        return False, "Password must include at least one number."
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False, "Password must include at least one special character."
    return True, "Valid password."


# =====================================
# User registration endpoint
# =====================================
@router.post("/", status_code=status.HTTP_201_CREATED)
async def register_user(user: UserRegister):
    """Registers a new user after validating email and password."""
    is_valid, message = validate_password(user.password)
    if not is_valid:
        raise HTTPException(status_code=400, detail=message)

    client = get_client_safe()

    # Check if user already exists
    existing_user = client.table("usuarios").select("*").eq("email", user.email).execute()
    if existing_user.data:
        raise HTTPException(status_code=400, detail="Email already registered.")

    hashed_password = argon2.hash(user.password)
    client.table("usuarios").insert({
        "nombre": user.name,
        "email": user.email,
        "password": hashed_password
    }).execute()

    return {"message": "User successfully registered."}

