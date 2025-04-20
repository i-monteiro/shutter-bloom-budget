from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Event, User
from app.schemas.schemas import EventCreate, EventOut, EventUpdate
from typing import List
from app.auth.auth_handler import get_current_user

router = APIRouter()

# ✅ Correção aplicada aqui: filtra por current_user.id
@router.get("/events/", response_model=List[EventOut])
def list_events(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    events = db.query(Event).filter(Event.user_id == current_user.id).all()
    return events

@router.post("/events/", response_model=EventOut, status_code=status.HTTP_201_CREATED)
def create_event(
    event_data: EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_event = Event(
        nomeCliente=event_data.nomeCliente,
        tipoEvento=event_data.tipoEvento,
        dataOrcamento=event_data.dataOrcamento,
        dataEvento=event_data.dataEvento,
        status=event_data.status,
        valorEvento=event_data.valorEvento,
        iraParcelar=event_data.iraParcelar,
        quantParcelas=event_data.quantParcelas,
        dataPrimeiroPagamento=event_data.dataPrimeiroPagamento,
        user_id=current_user.id,
        contatoCliente=event_data.contatoCliente,
        motivoRecusa=event_data.motivoRecusa
    )

    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event

@router.get("/events/{event_id}", response_model=EventOut)
def get_event(event_id: int, db: Session = Depends(get_db)):
    ev = db.query(Event).filter(Event.id == event_id).first()
    if not ev:
        raise HTTPException(status_code=404, detail="Evento não encontrado")
    return ev

@router.patch("/events/{event_id}", response_model=EventOut)
def update_event(event_id: int, updates: EventUpdate, db: Session = Depends(get_db)):
    db_event = db.query(Event).filter(Event.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Evento não encontrado")

    # Atualiza somente campos que foram enviados
    if updates.nomeCliente is not None:
        db_event.nomeCliente = updates.nomeCliente
    if updates.tipoEvento is not None:
        db_event.tipoEvento = updates.tipoEvento
    if updates.dataOrcamento is not None:
        db_event.dataOrcamento = updates.dataOrcamento
    if updates.dataEvento is not None:
        db_event.dataEvento = updates.dataEvento
    if updates.status is not None:
        db_event.status = updates.status
    if updates.valorEvento is not None:
        db_event.valorEvento = updates.valorEvento
    if updates.iraParcelar is not None:
        db_event.iraParcelar = updates.iraParcelar
    if updates.quantParcelas is not None:
        db_event.quantParcelas = updates.quantParcelas
    if updates.dataPrimeiroPagamento is not None:
        db_event.dataPrimeiroPagamento = updates.dataPrimeiroPagamento  
    if updates.contatoCliente is not None:
        db_event.contatoCliente = updates.contatoCliente
    if updates.motivoRecusa is not None:
        db_event.motivoRecusa = updates.motivoRecusa    

    db.commit()
    db.refresh(db_event)
    return db_event

@router.delete("/events/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(event_id: int, db: Session = Depends(get_db)):
    db_event = db.query(Event).filter(Event.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Evento não encontrado")
    db.delete(db_event)
    db.commit()
    return  # 204 no content
