from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models import PlazaMercado, PlazaCreate
from schemas.plazas import PlazaUpdate

def create_marketplace_service(db: Session, plaza_data: PlazaCreate):
    """
    Create a new marketplace in the database.
    """
    new_marketplace = PlazaMercado(
        nombre=plaza_data.nombre,
        direccion=plaza_data.direccion,
        ciudad=plaza_data.ciudad,
        coordenadas=plaza_data.coordenadas,
        estado="activa",
        horarios=plaza_data.horarios,
        numero_comerciantes=plaza_data.numero_comerciantes,
        tipos_productos=plaza_data.tipos_productos,
        datos_contacto=plaza_data.datos_contacto
    )

    try:
        db.add(new_marketplace)
        db.commit()
        db.refresh(new_marketplace)
        return new_marketplace
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al crear la plaza: {str(e)}")
    
def update_marketplace(plaza_id: int, plaza_data: PlazaUpdate, db: Session):
    plaza = db.query(PlazaMercado).filter(PlazaMercado.plaza_id == plaza_id).first()
    if not plaza:
        raise HTTPException(status_code=404, detail="Plaza no encontrada")

    # Update only the fields provided in plaza_data
    for key, value in plaza_data.dict(exclude_unset=True).items():
        if key == "coordenadas" and value is not None:
            # Converts to string format "(lat,lon)"
            lat, lon = value["lat"], value["lon"]
            setattr(plaza, key, f"({lat},{lon})")
        else:
            setattr(plaza, key, value)

    db.commit()
    db.refresh(plaza)
    return plaza

def delete_marketplace(plaza_id: int, db: Session):
    """
    Deletes a marketplace from the database by its ID.
    """
    plaza = db.query(PlazaMercado).filter(PlazaMercado.plaza_id == plaza_id).first()

    if not plaza:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plaza no encontrada"
        )

    try:
        db.delete(plaza)
        db.commit()
        return {"mensaje": f"La plaza con ID {plaza_id} fue eliminada exitosamente."}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error al eliminar la plaza: {str(e)}"
        )