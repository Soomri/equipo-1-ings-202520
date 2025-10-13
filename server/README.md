# 🧮 Price History API

## 📋 Overview
This module provides a **RESTful API endpoint** that retrieves and analyzes the historical price variation of products over a specified number of months. It automatically detects **periods of increase, decrease, or stability** and returns detailed statistics and trends.

---

## ✨ Key Features
- 📊 Retrieve historical price data by product name
- 🔍 Smart product search with partial name matching and suggestions
- 🔁 Automatically detects trend periods (Increase / Decrease / Stability)
- 📈 Calculates overall price trends and variations
- 📉 Provides key statistics (min, max, average, percentage change)
- ⚙️ Robust error handling and SQL-safe queries
- 🧠 Normalizes product names to handle spaces, hyphens, and case differences
- 🌐 Spanish language responses for better user experience

---

## 🚀 Installation

### Prerequisites
- Python 3.9 or higher
- pip (Python package manager)
- PostgreSQL database (Supabase)

### Install Dependencies
```bash
python -m venv venv
source venv/bin/activate  # Linux/macOS
# venv\Scripts\activate   # Windows

pip install -r requirements.txt
```

### Example `requirements.txt`
```txt
fastapi==0.104.1
sqlalchemy==2.0.23
uvicorn[standard]==0.24.0
python-dotenv==1.0.0
psycopg2-binary==2.9.11
```

## 🧠 Endpoint

### `GET /price-history/{product_name}?months=12`

#### Example Request
```bash
curl "http://localhost:8000/price-history/Aguacate%20Comun?months=12"
```

#### Example Successful Response (200)
```json
{
  "producto": "Aguacate Comun",
  "periodo_meses": 12,
  "fecha_inicio": "2024-12-01T00:00:00",
  "fecha_fin": "2025-12-01T00:00:00",
  "tendencia_general": "Estabilidad",
  "estadisticas": {
    "precio_inicial": 4233,
    "precio_final": 4233,
    "precio_promedio": 4233,
    "precio_maximo": 4233,
    "precio_minimo": 4233,
    "variacion_porcentual": 0.0,
    "total_registros": 1
  },
  "periodos": [],
  "historial": [
    {
      "fecha": "2024-12-01T00:00:00",
      "precio_por_kg": 4233
    }
  ]
}
```

#### Error Response - Not Found with Suggestions (404)
```json
{
  "detail": "No se encontraron datos históricos para 'Aguacat' en los últimos 12 meses. ¿Quisiste decir alguno de estos productos? Aguacate Comun, Aguacate Hass, Aguacate Papelillo"
}
```

#### Error Response - No Data (404)
```json
{
  "detail": "No se encontraron datos históricos para 'Producto Inexistente' en los últimos 12 meses."
}
```

#### Error Response (500)
```json
{
  "detail": "Error en la base de datos: syntax error at or near ..."
}
```

---

## 🧩 How Trends Are Calculated

- **Aumento** → Price variation > +2%
- **Disminución** → Price variation < -2%
- **Estabilidad** → Variation between -2% and +2%

If total variation > 5% → overall trend = *Aumento*
If total variation < -5% → overall trend = *Disminución*
Else → *Estabilidad*

---

## 🧪 Testing

### Manual Tests
```bash
# Existing product
curl "http://localhost:8000/price-history/Aguacate%20Comun?months=12"

# Partial product name (with suggestions)
curl "http://localhost:8000/price-history/Aguacat?months=12"

# Non-existent product
curl "http://localhost:8000/price-history/NoExiste?months=12"
```

---

## ⚙️ Configuration

Create a `.env` file:
```env
DATABASE_URL=postgresql://user:password@db.supabase.co:5432/postgres
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