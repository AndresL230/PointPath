import os
from typing import Optional
from anthropic import Anthropic


class ChatbotService:
    def __init__(self):
        api_key = os.getenv("ANTHROPIC_API_KEY")
        self.client = Anthropic(api_key=api_key) if api_key else None

    def get_intro_message(self, user_id: str) -> str:
        return (
            f"Hi! I'm your PointPath assistant. "
            f"I can help you optimize your credit card rewards and answer questions about your spending. "
            f"What would you like to know?"
        )

    def send_message(self, user_id: str, message: str) -> str:
        if not self.client:
            return "Chatbot is not configured. Please set ANTHROPIC_API_KEY environment variable."

        try:
            response = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1024,
                messages=[
                    {
                        "role": "user",
                        "content": f"You are a helpful credit card rewards assistant for college students. Answer this question: {message}"
                    }
                ]
            )

            return response.content[0].text
        except Exception as e:
            return f"Error communicating with chatbot: {str(e)}"


chatbot_service = ChatbotService()
