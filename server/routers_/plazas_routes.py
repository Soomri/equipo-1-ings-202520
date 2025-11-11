from fastapi import APIRouter, Depends, Query, status, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import PlazaMercado
from models import PlazaCreate
from services.plazas_service import create_marketplace_service
from services import plazas_service
from utils.auth_utils import verify_admin
from pydantic import BaseModel
from utils.auth_utils import get_current_admin_user
from typing import Optional
from pydantic import BaseModel, Field
from schemas.plazas import PlazaUpdate

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

    verify_admin(email, password, db)
    new_marketplace = create_marketplace_service(db, plaza)
    return {
        "mensaje": "Plaza creada exitosamente",
        "plaza": {
            "plaza_id": new_marketplace.plaza_id,
            "nombre": new_marketplace.nombre,
            "estado": new_marketplace.estado
        }
    }

@router.put("/{plaza_id}", status_code=status.HTTP_200_OK)
def update_marketplace(
    plaza_id: int,
    plaza_data: PlazaUpdate,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin_user)  
):
    """
    Updates the info of an existing marketplace (plaza de mercado) (Only admin).
    Requires valid Bearer token in Authorization header.
    """
    try:
        updated_plaza = plazas_service.update_marketplace(plaza_id, plaza_data, db)
        return {
            "mensaje": "Plaza actualizada exitosamente",
            "plaza": {
                "plaza_id": updated_plaza.plaza_id,
                "nombre": updated_plaza.nombre,
                "horarios": updated_plaza.horarios,
                "fecha_actualizacion": updated_plaza.fecha_actualizacion
            }
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar la plaza: {str(e)}")
    
@router.delete("/{plaza_id}", status_code=status.HTTP_200_OK)
def delete_marketplace(
    plaza_id: int,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin_user)
):
    """
    Deletes a marketplace (plaza de mercado) by its ID.
    Only authorized admin users can perform this action.
    """
    result = plazas_service.delete_marketplace(plaza_id, db)
    return result