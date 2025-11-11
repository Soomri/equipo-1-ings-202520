from pydantic import BaseModel, Field
from typing import Optional

class Coordenadas(BaseModel):
    lat: float = Field(..., description="Latitud")
    lon: float = Field(..., description="Longitud")

class PlazaUpdate(BaseModel):
    nombre: Optional[str] = None
    direccion: Optional[str] = None
    ciudad: Optional[str] = None
    coordenadas: Optional[Coordenadas] = None
    estado: Optional[str] = None
    horarios: Optional[str] = None
    numero_comerciantes: Optional[int] = None
    tipos_productos: Optional[str] = None
    datos_contacto: Optional[str] = None