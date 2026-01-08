from fastapi import APIRouter
from app.models import ChatMessage, ChatResponse
from app.services.chatbot import chatbot_service

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
def send_chat_message(message: ChatMessage):
    response = chatbot_service.send_message(message.user_id, message.message)
    return ChatResponse(response=response)


@router.get("/intro/{user_id}", response_model=ChatResponse)
def get_intro_message(user_id: str):
    intro = chatbot_service.get_intro_message(user_id)
    return ChatResponse(response=intro)
