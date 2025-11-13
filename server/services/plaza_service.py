from sqlalchemy.orm import Session
from models import PlazaMercado

def get_marketplace_by_id(db: Session, plaza_id: int):
    plaza = db.query(PlazaMercado).filter(PlazaMercado.plaza_id == plaza_id).first()
    if not plaza:
        return None
    
    # Transform tipos_productos from CSV text to list
    tipos_productos = (
        plaza.tipos_productos.split(",") if plaza.tipos_productos else []
    )

    return {
        "plaza_id": plaza.plaza_id,
        "nombre": plaza.nombre,
        "direccion": plaza.direccion,
        "ciudad": plaza.ciudad,
        "horarios": plaza.horarios,
        "numero_comerciantes": plaza.numero_comerciantes,
        "tipos_productos": [p.strip() for p in tipos_productos],
        "datos_contacto": plaza.datos_contacto,
        "estado": plaza.estado,
    }