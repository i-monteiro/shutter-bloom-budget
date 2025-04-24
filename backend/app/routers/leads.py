from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

router = APIRouter()

class LeadCreate(BaseModel):
    name: str
    email: EmailStr

class Lead(LeadCreate):
    id: int
    created_at: datetime

# Armazenamento temporário em memória para leads
leads_db = []
lead_id_counter = 1

@router.post("/api/leads", response_model=Lead)
async def create_lead(lead: LeadCreate):
    global lead_id_counter
    
    new_lead = Lead(
        id=lead_id_counter,
        name=lead.name,
        email=lead.email,
        created_at=datetime.now()
    )
    
    leads_db.append(new_lead.dict())
    lead_id_counter += 1
    
    return new_lead

@router.get("/api/leads", response_model=List[Lead])
async def get_leads():
    return leads_db