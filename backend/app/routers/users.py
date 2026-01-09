from fastapi import APIRouter, HTTPException
from typing import List
from app.models import Card, User, UserCard
from app.services.data_service import data_service

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/{user_id}", response_model=User)
def get_user(user_id: str):
    user = data_service.load_user(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/{user_id}/cards", response_model=List[Card])
def get_user_cards(user_id: str):
    cards = data_service.get_user_cards(user_id)
    return cards


# ============================================================================
# POST/DELETE ENDPOINTS - COMMENTED OUT (Not editing data)
# ============================================================================

# @router.post("/{user_id}", response_model=User)
# def create_user(user_id: str):
#     existing_user = data_service.load_user(user_id)
#     if existing_user:
#         raise HTTPException(status_code=400, detail="User already exists")
#     return data_service.create_user(user_id)


# @router.post("/{user_id}/cards", response_model=User)
# def add_card_to_user(user_id: str, user_card: UserCard):
#     card = data_service.get_card_by_id(user_card.card_id)
#     if card is None:
#         raise HTTPException(status_code=404, detail="Card not found")
#     return data_service.add_card_to_user(user_id, user_card)


# @router.delete("/{user_id}/cards/{card_id}", response_model=User)
# def remove_card_from_user(user_id: str, card_id: str):
#     return data_service.remove_card_from_user(user_id, card_id)
