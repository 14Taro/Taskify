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