from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date


class SignupBonus(BaseModel):
    amount: int
    type: str
    minimum_spend: int
    time_period_days: int


class RewardCategory(BaseModel):
    name: str
    rate: float
    annual_cap: Optional[int] = None


class Rewards(BaseModel):
    base_rate: float
    categories: List[RewardCategory]


class Credit(BaseModel):
    name: str
    amount: int
    frequency: str


class Card(BaseModel):
    id: str
    name: str
    issuer: str
    network: str
    annual_fee: int
    signup_bonus: SignupBonus
    rewards: Rewards
    credits: List[Credit]


class UserCard(BaseModel):
    card_id: str
    date_opened: str


class Transaction(BaseModel):
    id: str
    date: str
    amount: float
    category: str
    merchant: str
    card_id: Optional[str] = None


class User(BaseModel):
    user_id: str
    cards: List[UserCard] = Field(default_factory=list)
    transactions: List[Transaction] = Field(default_factory=list)


class TransactionRecommendationRequest(BaseModel):
    user_id: str
    category: str
    amount: float


class TransactionRecommendationResponse(BaseModel):
    recommended_card_id: str
    card_name: str
    rewards_earned: float
    reason: str


class TransactionImportRequest(BaseModel):
    user_id: str
    transactions: List[Transaction]


class CategorySpending(BaseModel):
    category: str
    total_spent: float
    transaction_count: int


class SpendingAnalysis(BaseModel):
    user_id: str
    total_spent: float
    category_breakdown: List[CategorySpending]
    time_period: str


class ChatMessage(BaseModel):
    user_id: str
    message: str


class ChatResponse(BaseModel):
    response: str
