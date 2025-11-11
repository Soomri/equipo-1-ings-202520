from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from database import get_db
from models import PlazaCreate
from services.plazas_service import crear_plaza_service
from utils.auth_utils import verificar_admin

router = APIRouter(
    prefix="/plazas",
    tags=["Plazas de Mercado"]
)

@router.post("/", status_code=status.HTTP_201_CREATED)
def crear_plaza(
    plaza: PlazaCreate,
    email: str = Query(..., description="admin email"),
    password: str = Query(..., description="admin password"),
    db: Session = Depends(get_db)
):
    """
    Creates a new marketplace (plaza de mercado).
    """
    verificar_admin(email, password, db)
    nueva_plaza = crear_plaza_service(db, plaza)
    return {
        "mensaje": "Plaza creada exitosamente",
        "plaza": {
            "plaza_id": nueva_plaza.plaza_id,
            "nombre": nueva_plaza.nombre,
            "estado": nueva_plaza.estado
        }
    }