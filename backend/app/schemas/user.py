
from pydantic import BaseModel, EmailStr, validator, Field
from datetime import datetime
from enum import Enum
from typing import Optional

class UserCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)
    
    @validator('password')
    def password_strength(cls, v):
        if not any(c.isalpha() for c in v):
            raise ValueError('Password must contain at least one letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserBase(BaseModel):
    id: int
    name: str
    email: EmailStr

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserBase

class EventStatus(str, Enum):
    ORCAMENTO_RECEBIDO = "orçamento recebido"
    PROPOSTA_ENVIADA = "proposta enviada"
    PROPOSTA_ACEITA = "proposta aceita"
    PROPOSTA_RECUSADA = "proposta recusada"

class EventBase(BaseModel):
    title: str
    date: datetime
    type: str
    status: EventStatus  # 👈 usa o Enum aqui também

class EventCreate(EventBase):
    pass

class EventOut(EventBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True  # pydantic v2
