from sqlalchemy.orm import Session
from fastapi import HTTPException
from models import PlazaMercado, PlazaCreate

def crear_plaza_service(db: Session, plaza_data: PlazaCreate):
    """
    Create a new marketplace in the database.
    """
    nueva_plaza = PlazaMercado(
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
        db.add(nueva_plaza)
        db.commit()
        db.refresh(nueva_plaza)
        return nueva_plaza
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al crear la plaza: {str(e)}")