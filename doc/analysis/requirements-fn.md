# Requisitos Funcionales

## ✨ F-01 – Consulta de precios actuales por producto y ubicación

**📝 Descripción**  
El sistema permitirá a los usuarios consultar el precio actual por kilogramo de productos seleccionados, filtrando por ciudad y por plaza de mercado específica. Esta funcionalidad busca facilitar la toma de decisiones de compra informadas, ofreciendo precios actualizados según la ubicación.

**✅ Criterios de aceptación**

> **Scenario:** Mostrar precio actual de Tomate Chonto en Medellín  
> - **Given** que el usuario ha accedido al sistema  
> - **And** está en la vista de consulta de precios  
> - **When** realiza la búsqueda del producto *"Tomate Chonto"*  
> - **And** elige la ciudad *"Medellín"*  
> - **And** selecciona la plaza *"Plaza Minorista"*  
> - **Then** el sistema mostrará el precio actual por kilogramo del producto  
> - **And** se indicará la fecha de la última actualización del precio

> **Scenario:** Producto no encontrado   
> - **Given** que el usuario está en la vista de consulta de precios
> - **And** ha ingresado el nombre de un producto
> - **When** el sistema no encuentra coincidencias en la base de datos   
> - **Then**  muestra el mensaje "No se encontraron resultados para su búsqueda"
> - **And** ofrece la opción de realizar una nueva búsqueda

> **📌 Prioridad:**  
> P0

> **Puntos:** 
2
---

## 📊 F-02 – Visualización de la variación histórica de precios


**📝 Descripción**  
El sistema mostrará cómo ha cambiado el precio de cada producto a lo largo del tiempo. Se presentarán gráficos o tablas que evidencien las tendencias de aumento, disminución o estabilidad del precio, permitiendo al usuario analizar comportamientos pasados.


**✅ Criterios de aceptación**

> **Scenario:** Visualizar gráfico histórico de precios de Papa Criolla  
> - **Given** que el usuario ha accedido al sistema  
> - **And** ha consultado el producto *"Papa Criolla"*  
> - **When** hace clic en *"Ver historial de precios"*  
> - **Then** el sistema mostrará un gráfico o tabla con la evolución del precio por kilogramo durante el último año  
> - **And** se indicarán claramente los periodos de aumento, disminución o estabilidad


> **📌 Prioridad:**  
> P0

> **Puntos:** 
2
---

## 🔮 F-03 – Predicción de precios futuros


**📝 Descripción**  
El sistema utilizará modelos de aprendizaje automático entrenados con datos históricos para generar predicciones de precios de los productos. Esto permitirá a los usuarios anticiparse a posibles aumentos o disminuciones de precios en los próximos meses.


**✅ Criterios de aceptación**

> **Scenario:** Mostrar predicción de precio para Aguacate Hass  
> - **Given** que el usuario ha accedido al sistema  
> - **And** ha seleccionado el producto *"Aguacate Hass"*  
> - **When** hace clic en *"Ver predicción de precios"*  
> - **Then** el sistema mostrará una estimación del precio por kilogramo para los próximos meses  
> - **And** se indicará el nivel de confianza de la predicción


> **📌 Prioridad:**  
> P0

> **Puntos:** 
3
---

## ⚖️ F-04 – Comparación de precios entre plazas de mercado


**📝 Descripción**  
El sistema permitirá comparar el precio de un mismo producto entre varias plazas de mercado dentro de una misma ciudad, ayudando al usuario a identificar la plaza más económica para hacer su compra.


**✅ Criterios de aceptación**

> **Scenario:** Comparar precio de Cebolla Cabezona en Medellín  
> - **Given** que el usuario ha accedido al sistema  
> - **And** ha seleccionado el producto *"Cebolla Cabezona"*  
> - **When** elige la ciudad *"Medellín"*  
> - **Then** el sistema mostrará los precios por kilogramo en todas las plazas de mercado disponibles en esa ciudad  
> - **And** ordenará la información de menor a mayor precio


> **📌 Prioridad:**  
> P1

> **Puntos:** 
1
---

## 🔐 F-05 – Registro de usuarios 


**📝 Descripción**  
El sistema permitirá a los usuarios registrarse mediante nombre, correo electrónico y contraseña, validando que la información cumpla con los requisitos establecidos. Una vez registrado, el usuario podrá acceder a las funcionalidades del sistema según su rol.


**✅ Criterios de aceptación**

> **Scenario:** Registrar un nuevo usuario con correo electrónico  
> - **Given** que el usuario accede a la pantalla de registro  
> - **When** el usuario ingresa nombre, correo y contraseña válidos  
> - **Then** el sistema crea una nueva cuenta y muestra un mensaje de bienvenida  

> **Scenario:** Validar correo existente en el registro  
> - **Given** que el usuario ingresa un correo que ya está registrado  
> - **When** intenta completar el registro  
> - **Then** el sistema muestra un mensaje indicando que el correo ya está en uso  

> **Scenario:** Validar formato de contraseña  
> - **Given** que el usuario ingresa una contraseña  
> - **When** la contraseña no cumple con los requisitos mínimos  
> - **Then** el sistema muestra un mensaje indicando las reglas de seguridad  


> **📌 Prioridad:**  
> P0

> **Puntos:** 
3
---

## 🔑 F-06 – Inicio de sesión


**📝 Descripción**  
El sistema permitirá a los usuarios iniciar sesión en su cuenta mediante correo electrónico y contraseña válidos. Contará con mecanismos de seguridad para bloqueo temporal por múltiples intentos fallidos y ofrecerá la opción de recuperación de contraseña a través de correo electrónico.  

**✅ Criterios de aceptación**  

> **Scenario:** Iniciar sesión con credenciales válidas  
> - **Given** que el usuario está en la pantalla de inicio de sesión  
> - **When** ingresa su correo y contraseña correctos  
> - **Then** el sistema permite el acceso a su cuenta  

> **Scenario:** Bloqueo por múltiples intentos fallidos  
> - **Given** que el usuario ingresa una contraseña incorrecta tres veces seguidas  
> - **When** intenta iniciar sesión nuevamente  
> - **Then** el sistema bloquea temporalmente la cuenta y envía un correo de recuperación  

> **Scenario:** Recuperación de contraseña  
> - **Given** que el usuario olvidó su contraseña  
> - **When** solicita recuperación  
> - **Then** el sistema envía un enlace de restablecimiento al correo registrado  

> **📌 Prioridad:** 
P0  

> **Puntos:** 
5
---

## 🍎 F-07 – Creación y cálculo del valor mensual de la canasta personalizada

**📝 Descripción**  
El sistema permitirá a los usuarios crear canastas personalizadas con diferentes alimentos y cantidades definidas, asignándoles un nombre para su identificación. Adicionalmente, el sistema calculará el valor total mensual de la canasta con base en los precios actualizados de cada alimento en el mes seleccionado, permitiendo una estimación precisa de gastos.  

**✅ Criterios de aceptación**  

> **Scenario:** Crear canasta personalizada  
> - **Given** que el usuario ha iniciado sesión  
> - **When** el usuario selecciona varios alimentos y sus cantidades  
> - **Then** el sistema guarda la canasta con un nombre definido por el usuario  

> **Scenario:** Calcular valor mensual de la canasta  
> - **Given** que el usuario tiene una canasta personalizada guardada  
> - **When** el usuario solicita el valor total mensual  
> - **Then** el sistema calcula el precio sumando el valor actual de cada alimento en el mes seleccionado  

> **📌 Prioridad:** 
P2  

> **Puntos:** 
5
---

## 🛠️ F-08 – Gestión de perfil de usuario

**📝 Descripción**  
El sistema permitirá a los usuarios autenticados modificar sus datos personales y cambiar su contraseña, garantizando que la información actualizada se almacene correctamente y que los cambios de contraseña sean confirmados por correo electrónico como medida de seguridad.  

**✅ Criterios de aceptación**  

> **Scenario:** Editar información personal  
> - **Given** que el usuario ha iniciado sesión  
> - **When** modifica su nombre u otra información básica del perfil 
> - **Then** el sistema guarda los cambios y confirma la actualización  

> **Scenario:** Cambiar contraseña  
> - **Given** que el usuario está autenticado  
> - **When** solicita cambiar su contraseña e ingresa la actual y la nueva  
> - **Then** el sistema actualiza la contraseña y envía confirmación al correo  

> **📌 Prioridad:** 
P1  

> **Puntos:** 
2
---

## 📂 F-09 – Administración de datos de precios

**📝 Descripción**  
El sistema permitirá a los administradores gestionar la información de precios de los alimentos, incluyendo la carga de datos desde archivos, la edición manual de precios y la eliminación de registros incorrectos. Estas acciones garantizarán que la información disponible para los usuarios sea precisa y actualizada.  

**✅ Criterios de aceptación**  

> **Scenario:** Cargar datos de precios manualmente  
> - **Given** que el administrador ha iniciado sesión  
> - **When** carga un archivo con datos de precios  
> - **Then** el sistema valida el formato y actualiza la base de datos  

> **Scenario:** Editar precio de un alimento  
> - **Given** que el administrador está en el panel de gestión  
> - **When** selecciona un alimento y modifica su precio  
> - **Then** el sistema guarda los cambios y registra la fecha de actualización  

> **Scenario:** Eliminar registro de precio erróneo  
> - **Given** que el administrador detecta un dato incorrecto  
> - **When** solicita eliminarlo  
> - **Then** el sistema lo elimina y actualiza las consultas de precios  

> **📌 Prioridad:** 
P2  

> **Puntos:** 
5
---

## 📈 F-10 – Evolución histórica y predicción del valor de la canasta personalizada

**📝 Descripción**  
El sistema permitirá a los usuarios visualizar la evolución del valor mensual de su canasta personalizada en un rango de tiempo definido, así como obtener una predicción estimada de su valor en meses futuros, apoyándose en datos históricos y modelos de proyección.  

**✅ Criterios de aceptación**  

> **Scenario:** Mostrar evolución del valor mensual de la canasta  
> - **Given** que el usuario tiene una canasta personalizada  
> - **When** el usuario selecciona un rango de meses  
> - **Then** el sistema muestra cómo ha variado el valor total de la canasta por mes  

> **Scenario:** Predecir valor mensual futuro de la canasta  
> - **Given** que el usuario tiene una canasta personalizada  
> - **When** el usuario solicita la predicción  
> - **Then** el sistema muestra el valor estimado de la canasta para meses futuros  

> **📌 Prioridad:** 
P3  

> **Puntos:** 
5
---

## 🔍 F-11 – Búsqueda rápida de productos

**📝 Descripción**  
El sistema permitirá a los usuarios encontrar rápidamente un producto escribiendo su nombre en un buscador, evitando la navegación manual por múltiples menús o categorías.

**✅ Criterios de aceptación**  

> **Scenario:** Buscar producto
> - **Given** que el usuario escribe el nombre del producto en el buscador
> - **When** presiona "Enter"
> - **Then** el sistema muestra los resultados relacionados con el término ingresado

> **📌 Prioridad:** 
P2

> **Puntos:** 
1
---

## 💡 F-12 – Sugerencias de búsqueda

**📝 Descripción**  
El sistema mostrará sugerencias automáticas mientras el usuario escribe en el campo de búsqueda, agilizando la localización de productos y reduciendo errores tipográficos.

**✅ Criterios de aceptación**  

> **Scenario:** Mostrar sugerencias al escribir
> - **Given** que el usuario comienza a escribir en el buscador
> - **When** el sistema detecta coincidencias parciales
> - **Then** muestra una lista de sugerencias relacionadas que el usuario puede seleccionar

> **📌 Prioridad:** 
P2

> **Puntos:** 
3
---

## 🚪 F-13 – Acceso sin registro

**📝 Descripción**  
El sistema permitirá que ciertos módulos sean accesibles sin necesidad de crear una cuenta, para facilitar el uso inmediato por parte de nuevos usuarios.

**✅ Criterios de aceptación**  

> **Scenario:** Consultar datos sin estar registrado
> - **Given** que el usuario no ha iniciado sesión
> - **When** accede a un módulo público (ej. consulta de precios generales)
> - **Then** el sistema muestra la información disponible sin solicitar registro

**📌 Módulos públicos permitidos sin registro**  
- Consulta de precios generales (sin filtros personalizados)  
- Predicciones generales
- Información corporativa, de contacto y soporte básico  
- Documentación pública y sección de ayuda/FAQ  

**📌 Restricciones adicionales**  
- El límite de **10 consultas mensuales** se aplicará por dirección IP y/o identificador temporal del navegador.  
- Al superar el límite, el sistema mostrará un mensaje invitando a registrarse para continuar con el acceso ilimitado.  

> **📌 Prioridad:** 
P2

> **Puntos:** 
3
---

## 📊 F-14 – Panel de resumen rápido

**📝 Descripción**  
El sistema mostrará un panel con los productos que más han subido o bajado de precio en un periodo determinado, permitiendo identificar variaciones significativas de forma inmediata.

**✅ Criterios de aceptación**  

> **Scenario:** Mostrar top de variaciones
> - **Given** que el usuario ingresa al panel de resumen
> - **When** el sistema procesa los datos del periodo seleccionado
> - **Then** muestra una lista con los 5 productos con mayor subida y los 5 con mayor bajada

> **📌 Prioridad:** 
P3

> **Puntos:** 
3
---

## 🗂️ F-15 – Filtrado por categoría de producto

**📝 Descripción**  
El sistema permitirá filtrar la búsqueda de productos por categorías como “Verduras”, “Frutas” o “Cárnicos”, ayudando a enfocar la consulta en un tipo de alimento específico.

**✅ Criterios de aceptación**  

> **Scenario:** Filtrar por categoría
> - **Given** que el usuario está en la pantalla de búsqueda
> - **When** selecciona una categoría como "Verduras"
> - **Then** el sistema muestra únicamente los productos pertenecientes a esa categoría

> **📌 Prioridad:** 
P3

> **Puntos:** 
1
---

## ✅ F-16 – Lista de compras (Checklist)

**📝 Descripción**  
El sistema permitirá al usuario crear y gestionar una lista de compras con los productos seleccionados, pudiendo marcar aquellos que ya han sido adquiridos.

**✅ Criterios de aceptación**  

> **Scenario:** Crear y actualizar checklist
> - **Given** que el usuario está en la sección de checklist
> - **When** añade, elimina o marca productos
> - **Then** el sistema guarda y muestra los cambios en tiempo real

> **📌 Prioridad:** 
P4

> **Puntos:** 
2
---

## ♿ F-17 – Modo de alto contraste y tipografía adaptable

**📝 Descripción**
El sistema contará con un modo que permita a los usuarios con discapacidades visuales, como baja visión, daltonismo o ceguera parcial, ajustar el contraste de la interfaz y el tamaño de la tipografía. Esto mejorará la legibilidad y la experiencia visual.

**✅ Criterios de aceptación**
**Scenario:** Activar opciones de alto contraste y tipografía

- **Given** que el usuario ingresa a la configuración de accesibilidad  
- **When** ajusta las opciones de alto contraste o el tamaño del texto  
- **Then** la interfaz adapta los elementos visuales, aplicando:  
  - Modo de alto contraste (por ejemplo, esquemas de color blanco y negro o alto contraste personalizado).  
  - Ajuste del tamaño de la fuente para aumentar la legibilidad.  
  - Resaltado de los elementos de interacción para mejorar el foco visual.  

**📌 Alcance de accesibilidad**
- Discapacidades visuales: baja visión, daltonismo, ceguera parcial o total.  
- Discapacidades cognitivas leves: dificultad para procesar información visual rápidamente.  

**📌 Prioridad**
P4 

> **Puntos:** 
2
---

## ♿ F-18 – Navegación asistida por teclado 

**📝 Descripción**
El sistema debe permitir la navegación completa a través del teclado para usuarios con discapacidades motoras o visuales. Esto garantiza que puedan interactuar con la interfaz sin necesidad de un mouse y que el sistema sea compatible con tecnologías asistivas, como lectores de pantalla.

**✅ Criterios de aceptación**
**Scenario:** Navegar con el teclado y tecnologías asistivas

- **Given** que el usuario ha activado la navegación por teclado o está usando un lector de pantalla  
- **When** presiona la tecla Tab o Shift + Tab  
- **Then** el sistema permite navegar por todos los elementos interactivos de la interfaz de forma lógica y secuencial, incluyendo:  
  - Navegación por teclado (tecla Tab para avanzar, Shift + Tab para retroceder, Enter para seleccionar).  
   

**📌 Alcance de accesibilidad**
- Discapacidades motoras: limitación para usar mouse o gestos táctiles precisos.  
- Discapacidades visuales: baja visión, ceguera parcial o total.  

**📌 Prioridad**
P4 

> **Puntos:** 
2
---

## 💰 F-19 – Comparativa de precios con salario mínimo

**📝 Descripción**  
El sistema permitirá comparar el gasto estimado en un producto o canasta con el salario mínimo vigente, para visualizar su impacto en el presupuesto.

**✅ Criterios de aceptación**  

> **Scenario:** Calcular impacto en salario mínimo  
> - **Given** que el usuario consulta un producto o canasta  
> - **When** selecciona la opción "Comparar con salario mínimo"  
> - **Then** el sistema muestra el porcentaje del **salario mínimo mensual vigente** que representa el gasto, considerando la cifra actualizada oficialmente por el gobierno.

**📌 Consideraciones**  
- El salario mínimo se actualizará automáticamente cada año con base en la normativa oficial.  

> **📌 Prioridad:** 
P4

> **Puntos:** 
3
---

## 📜 F-20 – Historial de predicciones

**📝 Descripción**  
El sistema permitirá a los usuarios acceder a predicciones realizadas en el pasado, con su fecha y nivel de precisión, para evaluar la efectividad de los pronósticos.

**✅ Criterios de aceptación**  

> **Scenario:** Ver predicciones anteriores
> - **Given** que el usuario ingresa al módulo de predicciones
> - **When** selecciona la opción "Historial"
> - **Then** el sistema lista las predicciones anteriores con su fecha y precisión calculada

> **📌 Prioridad:** 
P4

> **Puntos:** 
3
---

## 📊 F-21 – Análisis por temporada del comportamiento de precios

**📝 Descripción**  
El sistema permitirá a los usuarios analizar el comportamiento histórico de los precios de un producto según la temporada del año, identificando tendencias estacionales que faciliten prever posibles alzas o bajas recurrentes en determinadas épocas.

**✅ Criterios de aceptación**  

> **Scenario:** Mostrar comportamiento estacional de un producto
> - **Given** que el usuario consulta un producto
> - **When** activa el filtro "Por temporada"
> - **Then** el sistema muestra un gráfico que refleja la variación de precios por mes, resaltando patrones recurrentes

> **📌 Prioridad:** 
P2

> **Puntos:** 
5
---

## 🏪 F-22 – Gestión de plazas de mercado (CRUD)

**📝 Descripción**
El sistema permitirá a los administradores crear, consultar, actualizar y eliminar plazas de mercado. Cada plaza contará con información básica como nombre, dirección, ciudad, coordenadas geográficas, estado (activa/inactiva) y horarios de funcionamiento.

**✅ Criterios de aceptación**

**Scenario:** Crear una nueva plaza de mercado
- **Given** que soy un administrador autenticado
- **When** registro una nueva plaza con datos válidos
- **Then** el sistema debe crear la plaza con estado "Activa" y confirmación exitosa

**Scenario:** Editar información de plaza existente
- **Given** que existe una plaza registrada llamada "Plaza Mayorista"
- **When** modifico sus horarios de funcionamiento
- **Then** el sistema actualiza los datos y muestra un mensaje de confirmación

**Scenario:** Eliminar plaza de mercado
- **Given** que existe una plaza activa llamada "Plaza Minorista"
- **When** selecciono la opción de eliminar
- **Then** el sistema elimina la plaza del listado y registra el evento en el historial

📌 Prioridad:
P0

Puntos:
2
---

## 🏬 F-23 – Consulta de información detallada de plaza

**📝 Descripción**
El sistema permitirá a los usuarios consultar la información detallada de cada plaza de mercado, incluyendo dirección completa, horarios de funcionamiento, número de comerciantes, tipos de productos disponibles y datos de contacto si están disponibles.

**✅ Criterios de aceptación**

**Scenario:** Visualizar información de una plaza
- **Given** que el usuario accede al listado de plazas
- **When** selecciona "Plaza Minorista"
- **Then** el sistema muestra dirección, horarios, comerciantes activos, productos y datos de contacto disponibles

**Scenario:** Mostrar ubicación en mapa
- **Given** que el usuario consulta la información de "Plaza Mayorista"
- **When** accede a la sección de ubicación
- **Then** el sistema despliega la ubicación geográfica en un mapa interactivo utilizando servicios de Google Maps

> **📌 Prioridad:**  
P1

> **Puntos:** 
1
---

## 🏷️ F-24 – Gestión de estado de plazas  

**📝 Descripción**  
El sistema permitirá a los administradores **activar o desactivar plazas de mercado** según su operatividad, evitando que aparezcan en búsquedas las plazas temporalmente cerradas o que ya no funcionan.  

**✅ Criterios de aceptación**  

> **Scenario:** Activar una plaza de mercado  
> - **Given** que soy un administrador autenticado  
> - **And** existe una plaza registrada en estado "Inactiva"  
> - **When** selecciono la opción *"Activar plaza"*  
> - **Then** el sistema cambia el estado de la plaza a **"Activa"**  
> - **And** la plaza vuelve a aparecer en las búsquedas y listados públicos  

> **Scenario:** Desactivar una plaza de mercado  
> - **Given** que soy un administrador autenticado  
> - **And** existe una plaza registrada en estado "Activa"  
> - **When** selecciono la opción *"Desactivar plaza"*  
> - **Then** el sistema cambia el estado de la plaza a **"Inactiva"**  
> - **And** la plaza deja de mostrarse en las búsquedas y listados públicos  

> **Scenario:** Validar plazas inactivas en búsquedas  
> - **Given** que un usuario realiza una búsqueda de plazas o consulta precios  
> - **When** existen plazas con estado **"Inactiva"**  
> - **Then** el sistema no mostrará dichas plazas en los resultados  

> **📌 Prioridad:**  
> P0  

> **Puntos:**  
> 1

---
## 🏪 F-25 - Historial de plazas de mercado 

**📝 Descripción**
El sistema mantendrá un registro histórico de todas las plazas de mercado que han existido en el sistema, incluyendo fechas de creación, modificación y desactivación, para mantener la trazabilidad de los datos históricos de precios.

**✅ Criterios de aceptación** 

> **Scenario:** Registrar creación de una plaza de mercado
> - **Given**  que un usuario crea una nueva plaza de mercado
> - **When** la plaza de mercado se guarda en el sistema
> - **Then** el sistema deberá registrar la fecha y hora de creación
> - **And** el sistema deberá registrar el usuario responsable de la creación

> **Scenario:** Registrar modificación de una plaza de mercado
> - **Given** que existe una plaza de mercado registrada
> - **And** un usuario edita uno o más de sus datos (excepto el estado)
> - **When** el cambio es guardado
> - **Then** el sistema deberá registrar la fecha y hora de la modificación
> - **And** el sistema deberá registrar el usuario responsable
> - **And** el sistema deberá registrar el valor anterior y el nuevo valor de cada campo modificado

> **Scenario:** Registrar cambio de estado de una plaza de mercado
> - **Given** que existe una plaza de mercado registrada
> - **And** un administrador cambia su estado (activa/inactiva) 
> - **When** el cambio de estado es guardado
> - **Then** el sistema deberá añadir el evento al historial de la plaza
> - **And** se deberá registrar fecha, hora y usuario que realizó el cambio

> **Scenario:** Consultar historial de una plaza de mercado
> - **Given** que existe una plaza de mercado con registros históricos
> - **When** un usuario autorizado consulta el historial de esa plaza
> - **Then** el sistema deberá mostrar todos los eventos en orden cronológico
> - **And** el historial deberá incluir creación, modificaciones y cambios de estado

> **Scenario:** Mantener trazabilidad de precios históricos
> - **Given** que existen registros de precios asociados a una plaza de mercado
> - **When** un usuario consulta dichos precios históricos
> - **Then** el sistema deberá mostrar la información de la plaza asociada
> - **And** deberá mantener la referencia incluso si la plaza está inactiva

> **Scenario:** Garantizar integridad del historial
> - **Given** que existe un registro en el historial de una plaza
> - **When** un usuario intenta eliminar o alterar el historial
> - **Then** el sistema no deberá permitirlo
> - **And** el historial deberá conservarse intacto para trazabilidad

> **📌 Prioridad:**  
> P4

> **Puntos:**  
> 2
---

## 🗂️ F-26 – Filtrado de búsqueda por plaza de mercado 

**📝 Descripción**
El sistema permitirá a los usuarios filtrar la búsqueda de productos por plaza de mercado específica, mostrando únicamente los precios y productos disponibles en la plaza seleccionada.

**✅ Criterios de aceptación** 

> **Scenario:** Filtrar productos en plaza seleccionada
> - **Given** soy un usuario en la página de consulta de precios
> - **When** selecciono "Plaza Mayorista" como filtro
> - **And** busco el producto "Tomate"
> - **Then** el sistema debe mostrar solo precios de tomate en "Plaza Mayorista"
> - **And** debe indicar el nombre de la plaza en los resultados

> **Scenario:** Búsqueda sin seleccionar plaza
> - **Given** estoy en la página de consulta de precios
> - **When** realizo una búsqueda de "Cebolla" sin aplicar ningún filtro de plaza
> - **Then** el sistema debe mostrar los precios de todas las plazas disponibles para "Cebolla"
> - **And** debe incluir el nombre de cada plaza junto al resultado

> **Scenario:** Persistencia del filtro seleccionado
> - **Given** he aplicado un filtro por "Plaza Mayorista"
> - **When** realizo una nueva búsqueda de "Fríjol"
> - **Then** el sistema debe mantener "Plaza Mayorista" como filtro activo
> - **And** mostrar únicamente resultados correspondientes a esa plaza

> **📌 Prioridad:**  
> P1

> **Puntos:**  
> 2