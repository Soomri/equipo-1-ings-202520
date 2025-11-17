# database.py
"""
This module sets up the SQLAlchemy database connection and session for the application.
- Loads environment variables using python-dotenv.
- Retrieves the database URL from environment variables.
- Creates a SQLAlchemy engine with a connection pool for efficient concurrency.
- Configures a session factory (`SessionLocal`) for database interactions.
- Defines a base class (`Base`) for declarative ORM models.

Usage:
    Import `SessionLocal` to create database sessions.
    Inherit from `Base` to define ORM models.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import QueuePool
import os
from dotenv import load_dotenv



# Database URL from .env
DATABASE_URL = os.environ.get("DATABASE_URL")

# SQLAlchemy engine and session
engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,   # Use QueuePool to manage a limited number of connections
    pool_size=5,           # Maximum 5 active connections
    max_overflow=2,        # Allow 2 extra temporary connections during high load
    pool_timeout=30,       # Wait up to 30 seconds for a free connection before raising an error
    pool_recycle=1800,     # Recycle connections every 30 minutes to prevent timeouts
)

# Session factory for database operations
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for ORM models
Base = declarative_base()


def get_db():
    """
    Dependency function to get a database session.
    Ensures the session is properly closed after use.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()