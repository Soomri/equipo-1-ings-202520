from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from argon2 import PasswordHasher
from models import User
from jose import jwt, JWTError
import os

ph = PasswordHasher()
security = HTTPBearer()  # Defines the HTTP Bearer security scheme

SECRET_KEY = os.getenv("SECRET_KEY", "clave_por_defecto")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

def verify_admin(email: str, password: str, db: Session):
    """
    Validates if the user exists, password is correct and has admin role.
    """
    user = db.query(User).filter(User.correo == email).first()

    if not user:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")

    try:
        ph.verify(user.contrasena_hash, password)
    except Exception:
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")

    if user.rol != "admin":
        raise HTTPException(status_code=403, detail="Permiso denegado: no es administrador")

    return True


def get_current_admin_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Validates the Bearer token and ensures the user is an admin.
    """
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email = payload.get("sub")

        if not user_email:
            raise HTTPException(status_code=401, detail="Token inválido")

        # Only allow the specific admin user
        if user_email != "plazeserviceuser@gmail.com":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tiene permisos para realizar esta acción."
            )

        return payload

    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")