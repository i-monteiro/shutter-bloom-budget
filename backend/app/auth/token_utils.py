
from jose import JWTError, jwt, ExpiredSignatureError
import os
from dotenv import load_dotenv
import time
import logging

# Configurar logging básico
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY environment variable is not set")

ALGORITHM = "HS256"

def verify_token(token: str):
    try:
        # Registrar tentativa de decodificação sem expor o token completo
        token_prefix = token[:8] if len(token) > 8 else "[token muito curto]"
        logger.info(f"Verificando token: {token_prefix}...")
        
        # Decodificar o token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        # Verificar se o token está prestes a expirar (5 minutos ou menos)
        if "exp" in payload:
            remaining = payload["exp"] - time.time()
            if remaining <= 300:  # 5 minutos
                logger.warning(f"Token expirará em {int(remaining)} segundos")
                
        return payload
    except ExpiredSignatureError:
        logger.warning("Token expirado")
        return None
    except JWTError as e:
        logger.error(f"Erro na validação do token: {str(e)}")
        return None
