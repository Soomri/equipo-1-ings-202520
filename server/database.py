"""
Database configuration module for SQLAlchemy connection management.

This module establishes the database connection and provides essential
components for ORM operations:
- Database engine configuration
- Session factory for database transactions
- Base class for declarative ORM models
- Dependency injection function for FastAPI

The database URL is loaded from environment variables for secure configuration
management across different deployment environments.

Environment Variables:
    DATABASE_URL: PostgreSQL connection string in the format:
                 postgresql://user:password@host:port/database

Usage:
    # Creating database sessions
    from database import SessionLocal
    db = SessionLocal()

    # Defining ORM models
    from database import Base
    class MyModel(Base):
        __tablename__ = "my_table"

    # FastAPI dependency injection
    from database import get_db
    @app.get("/items")
    def read_items(db: Session = Depends(get_db)):
        return db.query(Item).all()
"""

import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base


# ===============================
# ENVIRONMENT CONFIGURATION
# ===============================

# Load environment variables from .env file
load_dotenv()

# Retrieve database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError(
        "DATABASE_URL environment variable is not set. "
        "Please configure it in your .env file."
    )


# ===============================
# DATABASE ENGINE & SESSION
# ===============================

# Create SQLAlchemy engine for database connection
engine = create_engine(
    DATABASE_URL,
    echo=False,  # Set to True for SQL query logging during development
    pool_pre_ping=True,  # Enable connection health checks
)

# Configure session factory for database operations
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class for all ORM models
Base = declarative_base()


# ===============================
# DEPENDENCY FUNCTIONS
# ===============================

def get_db():
    """
    Database session dependency for FastAPI endpoints.

    Creates a new SQLAlchemy session for each request and ensures proper
    cleanup after the request is completed. This function is designed to be
    used with FastAPI's dependency injection system.

    Yields:
        Session: Active database session for executing queries.

    Example:
        >>> from fastapi import Depends
        >>> from sqlalchemy.orm import Session
        >>> 
        >>> @app.get("/users")
        >>> def get_users(db: Session = Depends(get_db)):
        ...     return db.query(User).all()

    Note:
        The session is automatically closed in the finally block, ensuring
        proper resource management even if an exception occurs during
        request processing.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()