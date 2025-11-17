# Decisiones Backend 

## 🌐 Frameworks Backend considerados

### 🏃🏽 FastAPI (Python)

Framework moderno y ligero de alto rendimiento para Python, diseñado específicamente para crear APIs rápidas y eficientes, con tipado automático y documentación interactiva. Es creciente en proyectos de análisis y machine learning.

> Ventajas
-  **Sintaxis sencilla**, muy rápido de aprender.
- **Compatibilidad nativa** con librerías como pandas, numpy, TensorFlow y librerías de predicción como scikit-learn, esto es ideal para exponer modelos de Machine learning en endpoints REST.
- **Altamente eficiente**, ya que es uno de los frameworks más rápidos para Python, porque usa ASGI, que da soporte a la programación asíncrona y maneja eficientemente aplicaciones con alta concurrencia. 
- **Genera automáticamente documentación**, puede ser en OpenAPI o Swagger.
- Soporte completo para **type hints** de Python, reduciendo errores.
- **Validación de datos** de entrada y salida automática.
- Muy **flexible** para trabajar con bases SQL (PostgreSQL, SQLAlchemy) o NoSQL (MongoDB).

> Desventajas
- **Menor cantidad de recursos y plugins comparado con Django**.
- Requiere entendimiento de **conceptos async/await**.
- Necesita **integración con ORMs** (Mapeo Objeto-Relacional).
- Hay que **configurar autenticación, admin, etc. por separado**.

---
### 🐍 Django (Python)

Framework backend completo de alto nivel, basado en el patrón MTV (Model-Template-View). Usado mucho en aplicaciones que requieren manejo de bases de datos, autenticación, seguridad y panel de administración. También sigue el principio "batteries included", proporcionando una solución completa para desarrollo web.

> Ventajas
- **Protección integrada contra ataques comunes**, como SQL Injection, XSS y CSRF
- Incluye **ORM propio**, fácil de usar con bases SQL como Postgres y MySQL.
- **Documentación muy completa y comunidad grande**.
- Tiene **admin panel integrado**, para la gestión de datos.
- **Compatible con librerías de ciencia de datos**.

> Desventajas
- Puede ser **excesivo para APIs simples**. Puede sentirse pesado para proyectos pequeños o muy livianos.
- **Estructura más rígida**, siguiendo convenciones estrictas.
- **Menor rendimiento** comparado con FastAPI para APIs puras.
- Curva de aprendizaje un poco alta al inicio, ya que hay **muchos conceptos y patrones por aprender**.

---
### 🚅 Express.js (Node.js)

Framework web minimalista y flexible para Node.js, ampliamente utilizado para crear APIs REST y aplicaciones web, en general, para proyectos que necesitan escalabilidad en tiempo real.

> Ventajas
- Rápido y ligero, **posee mucha flexibilidad altamente configurable y personalizable**.
- Acceso a **gran cantidad de paquetes y librerías** (NPM).
- Puede **combinarse con bases NoSQL y SQL**.
- **Manejo natural de JSON**.
- Muy usado en la industria, lo que asegura **soporte y recursos de aprendizaje**.
- Ideal cuando se realiza **frontend en React/Angular/Vue**.

> Desventajas
- **Requiere configurar muchos aspectos manualmente**.
- Es **menos amigable para integrar modelos de ciencia de datos**, tiene limitadas opciones para ML/análisis estadístico.
- Tiene **tipado débil**, JavaScript no tipado puede generar errores en runtime
- **No trae un ORM oficial**.
- La **seguridad no es tan robusta por defecto**, depende de configuraciones adicionales.

---
### 🌼 Spring Boot (Java)

Framework que simplifica el desarrollo de aplicaciones Java, proporcionando configuración automática y un enfoque de convención sobre configuración.

> Ventajas
- Gran cantidad de **librerías y herramientas**.
- Excelente para **sistemas de gran escala**.
- **Documentación extensa**.
- **Buen rendimiento y optimización**.

> Desventajas
- **Alta curva de aprendizaje**.
- **Código más extenso** comparado con otros frameworks.
- Puede requerir **mucha configuración inicial**.
- **Menos integrado con ciencia de datos**, tiene limitadas opciones nativas para Machine learning.
  
## 🎯 Framework Seleccionado: **FastAPI (Python)**  

### ✅ Justificación  
Después de comparar diferentes frameworks (FastAPI, Django, Express.js y Spring Boot), se selecciona **FastAPI** por las siguientes razones:  

1. **Alto rendimiento y concurrencia** gracias a su arquitectura asíncrona (ASGI).  
2. **Integración nativa con librerías de ciencia de datos y machine learning** (Pandas, NumPy, Scikit-learn, TensorFlow), lo cual facilita exponer modelos predictivos como APIs REST.  
3. **Documentación automática (Swagger/OpenAPI)** que acelera el desarrollo, las pruebas y la integración con frontend.  
4. **Tipado fuerte y validación automática de datos**, lo que mejora la confiabilidad del sistema.  
5. **Sintaxis sencilla y curva de aprendizaje moderada**, permitiendo incorporar nuevos desarrolladores rápidamente.  
6. **Flexibilidad en el manejo de bases de datos** (SQL y NoSQL).  

### ⚖️ Alternativas descartadas  
- **Django**: robusto, pero excesivo y menos eficiente para APIs puras.  
- **Express.js**: flexible y popular, pero con poca integración con ML y mayor trabajo en seguridad.  
- **Spring Boot**: muy potente en sistemas empresariales, pero con curva de aprendizaje alta y poco orientado a ciencia de datos.  

### 🚀 Conclusión  
**FastAPI es la mejor opción** porque combina:  
- Rendimiento y escalabilidad  
- Compatibilidad con análisis avanzado y ML  
- Documentación automática  
- Desarrollo ágil y mantenible  

El único reto identificado es la configuración manual de algunos módulos (ej. autenticación), pero se considera manejable frente a las ventajas que aporta.  
