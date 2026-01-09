from fastapi import APIRouter
from app.models import ChatMessage, ChatResponse
from app.services.chatbot import chatbot_service
from app.services.data_service import data_service

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.get("/intro/{user_id}", response_model=ChatResponse)
def get_intro_message(user_id: str):
    intro = chatbot_service.get_intro_message(user_id)
    return ChatResponse(response=intro)


@router.post("", response_model=ChatResponse)
def send_chat_message(message: ChatMessage):
    # Fetch user context to provide personalized responses
    user_context = _get_user_context(message.user_id)

    # Send message with user context
    response = chatbot_service.send_message(
        message.user_id,
        message.message,
        user_context=user_context
    )
    return ChatResponse(response=response)


def _get_user_context(user_id: str) -> dict:
    """Fetch and format user context for the chatbot."""
    context = {}

    try:
        # Get user data
        user = data_service.load_user(user_id)
        if not user:
            return context

        # Get user's cards with details
        user_cards = data_service.get_user_cards(user_id)
        if user_cards:
            context["cards"] = []
            for card in user_cards:
                card_info = {
                    "name": card.name,
                    "issuer": card.issuer,
                    "base_rate": card.rewards.base_rate,
                    "categories": [cat.name for cat in card.rewards.categories]
                }
                context["cards"].append(card_info)

        # Get spending summary
        if user.transactions:
            total_spent = sum(t.amount for t in user.transactions)

            # Calculate top categories
            category_totals = {}
            for t in user.transactions:
                category_totals[t.category] = category_totals.get(t.category, 0) + t.amount

            top_categories = sorted(
                category_totals.items(),
                key=lambda x: x[1],
                reverse=True
            )[:3]

            context["spending_summary"] = {
                "total_spent": total_spent,
                "top_categories": [cat[0] for cat in top_categories]
            }

            context["transaction_count"] = len(user.transactions)

    except Exception as e:
        print(f"Error fetching user context: {e}")

    return context
