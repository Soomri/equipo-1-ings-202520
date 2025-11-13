
# 🛒 Plaze Backend API

This folder contains the backend of the **Plaze** project — a FastAPI-based REST API that handles user registration, authentication, and management of market products and prices.
The database for this project was **created and hosted in Supabase**.

---

## 📚 Table of Contents

1. [📁 About This Folder](#-about-this-folder)
2. [⚙️ Installation](#️-installation)
3. [🚀 How to Run](#-how-to-run)
4. [🧩 Environment Variables (.env)](#-environment-variables-env)
5. [🧰 Requirements](#-requirements)
6. [🌐 Availability](#-availability)
7. [📡 API Endpoints to Test](#-api-endpoints-to-test)
8. [🧾 Coding Standards and Version](#-coding-standards-and-version)
9. [📊 Database Schema](#-database-schema)
10. [🧩 ADB (Database Management)](#-adb-database-management)

---

## 📁 About This Folder

This folder (`/server`) contains the backend logic for the **Plaze API**.
It includes:

* REST API endpoints built with **FastAPI**.
* Database integration using **Supabase (PostgreSQL)**.
* JWT authentication for secure user sessions.
* Routes for user registration, login, password recovery, and product management.

---

## ⚙️ Installation

1️⃣ Navigate to the `server` folder:

```bash
cd server
```

2️⃣ (Optional but recommended) Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate   # On macOS/Linux
venv\Scripts\activate      # On Windows
```

3️⃣ Install dependencies:

```bash
pip install -r requirements.txt
```

If you don’t have a `requirements.txt` file yet, you can generate it with:

```bash
pip freeze > requirements.txt
```

---

## 🚀 How to Run

Once dependencies are installed, start the API with:

```bash
uvicorn main:app --reload
```

The application will be available at:
👉 [http://127.0.0.1:8000](http://127.0.0.1:8000)

API documentation (Swagger UI) will be automatically generated at:
👉 [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 🧩 Environment Variables (.env)

This project uses **Supabase** as the database hosting platform.
You must create a `.env` file inside the `/server` folder with the following structure:

```bash
# 🗄️ Database Connection (Supabase)
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>

# 📨 Email Credentials (for notifications or password recovery)
EMAIL_USER=<service_email>
EMAIL_PASS=<app_password>

# 🔐 Security and Token Configuration
SECRET_KEY=<secret_key>
ALGORITHM="algoritm"
ACCESS_TOKEN_EXPIRE_MINUTES="200"

# ⚙️ Supabase Configuration
SUPABASE_KEY=<supabase_key>
SUPABASE_ANON_KEY=<supabase_anon_key>
SUPABASE_URL=<supabase_url>

# ⚙️ Additional Variables
VITE_API_URL=http://localhost:2000
DEFAULT_MONTHS= 8
TREND_THRESHOLD=1.0
```

> ⚠️ **Important:** The above values are examples only. Do not include real credentials in public repositories.
> The `.env` file must remain private and **must be placed inside the `/server` folder**, not at the project root.

---

## 🧰 Requirements

| Package                 | Description                                  |
| ----------------------- | -------------------------------------------- |
| **FastAPI**             | Main web framework for building the REST API |
| **Uvicorn**             | ASGI server for running FastAPI              |
| **SQLAlchemy**          | ORM for database operations                  |
| **Pydantic**            | Data validation and serialization            |
| **Passlib (argon2)**    | Secure password hashing                      |
| **python-jose / PyJWT** | JWT token generation and validation          |
| **email-validator**     | Email field validation                       |
| **python-dotenv**       | Environment variable management              |
| **requests**            | HTTP requests (for integrations)             |
| **psycopg2**            | PostgreSQL database adapter                  |

Install all dependencies via:

```bash
pip install -r requirements.txt
```

---

## 🌐 Availability

Once the API is running, it will be available at:

> **Local environment:**
> [http://127.0.0.1:8000](http://127.0.0.1:8000)

> **API documentation (Swagger UI):**
> [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

Ensure that the `.env` file is properly configured before launching the server — this guarantees successful connection to **Supabase**, email delivery for password recovery, and token management for authentication.

---

## 📡 API Endpoints to Test

Below are the main API endpoints available for testing via Swagger UI.

### 🧍‍♀️ **User Registration**

| Method   | Endpoint     | Description         |
| -------- | ------------ | ------------------- |
| **POST** | `/registro/` | Register a new user |

---

### 🔐 **Authentication**

| Method   | Endpoint       | Description |
| -------- | -------------- | ----------- |
| **POST** | `/auth/login`  | User login  |
| **POST** | `/auth/logout` | Logout user |

---

### 🔑 **Password Recovery**

| Method   | Endpoint                    | Description                  |
| -------- | --------------------------- | ---------------------------- |
| **POST** | `/password/recover/{email}` | Send password recovery email |
| **POST** | `/password/reset/{token}`   | Reset password using token   |

---

### 💰 **Prices**

| Method  | Endpoint                    | Description           |
| ------- | --------------------------- | --------------------- |
| **GET** | `/prices/latest/`           | Get latest price      |
| **GET** | `/prices/options/`          | Get price options     |
| **GET** | `/prices/products/`         | List products         |
| **GET** | `/prices/markets/medellin/` | List Medellín markets |

---

### 🧠 **Default / Health**

| Method  | Endpoint       | Description            |
| ------- | -------------- | ---------------------- |
| **GET** | `/health`      | Health check           |
| **GET** | `/maintenance` | Get maintenance status |

---

## 🧾 Coding Standards and Version

* Follows **PEP8** style guide.
* Uses **docstrings** to document routes, functions, and models.
* FastAPI automatically generates **OpenAPI (Swagger)** documentation for all routes.
* Developed and tested with **Python 3.10+**.
* Recommended IDE: **Visual Studio Code** or **PyCharm**, with linting enabled.

---

## 📊 Database Schema

The backend uses a **PostgreSQL database created in Supabase**.
Below is the base SQL schema used for this project:

```sql
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    correo VARCHAR(255) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(100),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE precios (
    id SERIAL PRIMARY KEY,
    producto_id INT REFERENCES productos(id) ON DELETE CASCADE,
    precio DECIMAL(10,2) NOT NULL,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE password_reset_links (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expiracion TIMESTAMP NOT NULL,
    tipo VARCHAR(50) DEFAULT 'password_recovery'
);
```

---

✅ **This README was created for the `/server` folder of the Plaze project.**
It documents the complete setup of the backend, including Supabase integration, environment configuration, dependencies, endpoints, and database schema.