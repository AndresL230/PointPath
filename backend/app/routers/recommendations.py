from fastapi import APIRouter, HTTPException, Query
from typing import List
from app.models import TransactionRecommendationResponse
from app.services.transaction_analyzer import transaction_analyzer
from app.services.transaction_recommender import transaction_recommender
from app.services.new_card_recommender import new_card_recommender

router = APIRouter(prefix="/api/recommendations", tags=["recommendations"])


@router.get("/transaction", response_model=TransactionRecommendationResponse)
def recommend_card_for_transaction(
    user_id: str = Query(..., description="User ID"),
    amount: float = Query(..., description="Transaction amount"),
    category: str = Query(..., description="Transaction category")
):
    """
    Recommend the best card for a specific transaction.

    This endpoint analyzes a user's existing cards and recommends which one
    would earn the most rewards for a given transaction amount and category.
    """
    rankings = transaction_recommender.get_best_card(
        user_id=user_id,
        target_category=category,
        amount=amount
    )

    if not rankings:
        raise HTTPException(status_code=404, detail="User has no cards")

    best_card = rankings[0]

    return TransactionRecommendationResponse(
        recommended_card_id=best_card['card_id'],
        card_name=best_card['card'],
        rewards_earned=best_card['points_earned'],
        reason=f"Earns {best_card['rate']}x points in {category} category"
    )


@router.get("/new-cards/{user_id}")
def recommend_new_cards(user_id: str):
    """
    Recommend new cards based on user's spending patterns.

    Analyzes the user's transaction history and recommends cards they don't own
    that would maximize their rewards based on their actual spending behavior.
    Uses sophisticated engagement scoring based on spending amount, frequency, and consistency.
    """
    result = new_card_recommender.recommend_top_cards(user_id)

    if not result:
        raise HTTPException(status_code=404, detail="User has no transaction history")

    return result


@router.get("/categories", response_model=List[str])
def get_categories():
    return transaction_analyzer.get_categories()


@router.get("/analyze/{user_id}")
def analyze_user_transactions(user_id: str):
    return transaction_recommender.analyze_all_transactions(user_id)
