from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.core.database import SessionLocal
from app.models.models import User
from app.schemas.user import UserCreate, UserLogin
from app.auth.auth_handler import create_access_token

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Conexão com banco
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Cadastro de usuário
@router.post("/users/", status_code=201)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    
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

# Login de usuário
@router.post("/login")
async def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not pwd_context.verify(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    token = create_access_token({
        "sub": db_user.email,
        "id": db_user.id,
        "name": db_user.name  # 👈 Adiciona o nome no token
    })
    return {"access_token": token}


