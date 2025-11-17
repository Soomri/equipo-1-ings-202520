# 🛡️ Security documentation
**User Data Protection**

## Table of Contents
- [🛡️ Security documentation](#️-security-documentation)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [🔎 Acceptance Criteria](#-acceptance-criteria)
    - [✅ 1. Secure Password Storage](#-1-secure-password-storage)
    - [✅ 2. Robust Password Validation](#-2-robust-password-validation)
    - [✅ 3. JWT-Based Authentication](#-3-jwt-based-authentication)
    - [✅ 4. Brute Force Attack Protection](#-4-brute-force-attack-protection)
    - [✅ 5. Secure Session Management](#-5-secure-session-management)
    - [✅ 6. Secure Password Recovery Links](#-6-secure-password-recovery-links)
    - [✅ 7. Sensitive Data Protection in Environment Variables](#-7-sensitive-data-protection-in-environment-variables)
    - [✅ 8. HTTPS Communication](#-8-https-communication)
  - [📊 Compliance Summary](#-compliance-summary)

---

## Description
All sensitive information provided by users (such as names, emails, and passwords) must be stored securely, applying encryption and hashing. The FastAPI API communicates with the PostgreSQL database hosted on **Supabase**, which provides encryption in transit via HTTPS/TLS. Additionally, communication between client and server must be protected using HTTPS to prevent unauthorized access.

---

## 🔎 Acceptance Criteria

### ✅ 1. Secure Password Storage
- **Implemented**: Passwords are stored using **Argon2**, a Password Hashing Competition winning algorithm.
- **Location**: 
  - `auth.py` line 131: `argon2.verify(user.contrasena, usuario.contrasena_hash)`
  - `password_recovery.py` line 185: `usuario.contrasena_hash = argon2.hash(body.nueva_contrasena)`
  - `user_registration.py`: New user passwords are hashed using Argon2 before being stored in the database
- **Evidence**: No passwords are stored in plain text; only irreversible hashes with automatic salt.

**User Registration Implementation:**

In `user_registration.py`, new user passwords are hashed using Argon2 before being stored in the database. This guarantees that even if database data is compromised, the actual passwords remain protected due to Argon2's strong resistance to brute-force and GPU-based attacks.

```python
# Example usage in auth.py
if not argon2.verify(user.contrasena, usuario.contrasena_hash):
    usuario.intentos_fallidos = (usuario.intentos_fallidos or 0) + 1
```

```python
# user_registration.py
hashed_password = argon2.hash(user.password)
supabase.table("usuarios").insert({
    "nombre": user.name,
    "correo": user.email,
    "contrasena_hash": hashed_password,
}).execute()
```

### ✅ 2. Robust Password Validation
- **Implemented**: Regex that requires minimum complexity.
- **Location**: 
  - `user_registration.py` line 27
  - `password_recovery.py` line 142
- **Requirements**:
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 number
  - At least 1 special character (!@#$%^&*)

```python
def validate_password(password: str) -> bool:
    regex = r'^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$'
    return re.match(regex, password) is not None
```

**User Registration Implementation:**

The same password validation rules are enforced during user registration in `user_registration.py`. This prevents weak passwords at account creation by using the same regular expression to verify complexity:

```python
# user_registration.py
def validate_password(password: str) -> bool:
    regex = r'^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$'
    return re.match(regex, password) is not None
```

If the password does not meet these requirements, the API returns a descriptive error message in Spanish:

```json
{
  "detail": "La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial (!@#$%^&*)."
}
```

### ✅ 3. JWT-Based Authentication
- **Implemented**: Tokens signed with **HS256** algorithm.
- **Location**: `jwt_manager.py`
- **Features**:
  - Secret key stored in environment variables (`.env`)
  - Configurable expiration time (default: 2 hours)
  - Cryptographic signature to prevent tampering
- **Evidence**: `auth.py`

```python
# jwt_manager.py
def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
```

### ✅ 4. Brute Force Attack Protection
- **Implemented**: Temporary lockout system after 3 failed attempts.
- **Location**: `auth.py` lines 131-145
- **Features**:
  - 15-minute lockout after 3 consecutive failures
  - Automatic email notification with recovery link
  - Counter reset after successful login

```python
# auth.py
if usuario.intentos_fallidos >= 3:
    usuario.cuenta_bloqueada_hasta = datetime.utcnow() + timedelta(minutes=15)
    db.commit()
    enviar_correo_bloqueo(usuario.correo, usuario.nombre)
    raise HTTPException(
        status_code=403,
        detail="Account locked due to multiple failed attempts."
    )
```

### ✅ 5. Secure Session Management
- **Implemented**: 
  - **Token blacklist** (in-memory) to invalidate tokens after logout
  - Token verification on each protected request
- **Note**: The in-memory token blacklist is cleared whenever the server restarts. 
  - In future improvements, a distributed cache such as **Redis** could be used to persist token invalidation across multiple instances.
- **Location**: `auth.py` lines 23-189

```python
# auth.py
TOKEN_BLACKLIST: set[str] = set()

def check_token_not_blacklisted(token: str):
    if token in TOKEN_BLACKLIST:
        raise HTTPException(status_code=401, detail="Invalid token (logout required)")

@router.post("/logout")
def logout(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    if token in TOKEN_BLACKLIST:
        raise HTTPException(status_code=400, detail="Token already invalidated")
    TOKEN_BLACKLIST.add(token)
    return {"message": "Session closed successfully"}
```

### ✅ 6. Secure Password Recovery Links
- **Implemented**: Single-use UUID v4 tokens with expiration.
- **Location**: `password_utils.py`
- **Features**:
  - Unique random token (UUID4)
  - 1-hour expiration
  - Marked as "used" after first use
  - State validation before password reset

```python
# password_utils.py
def crear_enlace_recuperacion(usuario: Usuario, db: Session, tipo="recuperacion_password", expiracion_horas=1):
    token = str(uuid.uuid4())
    expira = datetime.utcnow() + timedelta(hours=expiracion_horas)
    
    enlace = EnlaceCorreo(
        usuario_id=usuario.usuario_id,
        enlace_url=token,
        tipo=tipo,
        expira_en=expira,
        usado=False
    )
    db.add(enlace)
    db.commit()
    
    reset_link = f"http://localhost:8000/password/reset/{token}"
    return token, reset_link
```

### ✅ 7. Sensitive Data Protection in Environment Variables
- **Implemented**: Critical credentials and security configurations are stored outside the source code.  
  For example, tokens are signed using a secure HMAC-based algorithm (configurable via environment variables).
- **Protected variables**:
  - `DATABASE_URL` (DB connection)
  - `SECRET_KEY` (JWT signing key)
  - `ALGORITHM` and `ACCESS_TOKEN_EXPIRE_MINUTES` (token configuration)
  - `EMAIL_USER` and `EMAIL_PASS` (SMTP)
  - `SUPABASE_URL` and `SUPABASE_KEY` (Supabase client connection)
- **Location**: `.env` (not versioned), loaded via `python-dotenv`

**User Registration Implementation:**

In `user_registration.py`, sensitive database credentials such as `SUPABASE_URL` and `SUPABASE_KEY` are securely loaded from the `.env` file using `python-dotenv`. These values are never exposed in the codebase or version control.

```python
# user_registration.py
load_dotenv()
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)
```

### ✅ 8. HTTPS Communication
- **Implemented**: The FastAPI API communicates with **Supabase** through HTTPS connections.
- **Features**:
  - **Supabase** automatically provides HTTPS URLs for all PostgreSQL database connections
  - Client-Supabase communication is encrypted end-to-end using TLS 1.2+
  - SSL certificates automatically managed by Supabase
- **Evidence**: 
  - `DATABASE_URL` in format `postgresql://[user]:[password]@[host].supabase.co:5432/postgres`
  - Supabase enforces SSL/TLS usage on all production connections
- **Production note**: When deploying the FastAPI API, HTTPS must be configured on the server (Nginx, Caddy, or platforms like Railway, Render, AWS)

## 📊 Compliance Summary

| Criterion | Status | Implementation | Notes |
|-----------|--------|----------------|-------|
| Password hashing | ✅ | Argon2 | Implemented in `auth.py`, `password_recovery.py`, and `user_registration.py` |
| Password validation | ✅ | Regex | Minimum 8 characters, uppercase, number, and special character. Enforced in `user_registration.py` for new accounts |
| JWT authentication | ✅ | HS256 | Secret key in `.env` |
| Brute force protection | ✅ | Temporary lockout | 15 minutes after 3 failed attempts |
| Token invalidation | ✅ | Blacklist | In-memory (improvable with Redis) |
| Secure links | ✅ | UUID + expiration | 1-hour validity, single use |
| Environment variables | ✅ | python-dotenv | Protected credentials. `SUPABASE_URL` and `SUPABASE_KEY` securely loaded |
| **HTTPS** | ✅ | **Supabase SSL/TLS** | **Encrypted database, API requires HTTPS in production** |
