from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models import PlazaMercado
from routers_.auth import get_current_user_from_token
from datetime import datetime

router = APIRouter(prefix="/plazas", tags=["Markets"])

# --- Endpoint: Activate or deactivate a market (admin only) ---
@router.put("/{plaza_id}/estado")
def update_market_status(
    plaza_id: int,
    estado: str = Query(..., regex="^(activa|inactiva)$", description="Nuevo estado de la plaza"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_from_token)
):
    """
    Update the operational status (active/inactive) of a market.
    Only the administrator 'plazeserviceuser@gmail.com' is allowed to perform this action.
    """

    #  Validate admin
    if current_user.get("sub") != "plazeserviceuser@gmail.com":
        raise HTTPException(status_code=403, detail="Acceso denegado. Solo el administrador puede realizar esta acción.")

    #  Find the market
    plaza = db.query(PlazaMercado).filter(PlazaMercado.plaza_id == plaza_id).first()
    if not plaza:
        raise HTTPException(status_code=404, detail="Plaza no encontrada.")

    # Update status
    plaza.estado = estado
    plaza.fecha_actualizacion = datetime.utcnow()
    db.commit()
    db.refresh(plaza)

    return {
        "plaza_id": plaza.plaza_id,
        "nombre": plaza.nombre,
        "nuevo_estado": plaza.estado,
        "mensaje": f" '{plaza.nombre}' actualizada a '{plaza.estado}'."
    }
