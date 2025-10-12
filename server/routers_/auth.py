"""
Authentication routes module for user login, logout and token management.

This module provides secure authentication endpoints with JWT token generation,
account locking mechanism after failed attempts, and token invalidation through
an in-memory blacklist system.
"""

from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException,Header,BackgroundTasks,Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError
from passlib.hash import argon2
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from database import get_db
from jwt_manager import create_access_token, verify_token
from models import User
from utils.email_utils import send_lock_email


router = APIRouter(prefix="/auth", tags=["Auth"])

# In-memory blacklist for invalidated tokens (valid only while server runs)
TOKEN_BLACKLIST: set[str] = set()

# Security scheme for bearer token authentication
security = HTTPBearer()


# ===============================
# REQUEST MODELS
# ===============================

class UserLogin(BaseModel):
    """
    Schema for user login request.

    Attributes:
        email (EmailStr): User's email address (validated format).
        password (str): User's password in plain text.
    """
    email: EmailStr
    password: str


# ===============================
# HELPER FUNCTIONS
# ===============================

def get_bearer_token(authorization_header: Optional[str]) -> Optional[str]:
    """
    Extract the Bearer token from Authorization header.

    Parses the Authorization header to extract the JWT token, validating
    that it follows the "Bearer <token>" format.

    Args:
        authorization_header (Optional[str]): Raw Authorization header value.

    Returns:
        Optional[str]: Extracted token string, or None if header is invalid
                      or missing.

    Example:
        >>> get_bearer_token("Bearer eyJhbGciOiJIUzI1...")
        "eyJhbGciOiJIUzI1..."
        >>> get_bearer_token("InvalidFormat")
        None
    """
    if not authorization_header:
        return None
    if not authorization_header.startswith("Bearer "):
        return None
    return authorization_header.split(" ", 1)[1].strip()


def check_token_not_blacklisted(token: str):
    """
    Verify that the token has not been invalidated.

    Checks if the provided token exists in the blacklist (set of logged-out
    tokens). This prevents reuse of tokens after logout.

    Args:
        token (str): JWT token to validate.

    Raises:
        HTTPException: 401 error if token is blacklisted.

    Note:
        The blacklist is stored in memory and will be cleared on server
        restart. For production, consider using Redis or a database.
    """
    if token in TOKEN_BLACKLIST:
        raise HTTPException(
            status_code=401,
            detail="Token inválido (logout requerido)"
        )


def get_current_user_from_token(
    authorization: Optional[str] = Header(None)
) -> dict:
    """
    Validate Authorization header and return decoded token payload.

    Extracts, validates, and decodes the JWT token from the Authorization
    header. Performs multiple validation checks including format, blacklist
    status, expiration, and payload structure.

    Args:
        authorization (Optional[str]): Authorization header with Bearer token.

    Returns:
        dict: Decoded token payload containing user information.
              Expected keys: "sub" (user email), "rol" (user role).

    Raises:
        HTTPException: 401 if token is missing, invalid, expired, or
                      blacklisted.

    Example:
        >>> get_current_user_from_token("Bearer valid_token")
        {"sub": "user@example.com", "rol": "admin"}
    """
    token = get_bearer_token(authorization)
    if not token:
        raise HTTPException(
            status_code=401,
            detail="Token no proporcionado"
        )

    check_token_not_blacklisted(token)

    try:
        payload = verify_token(token)
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Token inválido o expirado"
        )

    if "sub" not in payload:
        raise HTTPException(
            status_code=401,
            detail="Token inválido: falta información"
        )
    
    return payload


# ===============================
# AUTHENTICATION ENDPOINTS
# ===============================

@router.post("/login")
def login(
    user: UserLogin,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Authenticate user and issue a JWT access token.

    Validates user credentials and implements a security mechanism that
    temporarily locks accounts after 3 consecutive failed login attempts.
    The lock lasts 15 minutes and triggers an email notification.

    Security Features:
        - Password verification using Argon2 hashing
        - Account lock after 3 failed attempts (15 minutes)
        - Automatic unlock after lock period expires
        - Failed attempt counter reset on successful login
        - Email notification on account lock

    Args:
        user (UserLogin): Login credentials (email and password).
        background_tasks (BackgroundTasks): FastAPI background task manager
                                           for sending emails asynchronously.
        db (Session): Database session injected by dependency.

    Returns:
        dict: Authentication response with the following fields:
            - mensaje (str): Success message.
            - usuario (str): User's email address.
            - rol (str): User's role (e.g., "admin", "user").
            - access_token (str): JWT token for authenticated requests.
            - tipo_token (str): Token type ("bearer").

    Raises:
        HTTPException: 400 if credentials are incorrect.
        HTTPException: 403 if account is temporarily locked.

    Example:
        >>> login(UserLogin(email="user@example.com", password="pass123"), 
        ...       background_tasks, db)
        {
            "mensaje": "Inicio de sesión exitoso",
            "usuario": "user@example.com",
            "rol": "user",
            "access_token": "eyJhbGciOiJIUzI1NiIs...",
            "tipo_token": "bearer"
        }
    """
    # Search user by email
    usuario = db.query(User).filter(User.correo == user.email).first()
    if not usuario:
        raise HTTPException(
            status_code=400,
            detail="Correo o contraseña incorrectos"
        )

    # Check if account is temporarily locked
    if usuario.cuenta_bloqueada_hasta:
        if usuario.cuenta_bloqueada_hasta > datetime.utcnow():
            raise HTTPException(
                status_code=403,
                detail=(
                    "Cuenta bloqueada temporalmente. "
                    "Revisa tu correo electrónico."
                )
            )
        else:
            # Unlock automatically if the lock period has expired
            usuario.cuenta_bloqueada_hasta = None
            usuario.intentos_fallidos = 0
            db.commit()

    # Verify password with Argon2
    if not argon2.verify(user.password, usuario.contrasena_hash):
        usuario.intentos_fallidos = (usuario.intentos_fallidos or 0) + 1

        # Lock account after 3 failed attempts
        if usuario.intentos_fallidos >= 3:
            lock_until = datetime.utcnow() + timedelta(minutes=15)
            usuario.cuenta_bloqueada_hasta = lock_until
            db.commit()

            # Send account lock notification email in background
            background_tasks.add_task(
                send_lock_email,
                usuario.correo,
                usuario.nombre
            )

            raise HTTPException(
                status_code=403,
                detail=(
                    "Cuenta bloqueada por múltiples intentos fallidos. "
                    "Revisa tu correo electrónico."
                )
            )

        db.commit()
        raise HTTPException(
            status_code=400,
            detail="Correo o contraseña incorrectos"
        )

    # Reset security counters after successful login
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
        "rol": role,
        "access_token": token,
        "tipo_token": "bearer"
    }


@router.post("/logout")
def logout(
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    """
    Invalidate user's JWT token and terminate session.

    Adds the provided JWT token to an in-memory blacklist, preventing its
    reuse for future authenticated requests. The token must be sent in the
    Authorization header using the "Bearer <token>" format.

    Args:
        credentials (HTTPAuthorizationCredentials): Bearer token extracted
                                                   automatically by FastAPI
                                                   security dependency.

    Returns:
        dict: Logout confirmation with the following field:
            - message (str): Success message.

    Raises:
        HTTPException: 400 if token is already invalidated.
        HTTPException: 401 if token format is invalid (handled by security).

    Note:
        The blacklist is stored in-memory and will be cleared on server
        restart. For production environments with multiple server instances,
        consider using Redis or a database-backed blacklist.

    Example:
        Request Header:
            Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
        
        Response:
            {"message": "Sesión cerrada correctamente"}
    """
    # Extract token automatically via security dependency
    token = credentials.credentials

    if token in TOKEN_BLACKLIST:
        raise HTTPException(
            status_code=400,
            detail="El token ya fue invalidado"
        )

    # Add token to blacklist to prevent reuse
    TOKEN_BLACKLIST.add(token)

    return {"message": "Sesión cerrada correctamente"}