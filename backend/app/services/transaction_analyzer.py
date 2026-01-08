from typing import List
from collections import defaultdict
from app.models import Transaction, CategorySpending, SpendingAnalysis
from app.services.data_service import data_service


class TransactionAnalyzer:
    def analyze_spending(self, user_id: str, time_period: str = "all") -> SpendingAnalysis:
        transactions = data_service.get_user_transactions(user_id)

        category_totals = defaultdict(lambda: {"total": 0.0, "count": 0})
        total_spent = 0.0

        for transaction in transactions:
            category_totals[transaction.category]["total"] += transaction.amount
            category_totals[transaction.category]["count"] += 1
            total_spent += transaction.amount

        category_breakdown = [
            CategorySpending(
                category=category,
                total_spent=data["total"],
                transaction_count=data["count"]
            )
            for category, data in category_totals.items()
        ]

        category_breakdown.sort(key=lambda x: x.total_spent, reverse=True)

        return SpendingAnalysis(
            user_id=user_id,
            total_spent=total_spent,
            category_breakdown=category_breakdown,
            time_period=time_period
        )

    def get_categories(self) -> List[str]:
        return [
            "dining",
            "groceries",
            "gas",
            "travel",
            "flights",
            "hotels",
            "transit",
            "streaming",
            "shopping",
            "other"
        ]


transaction_analyzer = TransactionAnalyzer()
