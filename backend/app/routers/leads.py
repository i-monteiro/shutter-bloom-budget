
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Lead
from pydantic import BaseModel, EmailStr
from typing import Optional

router = APIRouter(
    prefix="/leads",
    tags=["leads"],
    responses={404: {"description": "Not found"}},
)

class LeadCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str

@router.post("/")
def create_lead(lead: LeadCreate, db: Session = Depends(get_db)):
    # Cria um novo lead no banco de dados
    db_lead = Lead(
        name=lead.name, 
        email=lead.email,
        phone=lead.phone
    )
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    return {"status": "success", "lead": db_lead}

@router.get("/")
def get_all_leads(db: Session = Depends(get_db)):
    # Recupera todos os leads
    leads = db.query(Lead).all()
    return {"leads": leads}
