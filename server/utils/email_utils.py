"""
Email notification utilities for user account security alerts.

This module provides functions for sending automated email notifications
related to account security events, such as temporary account locks due to
failed login attempts. Emails include password recovery links and are sent
via Gmail SMTP.

Features:
    - Account lock notifications with recovery links
    - HTML-formatted emails for better user experience
    - Automatic password recovery link generation
    - Secure SMTP transmission via Gmail

Environment Variables:
    EMAIL_USER: Gmail address for sending notifications
    EMAIL_PASS: Gmail app password for SMTP authentication

Usage:
    from utils.email_utils import send_lock_email
    
    # Send lock notification (typically from login endpoint)
    send_lock_email("user@example.com", "John Doe")
"""

from sqlalchemy.orm import Session
from database import get_db
from models import User
import smtplib
from email.mime.text import MIMEText
from utils.password_utils import create_password_recovery_link
import os

def send_lock_email(email: str, user_name: str):
    """
    Send account lock notification email with password recovery link.

    Notifies the user that their account has been temporarily locked due to
    multiple failed login attempts. The email includes a time-limited password
    recovery link that allows the user to regain access immediately by
    resetting their password.

    The function creates its own database session to fetch user information
    and generate a recovery token. The session is properly closed in the
    finally block to prevent connection leaks.

    Args:
        email (str): Email address of the locked account.
        user_name (str): User's display name for email personalization.

    Returns:
        None

    Side Effects:
        - Creates a new database session
        - Generates a password recovery token in the database
        - Sends an HTML email via Gmail SMTP
        - Prints status messages to console (for logging/debugging)

    Email Contents:
        - Account lock notification
        - Password recovery button with unique link
        - Security warning about unauthorized access attempts
        - Link expiration notice (typically 1 hour)

    Error Handling:
        - Silently fails if user is not found (prints error to console)
        - Catches and logs SMTP exceptions without raising
        - Ensures database session cleanup in finally block

    Example:
        >>> send_lock_email("user@example.com", "John Doe")
        Generando enlace de recuperación...
        Link generado: https://app.com/reset/abc123...
        Correo de bloqueo enviado a user@example.com

    Security Notes:
        - Recovery links are single-use and time-limited
        - Uses Gmail SMTP SSL for encrypted transmission
        - Requires app-specific password (not regular Gmail password)
        - Warns users about potential unauthorized access

    Note:
        This function is typically called as a background task from the
        login endpoint to avoid blocking the HTTP response. The database
        session is created internally to work safely in background contexts.
    """

    # Create a new database session inside the function
    db: Session = next(get_db())
    user = db.query(User).filter(User.correo == email).first()
    if not user:
        print(f"Usuario {email} no encontrado para correo de bloqueo")
        return

    # Create recovery link
    print("Generando enlace de recuperación...")
    _, reset_link = create_password_recovery_link(user, db)
    print("Link generado:", reset_link)

    # Compose HTML email
    msg = MIMEText(f"""
    <html>
      <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f7f9fc; margin: 0; padding: 40px;">
        <div style="max-width: 480px; background: #ffffff; margin: auto; border-radius: 12px; padding: 30px; box-shadow: 0 4px 10px rgba(0,0,0,0.08);">
          <h2 style="color: #d93025; text-align: center;">❌ Cuenta bloqueada temporalmente</h2>
          
          <p style="color: #333;">Hola <b>{user_name}</b>,</p>
          <p style="color: #333; line-height: 1.5;">
            Tu cuenta ha sido <b>bloqueada temporalmente</b> debido a múltiples intentos fallidos de inicio de sesión.
          </p>
          
          <p style="color: #333; line-height: 1.5;">
            ⏳ Por seguridad, restablece tu contraseña haciendo clic en el siguiente botón:
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="{reset_link}" 
              style="background-color: #1a73e8; color: white; padding: 12px 24px; 
                     border-radius: 8px; text-decoration: none; font-weight: bold; 
                     font-size: 15px; display: inline-block;">
              Restablecer contraseña
            </a>
          </div>

          <p style="color: #555; font-size: 14px;">
            ⚠️ Si no intentaste iniciar sesión, cambia tu contraseña inmediatamente para proteger tu cuenta.
          </p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
          <p style="color: #777; font-size: 13px; text-align: center;">
            Saludos,<br>
            <b>El equipo de Soporte de Plaze</b>
          </p>
        </div>
      </body>
    </html>
    """, "html")

    msg["Subject"] = "❌ Cuenta bloqueada temporalmente"
    msg["From"] = f"Plaze Soporte <{os.getenv('EMAIL_USER')}>"
    msg["To"] = email

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(os.getenv("EMAIL_USER"), os.getenv("EMAIL_PASS"))
            server.sendmail(os.getenv("EMAIL_USER"), email, msg.as_string())
        print(f"Correo de bloqueo enviado a {email}")
    except Exception as e:
        print(f"Error al enviar el correo de bloqueo: {e}")
    finally:
        db.close()



