from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError, DataError
from models import PlazaMercado, Precio
from schemas.plazas import PlazaCreate, PlazaUpdate
from sqlalchemy.orm import Session
from sqlalchemy import text

def create_marketplace_service(db: Session, plaza: PlazaCreate):
    existing = db.query(PlazaMercado).filter(
        PlazaMercado.nombre.ilike(plaza.nombre),
        PlazaMercado.ciudad.ilike(plaza.ciudad)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ya existe una plaza con ese nombre en la misma ciudad")

    try:
        lat, lng = eval(plaza.coordenadas)  # transforms "(6.25,4.2)" → (6.25, 4.2)
        point = f"POINT({lat} {lng})"

        new_marketplace = PlazaMercado(
            nombre=plaza.nombre,
            direccion=plaza.direccion,
            ciudad=plaza.ciudad,
            coordenadas=f"({lat}, {lng})",
            horarios=plaza.horarios,
            numero_comerciantes=plaza.numero_comerciantes,
            tipos_productos=plaza.tipos_productos,
            datos_contacto=plaza.datos_contacto
        )

        db.add(new_marketplace)
        db.commit()
        db.refresh(new_marketplace)
        return new_marketplace
    except SyntaxError:
        raise HTTPException(status_code=400, detail="Formato inválido de coordenadas. Usa '(lat, lng)'")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al crear plaza: {str(e)}")


def update_marketplace(plaza_id: int, plaza_data: PlazaUpdate, db: Session):
    plaza = db.query(PlazaMercado).filter(PlazaMercado.plaza_id == plaza_id).first()
    if not plaza:
        raise HTTPException(status_code=404, detail="Plaza no encontrada")

    for campo, valor in plaza_data.dict(exclude_unset=True).items():
        setattr(plaza, campo, valor)

    try:
        db.commit()
        db.refresh(plaza)
        return plaza
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error al actualizar plaza: {str(e)}")


def delete_marketplace(plaza_id: int, db: Session):
    plaza = db.query(PlazaMercado).filter(PlazaMercado.plaza_id == plaza_id).first()
    if not plaza:
        raise HTTPException(status_code=404, detail="Plaza no encontrada")

    related = db.query(Precio).filter(Precio.plaza_id == plaza_id).all()
    if related:
        raise HTTPException(
            status_code=400,
            detail="No se puede eliminar la plaza porque tiene productos o precios asociados."
        )

    try:
        db.delete(plaza)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al eliminar la plaza: {str(e)}")