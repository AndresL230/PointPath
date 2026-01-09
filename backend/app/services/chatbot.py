from typing import Optional, List
from anthropic import Anthropic
from app.config import settings


class ChatbotService:
    def __init__(self):
        api_key = settings.anthropic_api_key
        if api_key:
            try:
                self.client = Anthropic(api_key=api_key)
                print("Anthropic API client initialized")
            except Exception as e:
                print(f"Warning: Failed to initialize Anthropic client: {e}")
                self.client = None
        else:
            print("Warning: ANTHROPIC_API_KEY not found. Chat features will be disabled.")
            self.client = None

        self.system_prompt = """You are PointPath Assistant, a friendly AI that helps college students maximize their credit card rewards.

You can help users:
- Understand their credit card benefits and perks
- Decide which card to use for specific purchases
- Explain rewards programs, points valuations, and signup bonuses
- Recommend new cards based on spending patterns

Guidelines:
- Be friendly, concise, and practical
- Use simple language
- Give specific, actionable advice
- If you don't know something, say so"""

    def get_intro_message(self, user_id: str) -> str:
        if not self.client:
            return (
                "Hi! I'm your PointPath assistant. "
                "Note: AI chat is currently unavailable. "
                "Please contact your administrator to enable this feature."
            )
        return (
            "Hi! I'm your PointPath assistant. "
            "I can help you optimize your credit card rewards and answer questions about your spending. "
            "What would you like to know?"
        )

    def send_message(
        self,
        user_id: str,
        message: str,
        history: Optional[List[dict]] = None,
        user_context: Optional[dict] = None
    ) -> str:
        if not self.client:
            return (
                "AI chat is currently unavailable. The ANTHROPIC_API_KEY is not configured. "
                "Please add it to your .env file to enable this feature."
            )

        try:
            # Build enhanced system prompt with user context
            system_prompt = self.system_prompt
            if user_context:
                context_info = self._format_user_context(user_context)
                system_prompt = f"{self.system_prompt}\n\n{context_info}"

            # Build messages list
            messages = []

            # Add conversation history if provided
            if history:
                for msg in history:
                    messages.append({
                        "role": msg.get("role", "user"),
                        "content": msg.get("content", "")
                    })

            # Add current message
            messages.append({"role": "user", "content": message})

            response = self.client.messages.create(
                model="claude-3-5-haiku-20241022",
                max_tokens=1024,
                system=system_prompt,
                messages=messages
            )

            return response.content[0].text
        except Exception as e:
            return f"Error communicating with chatbot: {str(e)}"

    def _format_user_context(self, context: dict) -> str:
        """Format user context into a readable string for the AI."""
        parts = ["## Current User Context"]

        # Cards information
        if context.get("cards"):
            parts.append("\n### User's Credit Cards:")
            for card in context["cards"]:
                parts.append(f"- {card['name']} (Issuer: {card['issuer']})")
                parts.append(f"  - Base rate: {card['base_rate']}x")
                if card.get("categories"):
                    parts.append(f"  - Bonus categories: {', '.join(card['categories'])}")

        # Spending summary
        if context.get("spending_summary"):
            spending = context["spending_summary"]
            parts.append("\n### Spending Summary:")
            parts.append(f"- Total spent: ${spending.get('total_spent', 0):.2f}")
            if spending.get("top_categories"):
                parts.append(f"- Top spending categories: {', '.join(spending['top_categories'])}")

        # Transaction count
        if context.get("transaction_count"):
            parts.append(f"\n### Transaction History: {context['transaction_count']} transactions")

        return "\n".join(parts)


chatbot_service = ChatbotService()
