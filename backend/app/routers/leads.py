from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Lead
from pydantic import BaseModel, EmailStr
from app.core.config import get_settings
import httpx, logging

router = APIRouter(prefix="/leads", tags=["leads"])

class LeadCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str

# ---------- helpers ----------
async def _post(url: str, data: dict, what: str):
    async with httpx.AsyncClient() as client:
        r = await client.post(url, json=data, timeout=10.0)
    if r.status_code >= 400:
        logging.error(f"{what} webhook error {r.status_code}: {r.text}")
        raise RuntimeError(f"{what} webhook error")

async def _sheet_task(data: dict):
    await _post(get_settings().N8N_GS_WEBHOOK, data, "Google Sheets")

async def _wa_task(data: dict):
    await _post(get_settings().N8N_WA_WEBHOOK, data, "WhatsApp")

# ---------- endpoints ----------
@router.post("/")
def create_lead(
    lead: LeadCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    # salva no banco
    db_lead = Lead(**lead.dict())
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)

    # agenda chamadas aos webhooks em background
    background_tasks.add_task(_sheet_task, lead.dict())
    background_tasks.add_task(
        _wa_task,
        {**lead.dict(), "register_link": get_settings().REGISTER_LINK},
    )

    return {"status": "queued", "lead_id": db_lead.id}
