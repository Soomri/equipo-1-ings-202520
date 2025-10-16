# database.py
"""
This module sets up the SQLAlchemy database connection and session for the application.
- Loads environment variables using python-dotenv.
- Retrieves the database URL from environment variables.
- Creates a SQLAlchemy engine using the database URL.
- Configures a session factory (`SessionLocal`) for database interactions.
- Defines a base class (`Base`) for declarative ORM models.

Usage:
    Import `SessionLocal` to create database sessions.
    Inherit from `Base` to define ORM models.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database URL from .env
DATABASE_URL = os.getenv("DATABASE_URL")

# SQLAlchemy engine and session
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for ORM models
Base = declarative_base()


def get_db():
    """
    Dependency function to get a database session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
