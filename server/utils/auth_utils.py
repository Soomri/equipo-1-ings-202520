from sqlalchemy.orm import Session
from fastapi import HTTPException
from argon2 import PasswordHasher
from models import User

ph = PasswordHasher()

def verificar_admin(email: str, password: str, db: Session):
    """
    Verifies if the user exists, password is correct and has admin role.
    """
    usuario = db.query(User).filter(User.correo == email).first()

    if not usuario:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")

    try:
        # Verifies the password using Argon2
        ph.verify(usuario.contrasena_hash, password)
    except Exception:
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")

    # Validates if the user has admin role
    if usuario.rol != "admin":
        raise HTTPException(status_code=403, detail="Permiso denegado: no es administrador")

    return True