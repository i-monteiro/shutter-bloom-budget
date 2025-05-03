from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from sqlalchemy.orm import Session
from app.routers import users, events
from app.core.database import Base, engine, get_db
from app.models.models import User, Event
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Configura CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Configura Trusted Hosts
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")
app.add_middleware(TrustedHostMiddleware, allowed_hosts=ALLOWED_HOSTS)

# Security headers middleware
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Content-Security-Policy"] = "default-src 'self'; connect-src 'self'; img-src 'self' data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        return response

app.add_middleware(SecurityHeadersMiddleware)

# Cria tabelas no banco se não existirem
Base.metadata.create_all(bind=engine)

# Handler global de erros
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"Erro global capturado: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

# Rotas
app.include_router(users.router, prefix="/api")
app.include_router(events.router, prefix="/api")

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Teste de conexão
@app.get("/test-db")
def test_db(db: Session = Depends(get_db)):
    try:
        db.execute("SELECT 1")
        return {"status": "Conexão com banco funcionando! 🎉"}
    except Exception as e:
        return {"status": "Erro na conexão com o banco", "detail": str(e)}
