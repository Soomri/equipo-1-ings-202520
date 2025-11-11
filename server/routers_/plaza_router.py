from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas.plaza_schema import PlazaDetalle
from services.plaza_service import obtener_plaza_por_id

router = APIRouter(prefix="/plazas", tags=["Plazas"])

@router.get("/{plaza_id}", response_model=PlazaDetalle)
def obtener_plaza(plaza_id: int, db: Session = Depends(get_db)):
    plaza = obtener_plaza_por_id(db, plaza_id)
    if not plaza:
        raise HTTPException(status_code=404, detail="Plaza no encontrada")
    return plaza