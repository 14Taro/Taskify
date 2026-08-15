from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
import jwt

from app.database import get_db
from app.models import User
from app import schemas, security
from app.config import settings

router = APIRouter(prefix="/api/v1/auth", tags=["Auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

@router.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El correo electrónico ya está registrado."
        )
    
    hashed_pwd = security.hash_password(user_data.password)
    new_user = User(email=user_data.email, alias=user_data.alias, password_hash=hashed_pwd)
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas o usuario no encontrado."
        )
        
    ahora = datetime.now(timezone.utc)
    # Si la cuenta ya está bloqueada y todavía no pasó el tiempo
    if user.lockout_until and user.lockout_until > ahora:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tu cuenta está bloqueada por 24 horas. Intenta más tarde."
        )

    # Si la contraseña es incorrecta
    if not security.verify_password(form_data.password, user.password_hash):
        user.failed_login_attempts += 1
        
        # Bloqueo en el quinto fallo
        if user.failed_login_attempts >= 5:
            user.lockout_until = ahora + timedelta(hours=24)
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Has fallado 5 veces. Tu cuenta ha sido bloqueada por 24 horas por seguridad."
            )
            
        db.commit()
        
        # Mensajes personalizados según intentos restantes
        intentos_restantes = 5 - user.failed_login_attempts
        if intentos_restantes == 1:
            mensaje = "Credenciales incorrectas. ¡ATENCIÓN! Te queda 1 solo intento antes de que tu cuenta se bloquee por 24 horas."
        else:
            mensaje = f"Credenciales incorrectas. Te quedan {intentos_restantes} intentos."
            
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=mensaje
        )
    
    # Contraseña correcta -> Reinicio de seguridad
    user.failed_login_attempts = 0
    user.lockout_until = None
    db.commit()

    token = security.create_access_token(data={"sub": str(user.id), "email": user.email})
    return {"access_token": token, "token_type": "bearer"}

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido o expirado.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
        
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
    return user

@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user