
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import users, events
from app.core.database import Base, engine
from app.models.models import User, Event

app = FastAPI()

# Cria tabelas no banco
Base.metadata.create_all(bind=engine)

# Configura CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8080"],  # Adicionado porta 8080
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotas
app.include_router(users.router, prefix="/api")
app.include_router(events.router, prefix="/api")
