# Consulta de Información Detallada de Plaza
Este módulo permite consultar la información detallada de las plazas de mercado registradas en el sistema.
Incluye dos funcionalidades principales:

* Visualización de todas las plazas.
* Consulta detallada de una plaza específica por su nombre.

### Dependencias necesarias
* Python 3.11.9
* FastAPI
* SQLAlchemy

## 📋 Criterio de Aceptación 1: Visualizar información de una plaza
Objetivo:
Permitir al usuario acceder a la información detallada de una plaza al seleccionarla por su nombre.

Pasos para verificar:
1. Iniciar el servidor:
uvicorn main:app --reload

2. Abrir la documentación interactiva en el navegador:
👉 http://127.0.0.1:8000/docs

3. Localizar el endpoint:
GET /plazas/nombre/{nombre}

4. En el campo {nombre}, escribir por ejemplo:
Central Mayorista De Antioquia

5. Ejecutar la solicitud.

### Resultado esperado:
El sistema devuelve un objeto JSON con los campos:
* nombre
* plaza_id
* ciudad
* direccion
* estado
* numero_comerciantes
* tipos_productos
* horarios
* datos_contacto
* fecha_creacion
* fecha_actualizacion
* coordenadas: un objeto con formato:
"coordenadas": {
  "lat": 6.1868153,
  "lon": -75.5914233
}

## 📋 Criterio de Aceptación 2: Mostrar ubicación en mapa
Objetivo:
El sistema debe proporcionar información suficiente para que el frontend muestre la ubicación de la plaza en un mapa interactivo (por ejemplo, con Google Maps).

Verificación desde el backend:
1. En la respuesta del endpoint /plazas/nombre/{nombre}, verificar que el campo coordenadas esté presente y tenga el formato:
"coordenadas": {
  "lat": valor_latitud,
  "lon": valor_longitud
}

2. Copiar los valores de latitud y longitud y probarlos manualmente en el navegador:
https://www.google.com/maps?q=lat,lon

3. Si la ubicación corresponde correctamente a la plaza consultada, el criterio se cumple.

## 📋 Criterio adicional: Obtener todas las plazas
Objetivo:
Permitir listar todas las plazas registradas en la base de datos con sus coordenadas normalizadas.

Pasos para verificar:
1. En la misma documentación (/docs), ubicar el endpoint:
GET /plazas/

2. Ejecutar la solicitud.

Resultado esperado: 
* Devuelve una lista JSON con todas las plazas registradas.
* Cada elemento incluye sus datos y las coordenadas normalizadas en el mismo formato que el criterio 1.

### Notas
* Las coordenadas se normalizan automáticamente para uso en Google Maps (latitud positiva y longitud negativa para el hemisferio occidental).

* El backend no muestra el mapa, solo provee los datos necesarios para que el frontend lo renderice.