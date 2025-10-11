# Price History API

## 📋 What does this module do?

This module provides a RESTful API endpoint that retrieves and analyzes the historical price variation of products over a specified time period.

### Key Features:
- 📊 Fetches historical price data for any product
- 📈 Calculates overall price trends (Increase/Decrease/Stability)
- 🔍 Detects and segments different trend periods automatically
- 📉 Provides statistical summaries (min, max, average prices)
- 🎯 Returns data ready for chart visualization

---

## 🚀 Installation

### Prerequisites
- Python 3.9 or higher
- pip (Python package manager)
- PostgreSQL or MySQL database (with product and price tables)

### Install Dependencies

```bash
# Create a virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install required packages
pip install fastapi
pip install sqlalchemy
pip install uvicorn[standard]
pip install python-dotenv
```

Or install from requirements.txt:

```bash
pip install -r requirements.txt
```

### Requirements.txt
```txt
fastapi==0.104.1
sqlalchemy==2.0.23
uvicorn[standard]==0.24.0
python-dotenv==1.0.0
psycopg2-binary==2.9.9  # For PostgreSQL
# OR
pymysql==1.1.0  # For MySQL
```

---

## ▶️ How to Run

### 1. Configure Database Connection

Create a `database.py` file or ensure your database connection is configured:

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Example for PostgreSQL
DATABASE_URL = "postgresql://user:password@localhost:5432/dbname"

# Example for MySQL
# DATABASE_URL = "mysql+pymysql://user:password@localhost:3306/dbname"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
```

### 2. Register the Router in main.py

Add the price history router to your FastAPI application:

```python
# Register the price history router
app.include_router(price_history_router, tags=["Price History"])
```

### 3. Start the API Server

```bash
# Run with uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Access the API

- **API Documentation (Swagger UI)**: http://localhost:8000/docs
- **Alternative Documentation (ReDoc)**: http://localhost:8000/redoc
- **Endpoint**: `GET /price-history/{product_name}?months=12`

### Example Request

```bash
# Using curl
curl -X GET "http://localhost:8000/price-history/Papa%20Criolla?months=12"

# Using HTTPie
http GET "http://localhost:8000/price-history/Papa Criolla" months==12
```

---

## 🗄️ Database Requirements

### Required Tables

The API expects the following database structure:

#### 1. `productos` table
```sql
CREATE TABLE productos (
    producto_id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    categoria_id INTEGER,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. `precios` table
```sql
CREATE TABLE precios (
    precio_id SERIAL PRIMARY KEY,
    producto_id INTEGER REFERENCES productos(producto_id),
    precio_por_kg DECIMAL(10, 2) NOT NULL,
    fecha DATE NOT NULL,
    supermercado_id INTEGER,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Sample Data

```sql
-- Insert sample product
INSERT INTO productos (nombre, categoria_id) 
VALUES ('Papa Criolla', 1);

-- Insert historical prices (last 12 months)
INSERT INTO precios (producto_id, precio_por_kg, fecha) VALUES
(1, 3500, '2024-10-10'),
(1, 3600, '2024-11-10'),
(1, 3700, '2024-12-10'),
(1, 3800, '2025-01-10'),
(1, 3900, '2025-02-10'),
(1, 4000, '2025-03-10'),
(1, 4100, '2025-04-10'),
(1, 4200, '2025-05-10'),
(1, 4300, '2025-06-10'),
(1, 4400, '2025-07-10'),
(1, 4500, '2025-08-10'),
(1, 4600, '2025-09-10'),
(1, 4700, '2025-10-10');
```

---

## 📚 Coding Standards

### Python Version
- **Python 3.9+** (tested with 3.9, 3.10, 3.11)

### Code Style
- **PEP 8**: Python Enhancement Proposal 8 (official style guide)
- **Type Hints**: Use type annotations for function parameters and returns
- **Docstrings**: Google-style docstrings for all functions and classes

### Documentation Standards
```python
def function_name(param1: str, param2: int) -> Dict:
    """
    Brief description of what the function does.
    
    Args:
        param1: Description of param1
        param2: Description of param2
    
    Returns:
        Description of return value
    
    Raises:
        HTTPException: Description of when this is raised
    """
    pass
```

### Naming Conventions
- **Functions/Variables**: `snake_case` (e.g., `analyze_periods`, `product_name`)
- **Classes**: `PascalCase` (e.g., `ProductHistory`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_MONTHS`)
- **Database tables**: Spanish names as per existing schema

### Code Quality Tools (Recommended)
```bash
# Install linting tools
pip install black flake8 mypy pylint

# Format code
black price_history.py

# Check style
flake8 price_history.py

# Type checking
mypy price_history.py
```

---

## 📖 API Response Schema

### Success Response (200)
```json
{
  "product": "Papa Criolla",
  "period_months": 12,
  "start_date": "2024-10-10T00:00:00",
  "end_date": "2025-10-10T00:00:00",
  "overall_trend": "Increase",
  "statistics": {
    "initial_price": 3500,
    "final_price": 4700,
    "average_price": 4100,
    "max_price": 4700,
    "min_price": 3500,
    "percent_variation": 34.29,
    "total_records": 13
  },
  "periods": [
    {
      "start_date": "2024-10-10T00:00:00",
      "end_date": "2025-10-10T00:00:00",
      "start_price": 3500,
      "end_price": 4700,
      "trend": "Increase",
      "percent_variation": 34.29
    }
  ],
  "history": [
    {
      "date": "2024-10-10T00:00:00",
      "price_per_kg": 3500
    }
    // ... more data points
  ]
}
```

### Error Response (404)
```json
{
  "detail": "No historical data found for Papa Criolla in the last 12 months"
}
```

---

## 🧪 Testing

### Run Manual Tests

```bash
# Test with different products
curl "http://localhost:8000/price-history/Papa%20Criolla?months=12"
curl "http://localhost:8000/price-history/Aguacate%20Comun?months=6"

# Test error handling
curl "http://localhost:8000/price-history/NonExistentProduct?months=12"
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
DEBUG_MODE=True

# Business Logic
DEFAULT_MONTHS=12
TREND_THRESHOLD=5.0  # Percentage for trend detection
```

Load in your application:
```python
from dotenv import load_dotenv
import os

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
```

---

## 🐛 Troubleshooting

### Common Issues

**1. Database Connection Error**
```
Solution: Check DATABASE_URL in database.py
Verify database is running: pg_isready (PostgreSQL)
```

**2. No Data Found (404)**
```
Solution: Ensure products table has data
Check product name matches exactly (case-insensitive search is enabled)
Verify precios table has entries within the requested time range
```

**3. Module Import Error**
```
Solution: Ensure all dependencies are installed
Activate virtual environment before running
Check Python version (3.9+)
```