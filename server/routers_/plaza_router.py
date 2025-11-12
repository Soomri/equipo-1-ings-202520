from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import PlazaMercado
from schemas.plaza_schema import PlazaBase

router = APIRouter(
    prefix="/plazas",
    tags=["Plazas de Mercado"]
)

@router.get("/", summary="Get all marketplaces")
def obtener_plazas(db: Session = Depends(get_db)):
    """
    Returns a list of all marketplaces with their details.
    Normalizes coordinates for Google Maps compatibility.
    """
    plazas = db.query(PlazaMercado).all()

    if not plazas:
        raise HTTPException(status_code=404, detail="No hay plazas registradas")

    plazas_normalizadas = []
    for plaza in plazas:
        plaza_dict = plaza.__dict__.copy()

        # Normalizes coordinates "(6.1868153,75.5914233)" -> {"lat": 6.1868153, "lon": -75.5914233}
        coords_text = plaza_dict.get("coordenadas")
        if coords_text:
            try:
                coords = coords_text.strip("()").split(",")
                lat = float(coords[0])
                lon = float(coords[1])
                if lon > 0:  # Correcting longitude sign for Western Hemisphere
                    lon = -lon
                plaza_dict["coordenadas"] = {"lat": lat, "lon": lon}
            except Exception:
                plaza_dict["coordenadas"] = None
        else:
            plaza_dict["coordenadas"] = None

        plazas_normalizadas.append(plaza_dict)

    return plazas_normalizadas


@router.get("/nombre/{nombre}", summary="Get a marketplace by name")
def get_marketplace_by_name(nombre: str, db: Session = Depends(get_db)):
    """
    Gets marketplace details by name.
    Searches by case-insensitive match.
    Implements coordinate normalization for frontend compatibility.
    """
    plaza = db.query(PlazaMercado).filter(PlazaMercado.nombre.ilike(nombre)).first()

    if not plaza:
        raise HTTPException(status_code=404, detail=f"No se encontró la plaza '{nombre}'")

    plaza_dict = plaza.__dict__.copy()

    # Normalizes coordinates "(6.1868153,75.5914233)" -> {"lat": 6.1868153, "lon": -75.5914233}
    coords_text = plaza_dict.get("coordenadas")
    if coords_text:
        try:
            coords = coords_text.strip("()").split(",")
            lat = float(coords[0])
            lon = float(coords[1])
            if lon > 0:
                lon = -lon
            plaza_dict["coordenadas"] = {"lat": lat, "lon": lon}
        except Exception:
            plaza_dict["coordenadas"] = None
    else:
        plaza_dict["coordenadas"] = None

    return plaza_dict