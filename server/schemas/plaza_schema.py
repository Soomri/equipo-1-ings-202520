from pydantic import BaseModel
from typing import Optional, List

class PlazaDetalle(BaseModel):
    plaza_id: int
    nombre: str
    direccion: str
    ciudad: str
    horarios: Optional[str]
    numero_comerciantes: Optional[int]
    tipos_productos: Optional[List[str]]
    datos_contacto: Optional[str]
    estado: Optional[str]

    class Config:
        orm_mode = True