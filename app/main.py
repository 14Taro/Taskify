from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database import engine, Base, get_db
from app.routers import auth, tasks

# Crear tablas automáticamente en PostgreSQL
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Taskify API",
    description="API RESTful para la gestión de tareas personales multi-dispositivo",
    version="1.0.0",
    redirect_slashes=False  # Evita redirecciones 307 que pueden perder cabeceras CORS
)

# Configuración explícita de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Registrar Routers
app.include_router(auth.router)
app.include_router(tasks.router)

@app.get("/", tags=["Health"])
def root():
    return {"message": "Taskify API running smoothly!"}

@app.get("/health", tags=["Health"])
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": str(e)}