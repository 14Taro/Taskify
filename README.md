# 🚀 Taskify - API RESTful
Aplicación Web y API Backend para la gestión de tareas personales multi-dispositivo, desarrollada con Python y FastAPI.

## 🛠️ Stack Tecnológico
* Lenguaje: Python 3.13

* Framework Backend: FastAPI

* Base de Datos: PostgreSQL

* ORM: SQLAlchemy

* Seguridad y Autenticación: Passlib (Bcrypt) y PyJWT (Tokens JWT)

* Validación de Datos: Pydantic v2

* Contenedores: Docker y Docker Compose

* Frontend: HTML5, JavaScript (ES Modules) y Tailwind CSS

## ⚙️ Configuración e Instalación Local
### 1. Variables de Entorno (.env)
Crea un archivo llamado .env en la raíz del proyecto tomando como plantilla la siguiente estructura con tus credenciales locales:

* PORT=8000

* DB_USER=tu_usuario_postgres

* DB_PASSWORD=tu_contraseña_postgres

* DB_HOST=localhost

* DB_PORT=5432

* DB_NAME=taskify_db

* DATABASE_URL=postgresql://tu_usuario_postgres:tu_contraseña_postgres@localhost:5432/taskify_db

* SECRET_KEY=tu_clave_secreta_jwt_local

* ALGORITHM=HS256

* ACCESS_TOKEN_EXPIRE_MINUTES=1440

### 2. Levantar Base de Datos con Docker
Abre tu terminal y ejecuta:

    docker compose up -d

### 3. Entorno Virtual y Dependencias
Ejecuta los siguientes comandos en la terminal:

    python -m venv venv

    venv\Scripts\activate

    pip install -r requirements.txt

### 4. Ejecutar el Servidor Backend
Inicia el servidor en modo desarrollo:

    uvicorn app.main:app --reload

## 📌 Módulos e Historial de Tickets Implementados

### 🔹 [TICKET-01] Entorno Base, Base de Datos y Health Check
Configuración del contenedor de PostgreSQL mediante docker-compose.yml.

Manejo de variables de entorno mediante app/config.py.

Conexión ORM a la base de datos vía SQLAlchemy (app/database.py).

Endpoint de diagnóstico y salud del sistema: GET /health

### 🔹 [TICKET-02] Autenticación de Usuarios y Seguridad JWT
Modelo relacional User para la base de datos (app/models.py).

Encriptación y Hashing de contraseñas mediante bcrypt (app/security.py).

Generación y validación de tokens JWT para inicio de sesión seguro.

Endpoints desarrollados:

* POST /api/v1/auth/register : Registro de usuarios nuevos.

* POST /api/v1/auth/login : Autenticación y entrega de token access_token.

* GET /api/v1/auth/me : Consulta de información del usuario autenticado.

### 🔹 [TICKET-03] Modelo y API CRUD de Tareas con Prioridad y Purga Automática
Modelo relacional Task vinculado a User con claves foráneas (app/models.py).

Soporte para niveles de prioridad mediante Enums (ALTA, MEDIA, BAJA).

Lógica de purga automática para eliminar tareas completadas de más de 30 días.

Endpoints desarrollados:

* POST /api/v1/tasks : Creación de tareas asociadas al usuario autenticado.

* GET /api/v1/tasks : Listado exclusivo de tareas pendientes.

* PATCH /api/v1/tasks/{id}/complete : Marcado de tarea como completada y registro de fecha.

* GET /api/v1/tasks/history : Consulta de historial de tareas completadas (últimos 30 días).

### 🔹 [TICKET-04] Maquetado Base del Frontend y Estructura con Tailwind CSS
Estructura modular del frontend (index.html, CSS y JS modular).

Diseño responsive con Tailwind CSS para soporte mobile y desktop.

Interfaz con Vistas de Autenticación (Login/Registro) y Dashboard de Tareas.

Manejo de estados de sesión en cliente con localStorage.

### 🔹 [TICKET-05] Conexión Frontend-Backend, Gestión de Tareas en Vivo y Modo Oscuro
Integración completa entre la interfaz web y la API RESTful de FastAPI.

Envío dinámico de formularios de autenticación (Login y Registro) con almacenamiento de token JWT.

Gestión interactiva de tareas en tiempo real (creación con etiquetas de prioridad y marcado de completadas).

Soporte para Modo Oscuro y Modo Claro (Dark/Light mode) con persistencia de preferencia en localStorage

## 🌐 Documentación Interactiva de la API
Con el servidor en ejecución, la documentación interactiva OpenAPI está disponible en el navegador en:

    Swagger UI: http://localhost:8000/docs

# 🚀 Actualización v1.0.1: Mejoras de UX y Seguridad

Esta actualización se centró en mejorar significativamente la experiencia del usuario (UX) mediante transiciones más fluidas y personalización, además de blindar la API contra ataques de fuerza bruta. El desarrollo se gestionó mediante 5 tickets incrementales.

### 📋 Registro de Tickets (Sprints Completados)

#### ✅ Ticket 1.1: [Frontend] Persistencia de Email ("Recordar Usuario")
* **Descripción:** Implementación de un checkbox en el login para recordar el correo del usuario utilizando `localStorage`, agilizando futuros inicios de sesión.
* **Impacto:** Modificación de `index.html` y `auth.js` para lectura/escritura de credenciales locales.

#### ✅ Ticket 1.2: [Frontend/UX] Eliminación de Parpadeo Visual (Flicker) al Refrescar
* **Descripción:** Corrección del ciclo de renderizado. Ahora las secciones inician ocultas por defecto y un *Global Loader* (spinner) cubre la pantalla mientras se verifica la validez del JWT, evitando que el usuario vea la pantalla de login por fracciones de segundo.
* **Impacto:** Modificación estructural en `index.html` (clases `hidden` y contenedor z-index) y lógica de inicialización en `main.js`.

#### ✅ Ticket 1.3: [Fullstack] Filtro y Agrupación por Prioridad de Tareas
* **Descripción:** Capacidad de ordenar y filtrar tareas visualmente según su urgencia (ALTA, MEDIA, BAJA).
* **Backend:** Implementación de `case` en SQLAlchemy (`tasks.py`) para ordenar la respuesta JSON de forma jerárquica desde la base de datos.
* **Frontend:** Creación de un menú `<select>` en el Dashboard y lógica en `tasks.js` para filtrar dinámicamente el array local en memoria sin recargar la página.

#### ✅ Ticket 1.4: [Fullstack] Alias de Usuario Personalizado
* **Descripción:** Inclusión de un nombre de usuario / alias para personalizar el saludo en el Dashboard, reemplazando el uso del correo electrónico crudo.
* **Backend:** Nueva columna `alias` en la tabla `users` (PostgreSQL), y actualización de Pydantic schemas para exigir el dato en el registro.
* **Frontend:** Refactorización del formulario de registro y actualización del Header del Dashboard. Centralización de peticiones mediante exportación dinámica de `API_BASE_URL`.

#### ✅ Ticket 1.5: [Backend] Prevención de Fuerza Bruta (Rate Limiting)
* **Descripción:** Sistema de seguridad de base de datos para prevenir intentos ilimitados de inicio de sesión.
* **Lógica implementada:** * Se añadieron las columnas `failed_login_attempts` y `lockout_until` en la base de datos.
  * Al errar la contraseña, el servidor retorna los intentos restantes (Ej: *"¡ATENCIÓN! Te queda 1 solo intento..."*).
  * Al fallar 5 veces, el sistema bloquea al usuario por 24 horas respondiendo con código `HTTP 403 Forbidden`.
* **Impacto:** Modificaciones directas en `models.py` y `auth.py`.