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

4. Copy the value of `"access_token"` from the response:

   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

## 🔑 3. Authorize the Token

1. Click the **Authorize** button (🔓) in the top-right corner of Swagger UI.
2. In the value field, paste the token like this:

   ```
   Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

   ⚠️ Make sure you only include **one** `Bearer`.
   (Swagger sometimes duplicates it as `Bearer Bearer` — remove the extra one.)
3. Click **Authorize**, then **Close**.

---

## 🧩 4. Test: Update a Market’s Status (Admin Case ✅)

1. Go to:

   ```
   PUT /plazas/{plaza_id}/estado
   ```
2. Set:

   * **plaza_id (path)** → `1`
   * **estado (query)** → `inactiva`
3. Click **Execute**.

✅ **Expected success response:**

```json
{
  "plaza_id": 1,
  "nombre": "Plaza Central",
  "nuevo_estado": "inactiva",
  "mensaje": "Plaza 'Plaza Central' updated to 'inactiva'."
}
```

This means the authenticated admin (`plazeserviceuser@gmail.com`) successfully changed the market status.

---

## 🚫 5. Test: Update a Market as a Non-Admin User (Forbidden ❌)

1. First, log out from Swagger (**“Logout”** button near Authorize).

2. Log in again, but with a **different user** (not the admin):

   ```json
   {
     "correo": "user.root@gmail.com",
     "contrasena": "some_password"
   }
   ```

3. Copy the new token and authorize it as before.

4. Try executing again:

   ```
   PUT /plazas/1/estado?estado=inactiva
   ```

❌ **Expected error response:**

```json
{
  "detail": "Acceso denegado. Solo el administrador puede realizar esta acción."
}
```

This confirms that only the admin account is allowed to change the market status.

---

## ⚠️ 6. Common Issues

| Error Message                                     | Cause                                        | Solution                                     |
| ------------------------------------------------- | -------------------------------------------- | -------------------------------------------- |
| `401 Unauthorized` – `"Invalid or expired token"` | Token expired or “Bearer Bearer” duplication | Log in again and check header format         |
| `403 Forbidden` – `"Acceso denegado..."`          | Non-admin user attempting restricted action  | Use admin credentials                        |
| `404 Not Found`                                   | The `plaza_id` doesn’t exist                 | Verify that the plaza exists in the database |

---

## ✅ Example CURL Requests

### ✔️ Admin User (Success)

```bash
curl -X 'PUT' \
  'http://127.0.0.1:8000/plazas/1/estado?estado=inactiva' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

### ❌ Non-Admin User (Forbidden)

```bash
curl -X 'PUT' \
  'http://127.0.0.1:8000/plazas/1/estado?estado=inactiva' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJh...non_admin_token...'
```

**Response:**

```json
{
  "detail": "Acceso denegado. Solo el administrador puede realizar esta acción."
}
```

