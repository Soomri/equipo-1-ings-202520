"""
JWT token management module for authentication and authorization.

This module provides utilities for creating and verifying JSON Web Tokens (JWT)
used for stateless authentication in the application. Tokens include expiration
times, issuance timestamps, and unique identifiers for enhanced security.

Security Configuration:
    All sensitive configuration (SECRET_KEY, ALGORITHM) must be stored in
    environment variables, never hardcoded in source code.

Environment Variables:
    SECRET_KEY: Secret key for signing JWT tokens (keep this secure!)
    ALGORITHM: JWT signing algorithm (e.g., "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: Default token lifetime in minutes

Usage:
    # Creating a token
    from jwt_manager import create_access_token
    token = create_access_token(data={"sub": "user@example.com"})

    # Verifying a token
    from jwt_manager import verify_token
    try:
        payload = verify_token(token)
        user_email = payload["sub"]
    except JWTError:
        # Handle invalid token
        pass
"""

import os
from datetime import datetime, timedelta
from typing import Optional
from uuid import uuid4

from dotenv import load_dotenv
from jose import JWTError, jwt


# ===============================
# ENVIRONMENT CONFIGURATION
# ===============================

# Load environment variables from .env file
load_dotenv()

# JWT configuration from environment variables
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
)

# Validate required configuration
if not SECRET_KEY:
    raise ValueError(
        "SECRET_KEY environment variable is not set. "
        "JWT tokens cannot be created without a secret key."
    )

if not ALGORITHM:
    raise ValueError(
        "ALGORITHM environment variable is not set. "
        "Please configure it in your .env file (e.g., 'HS256')."
    )


# ===============================
# TOKEN MANAGEMENT FUNCTIONS
# ===============================

def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create a signed JWT access token with expiration and unique identifier.

    Generates a JSON Web Token containing the provided payload data along
    with standard JWT claims (expiration, issued at, JWT ID). The token
    is signed using the configured secret key and algorithm.

    Token Claims:
        - exp: Expiration timestamp (Unix timestamp)
        - iat: Issued at timestamp (Unix timestamp)
        - jti: Unique JWT identifier (UUID4)
        - (custom): Any data provided in the `data` parameter

    Args:
        data (dict): Payload data to include in the token.
                    Typically contains user identification like:
                    {"sub": "user@example.com", "rol": "admin"}
        expires_delta (Optional[timedelta]): Custom token lifetime.
                                            If None, uses the default from
                                            ACCESS_TOKEN_EXPIRE_MINUTES.

    Returns:
        str: Encoded JWT token string ready for transmission.

    Example:
        >>> token_data = {"sub": "user@example.com", "rol": "user"}
        >>> token = create_access_token(data=token_data)
        >>> print(token)
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

        >>> # Custom expiration (5 minutes)
        >>> token = create_access_token(
        ...     data=token_data,
        ...     expires_delta=timedelta(minutes=5)
        ... )

    Security Note:
        - Never expose the SECRET_KEY in logs or error messages
        - Use HTTPS to prevent token interception
        - Store tokens securely on the client side
    """
    # Create a copy to avoid modifying the original data
    to_encode = data.copy()

    # Calculate expiration time
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )

    # Add standard JWT claims
    to_encode.update({
        "exp": expire,               # Expiration time
        "iat": datetime.utcnow(),    # Issued at timestamp
        "jti": str(uuid4())          # Unique token identifier
    })

    # Encode and sign the token
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    return encoded_jwt


def verify_token(token: str) -> dict:
    """
    Verify and decode a JWT token.

    Validates the token signature, checks expiration, and returns the
    decoded payload if valid. This function does not handle exceptions;
    callers must catch JWTError for proper error handling.

    Args:
        token (str): JWT token string to verify and decode.

    Returns:
        dict: Decoded token payload containing all claims.
              Standard claims include:
              - sub: Subject (typically user identifier)
              - exp: Expiration timestamp
              - iat: Issued at timestamp
              - jti: JWT unique identifier

    Raises:
        JWTError: If token is invalid, expired, or signature verification
                 fails. Specific exceptions include:
                 - ExpiredSignatureError: Token has expired
                 - JWTClaimsError: Invalid claims (e.g., wrong audience)
                 - JWTDecodeError: Malformed token

    Example:
        >>> from jose import JWTError
        >>> 
        >>> try:
        ...     payload = verify_token(token)
        ...     user_email = payload.get("sub")
        ...     user_role = payload.get("rol")
        ... except JWTError:
        ...     raise HTTPException(
        ...         status_code=401,
        ...         detail="Invalid or expired token"
        ...     )

    Security Note:
        Always validate the token before trusting its contents.
        Check for required claims (like "sub") after verification.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError as e:
        # Re-raise to let caller handle (e.g., return 401 Unauthorized)
        raise e