from fastapi import APIRouter, HTTPException
from typing import List
from app.models import TransactionRecommendationRequest, TransactionRecommendationResponse, Card
from app.services.data_service import data_service
from app.services.transaction_analyzer import transaction_analyzer

router = APIRouter(prefix="/api/recommendations", tags=["recommendations"])


@router.post("/transaction", response_model=TransactionRecommendationResponse)
def recommend_card_for_transaction(request: TransactionRecommendationRequest):
    user_cards = data_service.get_user_cards(request.user_id)

    if not user_cards:
        raise HTTPException(status_code=404, detail="User has no cards")

    best_card = None
    best_rewards = 0.0

    for card in user_cards:
        rewards = calculate_rewards(card, request.category, request.amount)
        if rewards > best_rewards:
            best_rewards = rewards
            best_card = card

    if best_card is None:
        best_card = user_cards[0]
        best_rewards = calculate_rewards(best_card, request.category, request.amount)

    return TransactionRecommendationResponse(
        recommended_card_id=best_card.id,
        card_name=best_card.name,
        rewards_earned=best_rewards,
        reason=f"Earns {best_rewards:.2f} points in {request.category} category"
    )


@router.get("/new-cards/{user_id}", response_model=List[Card])
def recommend_new_cards(user_id: str):
    user_cards = data_service.get_user_cards(user_id)
    all_cards = data_service.load_cards()

    user_card_ids = {card.id for card in user_cards}
    available_cards = [card for card in all_cards if card.id not in user_card_ids]

    return available_cards


@router.get("/categories", response_model=List[str])
def get_categories():
    return transaction_analyzer.get_categories()


def calculate_rewards(card: Card, category: str, amount: float) -> float:
    for reward_category in card.rewards.categories:
        if reward_category.name == category:
            return amount * reward_category.rate

    return amount * card.rewards.base_rate
