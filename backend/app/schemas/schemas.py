from pydantic import BaseModel
from typing import Optional
from datetime import date
from enum import Enum

class EventStatus(str, Enum):
    orcamento_recebido = "orcamento_recebido"
    proposta_enviada = "proposta_enviada"
    proposta_aceita = "proposta_aceita"
    proposta_recusada = "proposta_recusada"

class EventCreate(BaseModel):
    nomeCliente: str
    tipoEvento: str
    dataOrcamento: date
    dataEvento: date
    status: EventStatus = EventStatus.orcamento_recebido

    valorEvento: Optional[float] = None
    iraParcelar: Optional[bool] = False
    quantParcelas: Optional[int] = None
    dataPrimeiroPagamento: Optional[date] = None
    
    contatoCliente: Optional[str]
    
    motivoRecusa: Optional[str] = None
    
    # user_id: Optional[int]  # <-- adicione isso aqui

class EventUpdate(BaseModel):
    """Schema para edição parcial (PATCH)"""
    nomeCliente: Optional[str]
    tipoEvento: Optional[str]
    dataOrcamento: Optional[date]
    dataEvento: Optional[date]
    status: Optional[EventStatus]
    valorEvento: Optional[float]
    iraParcelar: Optional[bool]
    quantParcelas: Optional[int]
    dataPrimeiroPagamento: Optional[date]
    
    contatoCliente: Optional[str]
    motivoRecusa: Optional[str]

class EventOut(BaseModel):
    id: int
    nomeCliente: str
    tipoEvento: str
    dataOrcamento: date
    dataEvento: date
    status: EventStatus
    valorEvento: Optional[float]
    iraParcelar: Optional[bool]
    quantParcelas: Optional[int]
    dataPrimeiroPagamento: Optional[date]
    contatoCliente: Optional[str]
    motivoRecusa: Optional[str]

    class Config:
        from_attributes = True  # pydantic v2, substitui orm_mode = True
