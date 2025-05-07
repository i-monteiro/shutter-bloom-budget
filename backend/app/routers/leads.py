
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Lead
from pydantic import BaseModel, EmailStr
from typing import Optional
import json
import httpx

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

@router.post("/googlesheet")
async def create_lead_googlesheet(lead: LeadCreate):
    """
    This endpoint sends lead data to Google Sheets via N8N workflow
    instead of saving it to the database.
    """
    try:
        # Replace this URL with your actual N8N webhook URL that connects to Google Sheets
        n8n_webhook_url = "https://your-n8n-instance.com/webhook/google-sheets-integration"
        
        # Send data to N8N webhook which will handle Google Sheets integration
        async with httpx.AsyncClient() as client:
            response = await client.post(
                n8n_webhook_url,
                json={
                    "name": lead.name,
                    "email": lead.email,
                    "phone": lead.phone,
                    "source": "website_form"
                },
                timeout=10.0
            )
            
        if response.status_code >= 400:
            return {"status": "error", "message": f"N8N webhook returned error: {response.status_code}"}
            
        return {"status": "success", "message": "Lead sent to Google Sheets and N8N automation triggered"}
    
    except Exception as e:
        return {"status": "error", "message": f"Failed to connect to N8N: {str(e)}"}

@router.get("/")
def get_all_leads(db: Session = Depends(get_db)):
    # Recupera todos os leads
    leads = db.query(Lead).all()
    return {"leads": leads}
