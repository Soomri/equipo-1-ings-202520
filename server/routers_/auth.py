"""
Authentication routes module for user login, logout and token management.

This module provides secure authentication endpoints with JWT token generation,
account locking mechanism after failed attempts, and token invalidation through
an in-memory blacklist system.
"""

from fastapi import APIRouter, Depends, HTTPException,Header,BackgroundTasks,Security
from sqlalchemy.orm import Session
from database import SessionLocal, get_db
from models import User
from pydantic import BaseModel, EmailStr
from passlib.hash import argon2
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError
from jwt_manager import create_access_token, verify_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from utils.email_utils import send_lock_email


router = APIRouter(prefix="/auth", tags=["Auth"])

# In-memory blacklist for invalidated tokens (valid only while server runs)
TOKEN_BLACKLIST: set[str] = set()

# ===============================
# REQUEST MODELS
# ===============================
# Defines the expected structure for login requests.
class UserLogin(BaseModel):
    """
    Input data for login.
    """
    email: EmailStr
    password: str


# ===============================
# HELPER FUNCTIONS
# ===============================
# Helper functions for token extraction, validation, and blacklist checking.
def get_bearer_token(authorization_header: Optional[str]) -> Optional[str]:
    """
    Extract the Bearer token from Authorization header.
    """
    if not authorization_header:
        return None
    if not authorization_header.startswith("Bearer "):
        return None
    return authorization_header.split(" ", 1)[1].strip()


def check_token_not_blacklisted(token: str):
    """
    Verify that the token is not blacklisted.
    """
    if token in TOKEN_BLACKLIST:
        raise HTTPException(status_code=401, detail="Token inválido (logout requerido)")


def get_current_user_from_token(authorization: Optional[str] = Header(None)) -> dict:
    """
    Validate the Authorization header and return the decoded token payload.
    Raises HTTPException if invalid or expired.
    """
    token = get_bearer_token(authorization)
    if not token:
        raise HTTPException(status_code=401, detail="Token no proporcionado")

    check_token_not_blacklisted(token)

    try:
        payload = verify_token(token)
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

    if "sub" not in payload:
        raise HTTPException(status_code=401, detail="Token inválido: falta información")
    return payload


# ===============================
# LOGIN ENDPOINT
# ===============================
# Authenticates a user and returns a valid JWT token.
# Locks the account for 15 minutes after 3 failed attempts.
# Resets failed attempts after successful login.
# Sends an email notification when the account is locked
@router.post("/login")
def login(
    user: UserLogin,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Authenticate user and return a valid JWT token.
    - Temporary lock after 3 failed login attempts (15 minutes).
    - Reset failed attempts after successful login.
    - Send email notification on account lock.
    """

    # Search user by email
    usuario = db.query(User).filter(User.correo == user.email).first()
    if not usuario:
        raise HTTPException(status_code=400, detail="Correo o contraseña incorrectos")

    # Check if account is temporarily locked
    if usuario.cuenta_bloqueada_hasta:
        if usuario.cuenta_bloqueada_hasta > datetime.utcnow():
            raise HTTPException(
                status_code=403,
                detail="Cuenta bloqueada temporalmente. Revisa tu correo electrónico."
            )
        else:
            # Unlock automatically if the lock period has expired
            usuario.cuenta_bloqueada_hasta = None
            usuario.intentos_fallidos = 0
            db.commit()

    # Verify password
    if not argon2.verify(user.password, usuario.contrasena_hash):
        usuario.intentos_fallidos = (usuario.intentos_fallidos or 0) + 1

        # Lock account after 3 failed attempts
        if usuario.intentos_fallidos >= 3:
            usuario.cuenta_bloqueada_hasta = datetime.utcnow() + timedelta(minutes=15)
            db.commit()

            # 🔔 Send account lock notification email in background
            send_lock_email(usuario.correo, usuario.nombre)

            raise HTTPException(
                status_code=403,
                detail="Cuenta bloqueada por múltiples intentos fallidos. Revisa tu correo electrónico."
            )

        db.commit()
        raise HTTPException(status_code=400, detail="Correo o contraseña incorrectos")

    # Reset counters after successful login
    usuario.intentos_fallidos = 0
    usuario.cuenta_bloqueada_hasta = None
    db.commit()

    # Create JWT token with user data
    role = usuario.rol if hasattr(usuario, "rol") else "user"
    token_data = {"sub": usuario.correo, "rol": role}
    token = create_access_token(data=token_data)

    return {
        "mensaje": "Inicio de sesión exitoso",
        "usuario": usuario.correo,
        "nombre": usuario.nombre,  # Include user's name in response
        "rol": role,
        "access_token": token,
        "tipo_token": "bearer"
    }



# ===============================
# LOGOUT ENDPOINT
# ===============================
# Invalidates the user's JWT by adding it to a temporary in-memory blacklist.
security = HTTPBearer()

@router.post("/logout")
def logout(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Invalidate the JWT received in the Authorization header.
    Must be sent in the format: Bearer <token>.
    """
    token = credentials.credentials  # Extract token automatically

    if token in TOKEN_BLACKLIST:
        raise HTTPException(status_code=400, detail="El token ya fue invalidado")

    TOKEN_BLACKLIST.add(token)

    return {"message": "Sesión cerrada correctamente"}
