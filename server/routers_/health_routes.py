"""
System health routes module.

This module provides endpoints to verify service status
and monitor its availability.
"""

from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
def health_check():
    """
    Check the health status of the service.

    This endpoint allows performing health checks to confirm that the
    service is online and responding correctly. It is useful for
    monitoring systems, load balancers, and container orchestrators.

    Returns:
        dict: A dictionary with two keys:
            - status (str): Service status, always "ok" if responding.
            - message (str): Descriptive message of the service status.

    Example:
        >>> response = health_check()
        >>> print(response)
        {'status': 'ok', 'message': 'Servicio en línea'}
    """
    return {"status": "ok", "message": "Servicio en línea"}