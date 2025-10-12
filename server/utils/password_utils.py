"""
Password recovery utilities for generating secure reset tokens.

This module provides functions for creating time-limited, single-use password
recovery tokens. Tokens are stored in the database with expiration timestamps
and can only be used once for security purposes.

Security Features:
    - Cryptographically random tokens (UUID4)
    - Time-limited validity (default: 1 hour)
    - Single-use enforcement via database flag
    - Unique token per request

Usage:
    from utils.password_utils import create_password_recovery_link
    from models import User
    from database import SessionLocal

    db = SessionLocal()
    user = db.query(User).filter(User.correo == "user@example.com").first()
    token, reset_link = create_password_recovery_link(user, db)
    
    # Send reset_link via email to user
"""

import os
import uuid
from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from models import User, EmailLink


# ===============================
# PASSWORD RECOVERY FUNCTIONS
# ===============================


def create_password_recovery_link(user: User, db: Session, link_type: str = "recuperacion_password", expiration_hours: int = 1):
    """
    Generate a secure password recovery token and store it in the database.

    Creates a unique, time-limited token for password recovery and persists
    it to the database. The token is cryptographically random (UUID4) and
    includes an expiration timestamp for security. Returns both the raw token
    and a complete reset URL.

    Token Lifecycle:
        1. Generated as random UUID4
        2. Stored in database with expiration time
        3. Sent to user via email as part of reset URL
        4. Validated and marked as used when user resets password
        5. Cannot be reused after successful password reset

    Args:
        user (User): SQLAlchemy User instance for whom to create the recovery
                    link. Must have a valid usuario_id.
        db (Session): Active SQLAlchemy database session for persisting the
                     token record.
        link_type (str): Type identifier for the link (stored in Spanish to
                        match database schema). Default: "recuperacion_password".
                        Other possible values: "verificacion_email".
        expiration_hours (int): Number of hours until the token expires.
                               Default: 1 hour. After expiration, the token
                               cannot be used for password reset.

    Returns:
        tuple[str, str]: A tuple containing:
            - token (str): Raw UUID4 token string (for database queries)
            - reset_link (str): Complete password reset URL (for email)

    Example:
        >>> user = db.query(User).filter(User.correo == "user@example.com").first()
        >>> token, reset_link = create_password_recovery_link(user, db)
        >>> print(token)
        "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
        >>> print(reset_link)
        "http://localhost:8000/password/reset/a1b2c3d4-e5f6-7890-abcd-ef1234567890"

        >>> # Custom expiration (24 hours)
        >>> token, link = create_password_recovery_link(
        ...     user, 
        ...     db, 
        ...     expiration_hours=24
        ... )

        >>> # Email verification link
        >>> token, link = create_password_recovery_link(
        ...     user,
        ...     db,
        ...     link_type="verificacion_email",
        ...     expiration_hours=48
        ... )

    Database Operations:
        - Creates new EmailLink record
        - Commits transaction immediately
        - Refreshes object to get database-generated fields

    Security Considerations:
        - Tokens are cryptographically random (UUID4 = 122 bits of entropy)
        - Default 1-hour expiration balances security and usability
        - Tokens can only be used once (checked via 'usado' flag)
        - No user information is encoded in the token
        - Token validation requires database lookup

    Production Notes:
        - BASE_URL should be set via environment variable in production
        - Consider implementing rate limiting for token generation
        - Log token generation events for security auditing
        - Implement cleanup job for expired tokens

    Raises:
        SQLAlchemyError: If database operations fail (commit/refresh).
    """
    # Generate cryptographically random token
    token = str(uuid.uuid4())

    # Calculate expiration timestamp
    expires_at = datetime.utcnow() + timedelta(hours=expiration_hours)

    # Create database record for the recovery link
    email_link = EmailLink(
        usuario_id=user.usuario_id,
        enlace_url=token,
        tipo=link_type,
        expira_en=expires_at,
        usado=False
    )

    # Persist to database
    db.add(email_link)
    db.commit()
    db.refresh(email_link)

    # Construct complete reset URL
    reset_link = f"http://localhost:8000/password/reset/{token}"

    return token, reset_link

