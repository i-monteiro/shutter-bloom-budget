
from sqlalchemy import Column, Integer, String, Date, DateTime, Float, Boolean, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime
from enum import Enum as PyEnum
from sqlalchemy.sql import func

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True)
    
    # Define relationship with RefreshToken
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")

class EventStatus(PyEnum):
    orcamento_recebido = "orcamento_recebido"
    proposta_enviada = "proposta_enviada"
    proposta_aceita = "proposta_aceita"
    proposta_recusada = "proposta_recusada"

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    
    nomeCliente = Column(String(100), nullable=False)
    tipoEvento = Column(String(100), nullable=False)
    dataOrcamento = Column(Date, nullable=False)
    dataEvento = Column(Date, nullable=False)
    status = Column(Enum(EventStatus), default=EventStatus.orcamento_recebido)

    valorEvento = Column(Float, nullable=True)
    iraParcelar = Column(Boolean, default=False, nullable=True)
    quantParcelas = Column(Integer, nullable=True)
    dataPrimeiroPagamento = Column(Date, nullable=True)
    contatoCliente = Column(String(20), nullable=True)
    motivoRecusa = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user = relationship("User", backref="events")

class RefreshToken(Base):
    __tablename__ = "refresh_tokens"
    
    id = Column(Integer, primary_key=True, index=True)
    token = Column(String(255), unique=True, nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=False)
    
    # Define relationship with User
    user = relationship("User", back_populates="refresh_tokens")
