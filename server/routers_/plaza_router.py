from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import PlazaMercado

router = APIRouter(
    prefix="/plazas",
    tags=["Plazas de Mercado"]
)


@router.get("/", summary="Obtener todas las plazas de mercado")
def obtener_plazas(db: Session = Depends(get_db)):
    """
    Retorna una lista con la información de todas las plazas de mercado.
    """
    plazas = db.query(PlazaMercado).all()

    if not plazas:
        raise HTTPException(status_code=404, detail="No hay plazas registradas")

    return plazas


@router.get("/nombre/{nombre}", summary="Obtener una plaza por su nombre")
def obtener_plaza_por_nombre(nombre: str, db: Session = Depends(get_db)):
    """
    Devuelve la información detallada de una plaza de mercado según su nombre.
    - Busca por coincidencia insensible a mayúsculas/minúsculas.
    """
    plaza = db.query(PlazaMercado).filter(PlazaMercado.nombre.ilike(nombre)).first()

    if not plaza:
        raise HTTPException(status_code=404, detail=f"No se encontró la plaza '{nombre}'")

    return plaza