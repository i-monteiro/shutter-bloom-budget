
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Float, func, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relacionamentos
    events = relationship("Event", back_populates="user")

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, index=True)
    description = Column(String)
    start = Column(DateTime)
    end = Column(DateTime)
    location = Column(String)
    status = Column(String, default="Pendente")  # Pendente, Confirmado, Cancelado
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relacionamentos
    user = relationship("User", back_populates="events")

class Lead(Base):
    __tablename__ = "leads"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    phone = Column(String)  # Campo adicionado para telefone
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
