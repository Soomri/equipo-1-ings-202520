# Instrucciones para probar F-22 CRUD Gestión de plazas

Este servicio expone endpoints REST para gestionar la información de las plazas de mercado.
Las operaciones están protegidas mediante autenticación JWT y solo los administradores pueden crear, editar o eliminar registros.

## Requisitos previos
1. Tener instalado Python 3.11 (recomendado).

2. Tener configuradas las dependencias del proyecto:
pip install -r requirements.txt

3. Contar con el archivo .env en la carpeta server/ con las variables de entorno necesarias:
* DATABASE_URL
* SECRET_KEY
* ALGORITHM
* EMAIL_USER
* ACCESS_TOKEN_EXPIRE_MINUTES

4. Iniciar el servidor con:
uvicorn server.main:app --reload

El servicio se ejecutará en:
http://127.0.0.1:8000

## Autenticación
Antes de usar los endpoints protegidos, se debe iniciar sesión con las credenciales del administrador.

Endpoint de login:
> POST /auth/login

Cuerpo de la solicitud:
{
"email": "plazeserviceuser@gmail.com
",
"password": "la_contraseña_correcta"
}

Respuesta exitosa:
{
"access_token": "<token_jwt>",
"token_type": "bearer"
}

Copia el valor de access_token y en Swagger haz clic en el botón Authorize, luego ingrésalo.

* Solo este usuario administrador podrá crear, editar o eliminar plazas.

### Criterio de aceptación 1: Crear una plaza de mercado
Endpoint:
> POST /plazas/

Requiere token de administrador.

Cuerpo de ejemplo:
{
"nombre": "Plaza Central",
"direccion": "Cra 10 #20-30",
"ciudad": "Medellín",
"coordenadas": "4.6097,-74.0817",
"horarios": "Lunes a Domingo, 6:00 AM - 4:00 PM",
"numero_comerciantes": 120,
"tipos_productos": "Frutas, verduras, carnes, lácteos",
"datos_contacto": "contacto@plazacentral.com
"
}

Respuesta esperada:
{
"message": "Plaza creada exitosamente",
"plaza_id": 7
}

### Criterio de aceptación 2: Editar información de una plaza existente
Endpoint:
> PUT /plazas/{plaza_id}

Requiere token de administrador.

Ejemplo de solicitud:
PUT /plazas/7
{
"nombre": "Plaza Central Renovada",
"estado": "activa",
"numero_comerciantes": 130
}

Respuesta esperada:
{
"message": "Plaza actualizada exitosamente",
"plaza_id": 7
}

Solo los campos enviados serán modificados. Los demás permanecerán igual.

### Criterio de aceptación 3: Eliminar una plaza de mercado
Endpoint:
> DELETE /plazas/{plaza_id}

Requiere token de administrador.

Ejemplo:
DELETE /plazas/7

Respuesta esperada:
{
"message": "Plaza eliminada exitosamente",
"plaza_id": 7
}

Si la plaza tiene precios asociados en la tabla precios, estos se eliminarán automáticamente gracias a la relación en cascada.
