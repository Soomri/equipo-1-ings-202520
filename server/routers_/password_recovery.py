"""
Password recovery module for secure user password reset functionality.

This module provides endpoints for initiating password recovery via email
and resetting passwords using time-limited, single-use tokens. Includes
email delivery through Gmail SMTP and password strength validation.
"""

import os
import re
import smtplib
from datetime import datetime
from email.mime.text import MIMEText

from fastapi import APIRouter, Depends, HTTPException
from passlib.hash import argon2
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from database import get_db
from models import User, EmailLink
from utils.password_utils import create_password_recovery_link


router = APIRouter(prefix="/password")


# ===============================
# REQUEST MODELS
# ===============================

class ResetPassword(BaseModel):
    """
    Schema for password reset request.

    Attributes:
        new_password (str): New password to set for the user account.
    """
    new_password: str


# ===============================
# HELPER FUNCTIONS
# ===============================

def validate_password(password: str) -> bool:
    """
    Validate password strength according to security requirements.

    Checks that the password meets minimum security standards:
    - At least 8 characters long
    - Contains at least one uppercase letter (A-Z)
    - Contains at least one digit (0-9)
    - Contains at least one special character (!@#$%^&*)

    Args:
        password (str): Password string to validate.

    Returns:
        bool: True if password meets all requirements, False otherwise.

    Example:
        >>> validate_password("Weak123")
        False
        >>> validate_password("Strong123!")
        True
    """
    regex = r'^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$'
    return re.match(regex, password) is not None


def send_recovery_email(user: User, reset_link: str) -> None:
    """
    Send password recovery email with reset link.

    Constructs and sends an HTML-formatted email containing a password
    reset link. Uses Gmail SMTP server for delivery.

    Args:
        user (User): User object containing email and name.
        reset_link (str): Complete URL for password reset.

    Raises:
        HTTPException: 500 if email sending fails.

    Note:
        Requires EMAIL_USER and EMAIL_PASS environment variables to be set
        for Gmail SMTP authentication.
    """
    # Create HTML email message (table-based for consistent layout)
    html_content = f"""
<html>
  <body style="margin: 0; padding: 0; background-color: #f4f6f8;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" 
           width="100%">
      <tr>
        <td align="center" style="padding: 40px 0;">
          <table role="presentation" cellspacing="0" cellpadding="0" 
                 border="0" width="480" 
                 style="background-color: #ffffff; border-radius: 12px; 
                        box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
            <tr>
              <td style="padding: 30px 40px; font-family: Arial, sans-serif; 
                         color: #333;">
                
                <h2 style="color: #1a73e8; text-align: center; margin-top: 0;">
                  🔐 Recuperación de contraseña
                </h2>
                
                <p>Hola <b>{user.nombre}</b>,</p>

                <p style="line-height: 1.6;">
                  Hemos recibido una solicitud para restablecer tu 
                  contraseña.<br>
                  Por favor, haz clic en el botón de abajo para continuar:
                </p>

                <table role="presentation" cellspacing="0" cellpadding="0" 
                       border="0" align="center" style="margin: 30px auto;">
                  <tr>
                    <td align="center" bgcolor="#1a73e8" 
                        style="border-radius: 8px;">
                      <a href="{reset_link}" target="_blank" 
                        style="display: inline-block; padding: 12px 24px; 
                               font-size: 16px; font-weight: bold; 
                               color: #ffffff; text-decoration: none; 
                               border-radius: 8px;">
                        Restablecer contraseña
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="color: #555; font-size: 14px;">
                  ⏰ Este enlace expirará en <b>1 hora</b>.<br>
                  Si no solicitaste este cambio, puedes ignorar este mensaje.
                </p>

                <hr style="border: none; border-top: 1px solid #eee; 
                           margin: 25px 0;">

                <p style="color: #777; font-size: 13px; text-align: center;">
                  Saludos,<br>
                  <b>El equipo de Soporte de Plaze</b>
                </p>

              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
"""

    msg = MIMEText(html_content, "html")
    msg["Subject"] = "🔐 Recuperación de contraseña"
    msg["From"] = f"Plaze Soporte <{os.getenv('EMAIL_USER')}>"
    msg["To"] = user.correo

    # Send email via Gmail SMTP
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(
                os.getenv("EMAIL_USER"),
                os.getenv("EMAIL_PASS")
            )
            server.sendmail(
                os.getenv("EMAIL_USER"),
                user.correo,
                msg.as_string()
            )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error en el envío del email: {e}"
        )


# ===============================
# PASSWORD RECOVERY ENDPOINTS
# ===============================

@router.post("/recover/{correo}")
def recover_password(email: EmailStr, db: Session = Depends(get_db)):
    """
    Initiate password recovery process for a user account.

    Generates a unique, time-limited password recovery token and sends
    an email with reset instructions to the user. The token expires after
    1 hour and can only be used once.

    Args:
        email (EmailStr): Email address of the user requesting recovery.
        db (Session): Database session injected by dependency.

    Returns:
        dict: Success confirmation with the following field:
            - message (str): Confirmation that email was sent.

    Raises:
        HTTPException: 404 if user with given email doesn't exist.
        HTTPException: 500 if email sending fails.

    Example:
        >>> recover_password("user@example.com", db)
        {
            "message": "Correo de recuperación de contraseña enviado 
                       exitosamente"
        }

    Note:
        - Requires EMAIL_USER and EMAIL_PASS environment variables
        - Token is stored in database with expiration timestamp
        - Email contains HTML-formatted recovery instructions
    """
    # Find user by email
    user = db.query(User).filter(User.correo == email).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    # Generate token and reset link using utility function
    token, reset_link = create_password_recovery_link(user, db)

    # Send recovery email
    send_recovery_email(user, reset_link)

    return {
        "message": "Correo de recuperación de contraseña enviado exitosamente"
    }


@router.post("/reset/{token}")
def reset_password(
    token: str,
    body: ResetPassword,
    db: Session = Depends(get_db)
):
    """
    Reset user password using a valid recovery token.

    Validates the recovery token and updates the user's password if all
    checks pass. The token must be valid, not expired, not previously used,
    and the new password must meet strength requirements.

    Password Requirements:
        - Minimum 8 characters
        - At least one uppercase letter (A-Z)
        - At least one digit (0-9)
        - At least one special character (!@#$%^&*)

    Args:
        token (str): Password recovery token from email link.
        body (ResetPassword): Request body containing new password.
        db (Session): Database session injected by dependency.

    Returns:
        dict: Success confirmation with the following field:
            - message (str): Confirmation that password was reset.

    Raises:
        HTTPException: 404 if token is invalid or user not found.
        HTTPException: 400 if token expired, already used, or password 
                      doesn't meet requirements.

    Example:
        >>> reset_password(
        ...     "abc123token",
        ...     ResetPassword(new_password="NewPass123!"),
        ...     db
        ... )
        {"message": "Contraseña restablecida exitosamente"}

    Security:
        - Token is marked as used after successful reset
        - Password is hashed using Argon2 before storage
        - Original token cannot be reused
    """
    # Find recovery link by token
    link = db.query(EmailLink).filter(
        EmailLink.enlace_url == token
    ).first()

    if not link:
        raise HTTPException(status_code=404, detail="Link inválido")
    
    if link.usado:
        raise HTTPException(status_code=400, detail="Link ya fue usado")
    
    if link.expira_en < datetime.utcnow():
        raise HTTPException(status_code=400, detail="El link ha expirado")

    # Find associated user
    user = db.query(User).filter(
        User.usuario_id == link.usuario_id
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    # Validate new password strength
    if not validate_password(body.new_password):
        raise HTTPException(
            status_code=400,
            detail=(
                "La contraseña debe tener al menos 8 caracteres, "
                "una mayúscula, un número y un carácter especial (!@#$%^&*)"
            )
        )

    # Update password and mark link as used
    user.contrasena_hash = argon2.hash(body.new_password)
    link.usado = True
    db.commit()
    db.refresh(user)

    return {"message": "Contraseña restablecida exitosamente"}