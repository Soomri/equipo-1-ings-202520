"""
JWT token management module.

This module provides functionality to create and verify JWT access tokens
for user authentication. It uses the Jose library for token encoding/decoding
and includes security features like expiration times and unique token identifiers.

Security Note:
    Keep SECRET_KEY and other sensitive configuration out of source code.
    Always use environment variables in production environments.
"""

from datetime import datetime, timedelta
from jose import JWTError, jwt
import os
from dotenv import load_dotenv
from uuid import uuid4

load_dotenv()

# Get secret and algorithm from environment (fallback values for local dev)
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
# Default token lifetime in minutes
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """
    Create a signed JWT token with an expiration time.
    Args:
        data (dict): payload data to include (e.g. {"sub": user_email, "rol": "usuario"})
        expires_delta (timedelta | None): how long the token is valid
    Returns:
        str: encoded JWT
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({
        "exp": expire,              # Expiration time of the token
        "iat": datetime.utcnow(),   # Issued at: when the token was created
        "jti": str(uuid4())         # Unique token identifier to ensure each token is distinct
    })
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> dict:
    """
    Verify and decode a JWT token.

    This function validates the token signature, checks expiration, and
    decodes the payload. It ensures the token hasn't been tampered with
    and is still valid.

    Args:
        token (str): The JWT token string to verify and decode.

    Returns:
        dict: Decoded token payload containing all claims and custom data.
            Includes standard claims (sub, exp, iat, jti) and any custom
            fields that were added during token creation.

    Raises:
        JWTError: If the token is invalid, expired, or has been tampered with.
            Possible reasons include:
            - Invalid signature
            - Expired token (past exp claim)
            - Malformed token structure
            - Algorithm mismatch

    Example:
        >>> token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        >>> try:
        ...     payload = verify_token(token)
        ...     print(payload["sub"])
        ... except JWTError:
        ...     print("Invalid or expired token")

    Note:
        The caller is responsible for handling JWTError exceptions,
        typically by returning an HTTP 401 Unauthorized response.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError as e:
        # Let caller handle the exception (e.g., raise HTTPException)
        raise e
