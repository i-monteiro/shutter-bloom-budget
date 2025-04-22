
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from app.routers import users, events
from app.core.database import Base, engine
from app.models.models import User, Event
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Configura CORS - IMPORTANTE: esta configuração deve vir ANTES de outros middlewares
# para evitar problemas com requisições preflight
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:5173",  # Vite dev server padrão
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

# Trusted hosts configuration
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")
app.add_middleware(TrustedHostMiddleware, allowed_hosts=ALLOWED_HOSTS)

# Security headers middleware
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Add security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Content-Security-Policy"] = "default-src 'self'; connect-src 'self' http://localhost:8000 http://localhost:8080; img-src 'self' data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        
        return response

app.add_middleware(SecurityHeadersMiddleware)

# Cria tabelas no banco
Base.metadata.create_all(bind=engine)

# Global exception handler for better error reporting
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Log error but don't expose details to client
    print(f"Global error handler caught: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

# Rotas
app.include_router(users.router, prefix="/api")
app.include_router(events.router, prefix="/api")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}
