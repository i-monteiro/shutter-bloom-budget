from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.auth.token_utils import verify_token  # <-- aqui o ajuste

class JWTBearer(HTTPBearer):
    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super().__call__(request)
        if credentials:
            if not self.verify_jwt(credentials.credentials):
                raise HTTPException(status_code=403, detail="Token inválido")
            return credentials.credentials
        else:
            raise HTTPException(status_code=403, detail="Token não fornecido")

    def verify_jwt(self, jwt_token: str) -> bool:
        payload = verify_token(jwt_token)
        return bool(payload)
