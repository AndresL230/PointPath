import json
import os
from pathlib import Path
from typing import List, Optional
from app.models import Card, User, Transaction


class DataService:
    def __init__(self):
        self.base_dir = Path(__file__).parent.parent.parent
        self.data_dir = self.base_dir / "data"
        self.users_dir = self.data_dir / "users"
        self.cards_file = self.data_dir / "cards.json"

        self.users_dir.mkdir(parents=True, exist_ok=True)

    def load_cards(self) -> List[Card]:
        if not self.cards_file.exists():
            return []

        with open(self.cards_file, "r") as f:
            data = json.load(f)
            return [Card(**card) for card in data.get("cards", [])]

    def get_card_by_id(self, card_id: str) -> Optional[Card]:
        cards = self.load_cards()
        for card in cards:
            if card.id == card_id:
                return card
        return None

    def load_user(self, user_id: str) -> Optional[User]:
        user_file = self.users_dir / f"{user_id}.json"

        if not user_file.exists():
            return None

        with open(user_file, "r") as f:
            data = json.load(f)
            return User(**data)

    def get_user_transactions(self, user_id: str) -> List[Transaction]:
        user = self.load_user(user_id)
        if user is None:
            return []
        return user.transactions

    def get_user_cards(self, user_id: str) -> List[Card]:
        user = self.load_user(user_id)
        if user is None:
            return []

        all_cards = self.load_cards()
        user_card_ids = {card.card_id for card in user.cards}

        return [card for card in all_cards if card.id in user_card_ids]

    # ============================================================================
    # WRITE METHODS - COMMENTED OUT (Not editing data)
    # ============================================================================

    # def save_user(self, user: User) -> None:
    #     user_file = self.users_dir / f"{user.user_id}.json"
    #
    #     with open(user_file, "w") as f:
    #         json.dump(user.model_dump(), f, indent=2)

    # def create_user(self, user_id: str) -> User:
    #     user = User(user_id=user_id, cards=[], transactions=[])
    #     self.save_user(user)
    #     return user

    # def get_or_create_user(self, user_id: str) -> User:
    #     user = self.load_user(user_id)
    #     if user is None:
    #         user = self.create_user(user_id)
    #     return user

    # def add_card_to_user(self, user_id: str, user_card: UserCard) -> User:
    #     user = self.get_or_create_user(user_id)
    #     user.cards.append(user_card)
    #     self.save_user(user)
    #     return user

    # def remove_card_from_user(self, user_id: str, card_id: str) -> User:
    #     user = self.get_or_create_user(user_id)
    #     user.cards = [card for card in user.cards if card.card_id != card_id]
    #     self.save_user(user)
    #     return user

    # def add_transactions(self, user_id: str, transactions: List[Transaction]) -> User:
    #     user = self.get_or_create_user(user_id)
    #     user.transactions.extend(transactions)
    #     self.save_user(user)
    #     return user


data_service = DataService()
