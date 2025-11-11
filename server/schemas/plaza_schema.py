from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

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

class Coordenadas(BaseModel):
    lat: float
    lon: float

class PlazaBase(BaseModel):
    plaza_id: int
    nombre: str
    direccion: Optional[str]
    ciudad: str
    estado: str
    horarios: Optional[str]
    numero_comerciantes: Optional[int]
    tipos_productos: Optional[str]
    datos_contacto: Optional[str]
    coordenadas: Optional[Coordenadas]
    fecha_creacion: datetime
    fecha_actualizacion: datetime

    class Config:
        orm_mode = True