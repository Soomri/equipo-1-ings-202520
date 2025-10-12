# 🧮 Price History API

## 📋 Overview
This module provides a **RESTful API endpoint** that retrieves and analyzes the historical price variation of products over a specified number of months. It automatically detects **periods of increase, decrease, or stability** and returns detailed statistics and trends.

---

## ✨ Key Features
- 📊 Retrieve historical price data by product name
- 🔁 Automatically detects trend periods (Increase / Decrease / Stability)
- 📈 Calculates overall price trends and variations
- 📉 Provides key statistics (min, max, average, percentage change)
- ⚙️ Robust error handling and SQL-safe queries
- 🧠 Normalizes product names to handle spaces, hyphens, and case differences

---

## 🚀 Installation

### Prerequisites
- Python 3.9 or higher
- pip (Python package manager)
- PostgreSQL or MySQL database

### Install Dependencies
```bash
python -m venv venv
source venv/bin/activate  # Linux/macOS
# venv\Scripts\activate   # Windows

pip install fastapi sqlalchemy uvicorn[standard] python-dotenv
```

Or use:
```bash
pip install -r requirements.txt
```

### Example `requirements.txt`
```txt
fastapi==0.104.1
sqlalchemy==2.0.23
uvicorn[standard]==0.24.0
python-dotenv==1.0.0
psycopg2-binary==2.9.9  # For PostgreSQL
# OR
pymysql==1.1.0          # For MySQL
```

---

## ▶️ How to Run

### 1. Configure Database
`database.py` example:
```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://user:password@localhost:5432/dbname"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
```

### 2. Register the Router
```python
from fastapi import FastAPI
from price_history import router as price_history_router

app = FastAPI()
app.include_router(price_history_router)
```

### 3. Start the API
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Access the Docs
- Swagger UI → [http://localhost:8000/docs](http://localhost:8000/docs)
- Redoc → [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 🧠 Endpoint

### `GET /price-history/{product_name}?months=12`

#### Example Request
```bash
curl "http://localhost:8000/price-history/Aguacate%20Comun?months=12"
```

#### Example Successful Response (200)
```json
{
  "product": "Aguacate Comun",
  "period_months": 12,
  "start_date": "2024-12-01T00:00:00",
  "end_date": "2025-12-01T00:00:00",
  "overall_trend": "Stability",
  "statistics": {
    "initial_price": 4233,
    "final_price": 4233,
    "average_price": 4233,
    "max_price": 4233,
    "min_price": 4233,
    "percent_variation": 0.0,
    "total_records": 1
  },
  "periods": [],
  "history": [
    {
      "date": "2024-12-01T00:00:00",
      "price_per_kg": 4233
    }
  ]
}
```

#### Error Response (404)
```json
{
  "detail": "No historical data found for Aguacate Comun in the last 12 months."
}
```

#### Error Response (500)
```json
{
  "detail": "SQL Error: syntax error at or near ..."
}
```

---

## 🧩 How Trends Are Calculated

- **Increase** → Price variation > +2%
- **Decrease** → Price variation < -2%
- **Stability** → Variation between -2% and +2%

If total variation > 5% → overall trend = *Increase*
If total variation < -5% → overall trend = *Decrease*
Else → *Stability*

---

## 🧪 Testing

### Manual Tests
```bash
# Existing product
curl "http://localhost:8000/price-history/Aguacate%20Comun?months=12"

# Non-existent product
curl "http://localhost:8000/price-history/NoExiste?months=12"
```

---

## ⚙️ Configuration

Create a `.env` file:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
DEFAULT_MONTHS=12
TREND_THRESHOLD=2.0
```

---

## 🧱 Database Schema

### `productos`
```sql
CREATE TABLE productos (
    producto_id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    categoria_id INTEGER,
    descripcion TEXT
);
```

### `precios`
```sql
CREATE TABLE precios (
    precio_id SERIAL PRIMARY KEY,
    producto_id INTEGER REFERENCES productos(producto_id),
    precio_por_kg DECIMAL(10, 2) NOT NULL,
    fecha DATE NOT NULL
);
```

---

## 💡 Code Standards

- **Python** ≥ 3.9
- **PEP 8** compliant
- Use **type hints** and **docstrings**
- Format with `black`, lint with `flake8`
