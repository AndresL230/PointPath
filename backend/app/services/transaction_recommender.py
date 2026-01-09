from app.services.data_service import DataService


class TransactionRecommender:
    def __init__(self, data_service: DataService):
        self.data_service = data_service

    def get_best_card(self, user_id: str, target_category: str, amount: float):
        # get user's cards
        user_owned_cards = self.data_service.get_user_cards(user_id)

        rankings = []

        # loop only through cards the user owns
        for card in user_owned_cards:
            card_name = card.name
            base_rate = card.rewards.base_rate

            category_data = next(
                (cat for cat in card.rewards.categories if cat.name == target_category),
                None
            )

            active_rate = category_data.rate if category_data else base_rate
            points_earned = amount * active_rate

            rankings.append({
                "card_id": card.id,
                "card": card_name,
                "rate": active_rate,
                "points_earned": points_earned
            })

        return sorted(rankings, key=lambda x: x['points_earned'], reverse=True)

    def analyze_all_transactions(self, user_id: str):
        # process transactions
        total_points = 0
        all_transactions = self.data_service.get_user_transactions(user_id)
        results = []

        for txn in all_transactions:
            # pass user_owned_cards instead of the whole master list
            recommendations = self.get_best_card(user_id, txn.category, txn.amount)

            if recommendations:
                best_choice = recommendations[0]
                total_points += best_choice['points_earned']

                results.append({
                    "merchant": txn.merchant,
                    "category": txn.category,
                    "amount": txn.amount,
                    "recommended_card": best_choice['card'],
                    "rate": best_choice['rate'],
                    "points_earned": best_choice['points_earned']
                })

        return {
            "total_points": round(total_points, 2),
            "transactions": results
        }


# Singleton instance
from app.services.data_service import data_service
transaction_recommender = TransactionRecommender(data_service)