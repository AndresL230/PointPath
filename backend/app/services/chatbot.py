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
        history: Optional[List[dict]] = None
    ) -> str:
        if not self.client:
            return (
                "AI chat is currently unavailable. The ANTHROPIC_API_KEY is not configured. "
                "Please add it to your .env file to enable this feature."
            )

        try:
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
                system=self.system_prompt,
                messages=messages
            )

            return response.content[0].text
        except Exception as e:
            return f"Error communicating with chatbot: {str(e)}"


chatbot_service = ChatbotService()
