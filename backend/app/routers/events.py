from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Event, User
from app.schemas.schemas import EventCreate, EventOut, EventUpdate
from typing import List, Optional
from app.auth.auth_handler import get_current_user
import logging
from datetime import date

# Configurar logging
logger = logging.getLogger(__name__)

router = APIRouter()

# Listar eventos com paginação
@router.get("/events/", response_model=List[EventOut])
def list_events(
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100)
):
    logger.info(f"User {current_user.id} requested events. Skip: {skip}, Limit: {limit}")

    events = db.query(Event).filter(
        Event.user_id == current_user.id
    ).offset(skip).limit(limit).all()

    return events

# Criar evento
@router.post("/events/", response_model=EventOut, status_code=status.HTTP_201_CREATED)
def create_event(
    request: Request,
    event_data: EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if event_data.dataEvento < date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A data do evento não pode ser no passado"
        )

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

    try:
        db.add(new_event)
        db.commit()
        db.refresh(new_event)
        logger.info(f"User {current_user.id} created event {new_event.id}")
        return new_event
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating event: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao criar evento"
        )

# Buscar evento por ID
@router.get("/events/{event_id}", response_model=EventOut)
def get_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ev = db.query(Event).filter(
        Event.id == event_id,
        Event.user_id == current_user.id
    ).first()

    if not ev:
        raise HTTPException(status_code=404, detail="Evento não encontrado")
    return ev

# Atualizar evento
@router.patch("/events/{event_id}", response_model=EventOut)
def update_event(
    event_id: int,
    updates: EventUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_event = db.query(Event).filter(
        Event.id == event_id,
        Event.user_id == current_user.id
    ).first()

    if not db_event:
        raise HTTPException(status_code=404, detail="Evento não encontrado")

    update_data = updates.dict(exclude_unset=True)
    if "status" not in update_data:
        update_data["status"] = db_event.status.value

    validated = EventUpdate(**update_data)

    if validated.status == "proposta_enviada" and not validated.valorEvento:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Valor do evento é obrigatório para propostas enviadas"
        )

    if validated.status == "proposta_aceita" and not validated.dataPrimeiroPagamento:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Data do primeiro pagamento é obrigatória para propostas aceitas"
        )

    if validated.status == "proposta_recusada" and not validated.motivoRecusa:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Motivo da recusa é obrigatório para propostas recusadas"
        )

    for key, value in validated.dict(exclude_unset=True).items():
        setattr(db_event, key, value)

    try:
        db.commit()
        db.refresh(db_event)
        logger.info(f"User {current_user.id} updated event {event_id}")
        return db_event
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating event {event_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao atualizar evento"
        )

# Deletar evento
@router.delete("/events/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_event = db.query(Event).filter(
        Event.id == event_id,
        Event.user_id == current_user.id
    ).first()

    if not db_event:
        raise HTTPException(status_code=404, detail="Evento não encontrado")

    try:
        db.delete(db_event)
        db.commit()
        logger.info(f"User {current_user.id} deleted event {event_id}")
        return
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting event {event_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao excluir evento"
        )
