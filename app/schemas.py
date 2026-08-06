from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from app.models import PriorityEnum

# --- ESQUEMAS DE USUARIO ---
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# --- ESQUEMAS DE TAREAS ---
class TaskCreate(BaseModel):
    title: str
    priority: Optional[PriorityEnum] = PriorityEnum.MEDIA

class TaskResponse(BaseModel):
    id: int
    user_id: int
    title: str
    priority: PriorityEnum
    is_completed: bool
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True  