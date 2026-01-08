from fastapi import APIRouter, HTTPException
from typing import List
from app.models import Card
from app.services.data_service import data_service

router = APIRouter(prefix="/api/cards", tags=["cards"])


@router.get("", response_model=List[Card])
def get_all_cards():
    cards = data_service.load_cards()
    return cards


@router.get("/{card_id}", response_model=Card)
def get_card(card_id: str):
    card = data_service.get_card_by_id(card_id)
    if card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    return card
