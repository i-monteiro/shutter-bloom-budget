from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import datetime, timedelta
from app.core.database import get_db
from app.models.models import User, RefreshToken
from app.schemas.user import UserCreate, UserLogin, TokenResponse
from app.auth.auth_handler import create_access_token, get_current_user
from app.auth.token_utils import verify_token
import uuid
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configurações de tokens
ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_DAYS = 7

# Validação de senha
def validate_password(password: str) -> bool:
    """Valida que a senha tenha pelo menos 8 caracteres, incluindo letras e números"""
    if len(password) < 8:
        return False
    if not any(c.isalpha() for c in password):
        return False
    if not any(c.isdigit() for c in password):
        return False
    return True

# Cadastro de usuário
@router.post("/users/", status_code=201)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # Validar email único
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    
    # Validar senha
    if not validate_password(user.password):
        raise HTTPException(
            status_code=400, 
            detail="Senha deve ter pelo menos 8 caracteres, incluindo letras e números"
        )
    
    # Hash da senha com bcrypt
    hashed_password = pwd_context.hash(user.password)
    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"id": new_user.id, "email": new_user.email}

# Gerar refresh token
def create_refresh_token(user_id: int, db: Session):
    # Remover tokens expirados
    expired_tokens = db.query(RefreshToken).filter(
        RefreshToken.user_id == user_id,
        RefreshToken.expires_at < datetime.utcnow()
    ).all()
    
    for token in expired_tokens:
        db.delete(token)
    
    # Criar novo token
    token_value = str(uuid.uuid4())
    expires_at = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    
    refresh_token = RefreshToken(
        token=token_value,
        user_id=user_id,
        expires_at=expires_at
    )
    
    db.add(refresh_token)
    db.commit()
    return token_value, expires_at

# Login de usuário
@router.post("/login", response_model=TokenResponse)
async def login(user: UserLogin, response: Response, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not pwd_context.verify(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas"
        )

    # Criar access token
    access_token = create_access_token({
        "sub": db_user.email,
        "id": db_user.id,
        "name": db_user.name
    })
    
    # Criar refresh token
    refresh_token, refresh_expires = create_refresh_token(db_user.id, db)
    
    # Configurar cookie seguro para refresh token (em produção usar secure=True)
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        max_age=7 * 24 * 60 * 60,  # 7 dias
        samesite="lax",
        # secure=True,  # Descomente em produção com HTTPS
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "name": db_user.name,
            "email": db_user.email
        }
    }

# Refresh token
@router.post("/refresh-token", response_model=TokenResponse)
async def refresh_token(response: Response, db: Session = Depends(get_db), refresh_token: str = None):
    # Verificar se o token foi enviado
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token não fornecido"
        )
    
    # Buscar token no banco
    token_record = db.query(RefreshToken).filter(
        RefreshToken.token == refresh_token,
        RefreshToken.expires_at > datetime.utcnow()
    ).first()
    
    if not token_record:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado"
        )
    
    # Buscar usuário
    user = db.query(User).filter(User.id == token_record.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )
    
    # Criar novo access token
    access_token = create_access_token({
        "sub": user.email,
        "id": user.id,
        "name": user.name
    })
    
    # Opcional: rotacionar o refresh token para maior segurança
    new_refresh_token, refresh_expires = create_refresh_token(user.id, db)
    
    # Remover token antigo
    db.delete(token_record)
    db.commit()
    
    # Configurar novo cookie
    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        max_age=7 * 24 * 60 * 60,
        samesite="lax",
        # secure=True,  # Descomente em produção com HTTPS
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }

# Logout
@router.post("/logout")
async def logout(response: Response, current_user: User = Depends(get_current_user)):
    # Limpar cookie de refresh token
    response.delete_cookie(key="refresh_token")
    return {"message": "Logout realizado com sucesso"}
