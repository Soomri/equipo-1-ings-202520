from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from utils.auth_utils import get_current_admin_user
from services import plazas_service
from schemas.plazas import PlazaCreate, PlazaUpdate

router = APIRouter(
    prefix="/plazas",
    tags=["Plazas de Mercado"]
)

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_marketplace(
    plaza: PlazaCreate,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin_user)
):
    """
    Create a new marketplace
    Only the authenticated admin users can create a new marketplace.
    """
    try:
        new_marketplace = plazas_service.create_marketplace_service(db, plaza)
        return {
            "mensaje": "Plaza creada exitosamente",
            "plaza": {
                "plaza_id": new_marketplace.plaza_id,
                "nombre": new_marketplace.nombre,
                "estado": new_marketplace.estado
            }
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al crear la plaza: {str(e)}")


@router.put("/{plaza_id}", status_code=status.HTTP_200_OK)
def update_marketplace(
    plaza_id: int,
    plaza_data: PlazaUpdate,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin_user)
):
    """
    Update the details of an existing marketplace.
    Only the authenticated admin users can update marketplace details.
    """
    try:
        updated_marketplace = plazas_service.update_marketplace(plaza_id, plaza_data, db)
        return {
            "mensaje": "Plaza actualizada exitosamente",
            "plaza": {
                "plaza_id": updated_marketplace.plaza_id,
                "nombre": updated_marketplace.nombre,
                "horarios": updated_marketplace.horarios,
                "fecha_actualizacion": updated_marketplace.fecha_actualizacion
            }
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al actualizar la plaza: {str(e)}")


@router.delete("/{plaza_id}", status_code=status.HTTP_200_OK)
def delete_marketplace(
    plaza_id: int,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin_user)
):
    """
    Deletes a marketplace only if there are no associated products or prices.
    Only the authenticated admin users can delete a marketplace.
    """
    try:
        plazas_service.delete_marketplace(plaza_id, db)
        return {"mensaje": "Plaza eliminada correctamente"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al eliminar la plaza: {str(e)}")