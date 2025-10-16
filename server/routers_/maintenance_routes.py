"""
System maintenance routes module.

This module provides endpoints to check for active maintenance windows
and retrieve maintenance messages from the database.
"""

from fastapi import APIRouter
from supabase import create_client, Client
import os
from dotenv import load_dotenv
from datetime import datetime, timezone
from dateutil import parser

load_dotenv()

router = APIRouter()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_ANON_KEY")
supabase: Client = create_client(url, key)


@router.get("/maintenance")
def get_maintenance():
    """
    Check for active system maintenance windows.

    This endpoint queries the system_maintenance table to determine if
    there is currently an active maintenance window. It compares the
    current UTC time against the start and end times of all maintenance
    records.

    Returns:
        dict: A dictionary containing maintenance status:
            - active (bool): True if there is an active maintenance window,
              False otherwise.
            - message (str, optional): The maintenance message if active.

    Example:
        >>> # Active maintenance
        >>> response = get_maintenance()
        >>> print(response)
        {'active': True, 'message': 'Scheduled maintenance in progress'}

        >>> # No active maintenance
        >>> response = get_maintenance()
        >>> print(response)
        {'active': False}

    Note:
        - All times are compared in UTC timezone.
        - Maintenance records must have 'start_time' and 'end_time' fields
          in ISO 8601 format.
        - Debug messages are printed to console for monitoring.
    """
    now_utc = datetime.now(timezone.utc)
    response = supabase.table("system_maintenance").select("*").execute()

    active = []
    for m in response.data or []:
        from dateutil import parser
        start = parser.isoparse(m["start_time"])
        end = parser.isoparse(m["end_time"])
        if start <= now_utc <= end:
            active.append(m)

    if active:
        print("✅ Mantenimiento activo encontrado:", active[0])
        return {"active": True, "message": active[0]["message"]}
    else:
        print("❌ No hay mantenimiento activo.")
        return {"active": False}