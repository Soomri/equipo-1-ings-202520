from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas.plaza_schema import PlazaDetalle
from services.plaza_service import obtener_plaza_por_id
from models import PlazaMercado

router = APIRouter(prefix="/plazas", tags=["Plazas"])

@router.get("/{plaza_id}", response_model=PlazaDetalle)
def obtener_plaza(plaza_id: int, db: Session = Depends(get_db)):
    plaza = obtener_plaza_por_id(db, plaza_id)
    if not plaza:
        raise HTTPException(status_code=404, detail="Plaza no encontrada")
    return plaza

@router.get("/", summary="Obtener todas las plazas de mercado")
def obtener_plazas(db: Session = Depends(get_db)):
    """
    Retorna una lista con la información de todas las plazas de mercado.
    """
    plazas = db.query(PlazaMercado).all()

    if not plazas:
        raise HTTPException(status_code=404, detail="No hay plazas registradas")

    return plazas