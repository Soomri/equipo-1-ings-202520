
# 🏪 Plaza Market API – Admin Status Control

This guide explains how to test the authentication system and update a market’s operational status (`activa` / `inactiva`) using **FastAPI Swagger UI**.

---

## 🚀 1. Start the API

Make sure your FastAPI application is running locally (usually on port `8000`):

```bash
uvicorn main:app --reload
```

Then open your browser at:

👉 [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 👤 2. Log in to Get an Access Token

1. In Swagger UI, go to the endpoint:

   ```
   POST /auth/login
   ```
2. Enter your credentials (JSON body):

   ```json
   {
     "correo": "plazeserviceuser@gmail.com",
     "contrasena": "your_admin_password"
   }
   ```
3. Click **Execute**.
4. Copy the value of "access_token" from the response — not the example below, which is only for reference:

"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

⚠️ Note: The token above is just an example and won’t work. Replace it with your actual token.

---

## 🔑 3. Authorize the Token

1. Click the **Authorize** button (🔓) in the top-right corner of Swagger UI.
2. In the value field, paste the token like this:

   ```
    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Click **Authorize**, then **Close**.

---

## 🧩 4. Test: Update a Market’s Status (Admin Case ✅)

1. Go to:

   ```
   PUT /plazas/{plaza_id}/estado
   ```
2. Set:

   * **plaza_id (path)** → e.g `1`
   * **estado (query)** → e.g `inactiva`
3. Click **Execute**.

✅ **Expected success response:**

```json
{
  "plaza_id": 1,
  "nombre": "Central Mayorista de Antioquia",
  "nuevo_estado": "inactiva",
  "mensaje": "Plaza 'Central Mayorista de Antioquia' actualizada a  'inactiva'."
}
```

This means the authenticated admin successfully changed the market status.

---

## 🚫 5. Test: Update a Market as a Non-Admin User (Forbidden ❌)

1. Log out from Swagger (**“Logout”** button near Authorize).
2. Log in again, but with a **different user** (not admin):

   ```json
   {
     "correo": "user.root@gmail.com",
     "contrasena": "some_password"
   }
   ```
3. Authorize the token again.
4. Try executing:

   ```
   PUT /plazas/1/estado?estado=inactiva
   ```

❌ **Expected error response:**

```json
{
  "detail": "Acceso denegado. Solo el administrador puede realizar esta acción."
}
```

---

## 🧾 6. Test: Behavior When a Plaza Is Inactive

After setting **“Central Mayorista de Antioquia”** to `inactiva`, test how the price endpoints respond.

---

### 🔍 A. Try fetching a product price (should fail)

Endpoint:

```
GET /prices/latest/
```

**Parameters:**

```
product_name = "Aguacate Común"
market_name = "Central Mayorista de Antioquia"
```

🚫 **Expected error response:**

```json
{
  "detail": "El mercado 'Central Mayorista de Antioquia' está actualmente inactivo."
}
```

✅ This confirms that inactive markets are correctly excluded from price queries.

---

### 📋 B. Check active markets

Endpoint:

```
GET /prices/markets/medellin/
```

**Expected:**
“Central Mayorista de Antioquia” should **not appear** in the list.

Example response:

```json
{
  "plazas": [
    {
      "id": 2,
      "nombre": "Plaza Minorista",
      "ciudad": "Medellín"
    }
  ],
  "mensaje": "Lista de plazas activas de Medellín obtenida exitosamente."
}
```

---

### ⚙️ C. Check available options

Endpoint:

```
GET /prices/options/
```

**Expected:**
Only active markets appear under `"plazas"`.

Example:

```json
{
  "productos": [...],
  "plazas": [
    { "id": 2, "nombre": "Plaza Minorista", "ciudad": "Medellín" }
  ],
  "mensaje": "Opciones disponibles obtenidas correctamente (solo plazas activas)."
}
```

---

## 🔁 7. Reactivate the Market

Once the tests are completed, reactivate the plaza by calling the same endpoint again:

```
PUT /plazas/{plaza_id}/estado
```

**Parameters:**

* **plaza_id (path)** → `1`
* **estado (query)** → `activa`

✅ **Expected success response:**

```json
{
  "plaza_id": 1,
  "nombre": "Central Mayorista de Antioquia",
  "nuevo_estado": "activa",
  "mensaje": "Plaza 'Central Mayorista de Antioquia' updated to 'activa'."
}
```

