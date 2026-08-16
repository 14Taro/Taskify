from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from typing import List

from app.database import get_db
from app.models import Task, User
from app import schemas
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api/v1/tasks", tags=["Tasks"])

# 1. Crear una nueva tarea
@router.post("", response_model=schemas.TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    task_data: schemas.TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_task = Task(
        title=task_data.title,
        priority=task_data.priority,
        user_id=current_user.id
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

# 2. Obtener tareas PENDIENTES del usuario actual
@router.get("", response_model=List[schemas.TaskResponse])
def get_pending_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # SOLUCIÓN: Quitamos el 'case' problemático de PostgreSQL. Solo traemos las tareas ordenadas por fecha.
    tasks = db.query(Task).filter(
        Task.user_id == current_user.id,
        Task.is_completed == False
    ).order_by(Task.created_at.desc()).all()
    
    return tasks

# 3. Marcar tarea como COMPLETADA
@router.patch("/{task_id}/complete", response_model=schemas.TaskResponse)
def complete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == current_user.id
    ).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tarea no encontrada."
        )

    task.is_completed = True
    task.completed_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(task)
    return task

# 4. Consultar HISTORIAL
@router.get("/history", response_model=List[schemas.TaskResponse])
def get_task_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    limite_30_dias = datetime.now(timezone.utc) - timedelta(days=30)

    db.query(Task).filter(
        Task.user_id == current_user.id,
        Task.is_completed == True,
        Task.completed_at < limite_30_dias
    ).delete(synchronize_session=False)
    db.commit()

    history_tasks = db.query(Task).filter(
        Task.user_id == current_user.id,
        Task.is_completed == True,
        Task.completed_at >= limite_30_dias
    ).order_by(Task.completed_at.desc()).all()

    return history_tasks