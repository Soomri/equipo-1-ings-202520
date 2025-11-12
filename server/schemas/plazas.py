from pydantic import BaseModel, Field, field_validator, EmailStr
from typing import Optional
import re

class PlazaBase(BaseModel):
    nombre: str = Field(..., min_length=3, description="Nombre de la plaza (mínimo 3 caracteres)")
    direccion: str = Field(..., min_length=5, description="Dirección de la plaza")
    ciudad: str = Field(..., description="Debe ser Medellín")
    coordenadas: str = Field(..., description="Coordenadas en formato (lat, lng)")
    horarios: Optional[str] = Field(None, description="Ejemplo: Lun-Dom 6:00-18:00")
    numero_comerciantes: Optional[int] = Field(0, ge=0, description="Número de comerciantes (≥ 0)")
    tipos_productos: Optional[str] = None
    datos_contacto: Optional[str] = None

    @field_validator("ciudad")
    def validar_ciudad(cls, v):
        if v.strip().lower() != "medellín":
            raise ValueError("La ciudad debe ser 'Medellín'")
        return v

    @field_validator("coordenadas")
    def validar_coordenadas(cls, v):
        # Validar formato (lat, lng)
        pattern = r"^\(\s*-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?\s*\)$"
        if not re.match(pattern, v):
            raise ValueError("Formato inválido para coordenadas. Use el formato (lat, lng)")
        return v

    @field_validator("horarios")
    def validar_horarios(cls, v):
        if v and not re.match(r"^[A-Za-zÁÉÍÓÚáéíóú\-]{3,}-[A-Za-zÁÉÍÓÚáéíóú\-]{3,}\s\d{1,2}:\d{2}-\d{1,2}:\d{2}$", v):
            raise ValueError("Formato inválido de horarios. Ejemplo: 'Lun-Dom 6:00-18:00'")
        return v

    @field_validator("datos_contacto")
    def validar_contacto(cls, v):
        if v:
            # Validar si es email o teléfono
            if not (re.match(r"^\+?\d{6,15}$", v) or re.match(r"[^@]+@[^@]+\.[^@]+", v)):
                raise ValueError("El campo datos_contacto debe ser un correo o un número telefónico válido")
        return v


class PlazaCreate(PlazaBase):
    """Modelo de entrada para crear una plaza"""
    pass


class PlazaUpdate(BaseModel):
    """Modelo de actualización parcial"""
    nombre: Optional[str] = None
    direccion: Optional[str] = None
    ciudad: Optional[str] = None
    coordenadas: Optional[str] = None
    estado: Optional[str] = None
    horarios: Optional[str] = None
    numero_comerciantes: Optional[int] = Field(None, ge=0)
    tipos_productos: Optional[str] = None
    datos_contacto: Optional[str] = None