from pydantic import BaseModel, EmailStr
from datetime import datetime
from enum import Enum

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class EventStatus(str, Enum):
    ORCAMENTO_RECEBIDO = "orçamento recebido"
    PROPOSTA_ENVIADA = "proposta enviada"
    PROPOSTA_ACEITA = "proposta aceita"

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
        orm_mode = True