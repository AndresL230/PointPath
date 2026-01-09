from datetime import datetime
import math
from app.services.data_service import DataService


class NewCardRecommender:
    def __init__(self, data_service: DataService):
        self.data_service = data_service
        self.category_map = {
            'dining': 'restaurant',
            'groceries': 'grocery',
            'gas': 'transportation',
            'transit': 'transportation',
            'flights': 'flights',
            'hotels': 'hotel'
        }

    def load_user_transactions(self, user_id):
        """Load user transactions and convert to normalized format"""
        user_transactions = self.data_service.get_user_transactions(user_id)

        transactions = []
        for txn in user_transactions:
            category = self.category_map.get(txn.category, txn.category)
            transactions.append({
                'Date': txn.date,
                'Merchant': txn.merchant,
                'Category': category,
                'Amount': txn.amount,
                'Card_Used': txn.card_id
            })

        return transactions

    def calculate_engagement_scores(self, transactions):
        """Calculate engagement scores for each category"""
        totals = {
            'grocery': {'amount': 0, 'transactions': 0, 'daysDifference': 0, 'lastDate': None},
            'hotel': {'amount': 0, 'transactions': 0, 'daysDifference': 0, 'lastDate': None},
            'flights': {'amount': 0, 'transactions': 0, 'daysDifference': 0, 'lastDate': None},
            'transportation': {'amount': 0, 'transactions': 0, 'daysDifference': 0, 'lastDate': None},
            'restaurant': {'amount': 0, 'transactions': 0, 'daysDifference': 0, 'lastDate': None}
        }

        for transaction in transactions:
            category = transaction['Category']
            if category in totals:
                totals[category]['amount'] += transaction['Amount']
                totals[category]['transactions'] += 1

                currentDate = datetime.strptime(transaction['Date'], '%Y-%m-%d')

                if totals[category]['lastDate'] is not None:
                    daysDiff = (currentDate - totals[category]['lastDate']).days
                    totals[category]['daysDifference'] += daysDiff

                totals[category]['lastDate'] = currentDate

        totalAmountAll = sum(v['amount'] for v in totals.values())
        maxTransactions = max(v['transactions'] for v in totals.values()) if any(v['transactions'] > 0 for v in totals.values()) else 1

        normalized = {}

        for category, stats in totals.items():
            amount = stats['amount']
            transactions = stats['transactions']

            if transactions > 1:
                avgDays = stats['daysDifference'] / (transactions - 1)
            else:
                avgDays = float('inf')

            # Spending Score (Percentage of total spending)
            # Values closer to 1 mean this category dominates overall spending
            S = amount / totalAmountAll if totalAmountAll > 0 else 0

            # Frequency (Helps rule out micro-transactions/outliers)
            # Values closer to 1 mean the user spends in this category frequently relative to other categories
            F = math.log(1 + transactions) / math.log(1 + maxTransactions) if maxTransactions > 0 else 0

            # T = Timing Consistency Score
            # Timing (Values closer to 1 means this transaction is consistent and scheduled like weekly grocery runs vs random flights)
            T = 1 / (1 + avgDays) if avgDays != float('inf') else 0

            engagementScore = (
                0.55 * S +
                0.25 * F +
                0.20 * T
            )

            normalized[category] = {
                'S': S,
                'F': F,
                'T': T,
                'score': engagementScore,
                'amount': amount
            }

        return normalized

    def recommend_top_cards(self, user_id):
        """Recommend top 3 cards based on user spending patterns"""
        # Load user transactions
        transactions = self.load_user_transactions(user_id)

        if not transactions:
            return {}

        # Calculate engagement scores
        normalized = self.calculate_engagement_scores(transactions)

        # Load all cards
        all_cards = self.data_service.load_cards()
        user_cards = self.data_service.get_user_cards(user_id)
        user_card_ids = {card.id for card in user_cards}

        # Filter to only cards user doesn't have
        available_cards = [card for card in all_cards if card.id not in user_card_ids]

        # Convert to dict format for processing
        cards_json = {'cards': [card.model_dump() for card in available_cards]}

        recommendations = []

        categoryMap = {
            'grocery': ['groceries'],
            'restaurant': ['dining'],
            'hotel': ['hotels'],
            'flights': ['flights'],
            'transportation': ['base_rate', 'transit', 'gas']
        }

        for card in cards_json['cards']:
            totalScore = 0
            baseRate = card['rewards'].get('base_rate', 0) / 100

            for category, data in normalized.items():
                contributionRate = baseRate
                dataAmount = data['amount']

                for cat in card['rewards']['categories']:
                    if cat['name'] in categoryMap[category]:
                        contributionRate = cat['rate'] / 100
                        if 'annual_cap' in cat and cat['annual_cap'] is not None and data['amount'] > cat['annual_cap']:
                            dataAmount = cat['annual_cap']
                        else:
                            dataAmount = data['amount']
                        break

                contribution = dataAmount * contributionRate * data['score']
                totalScore += contribution

            totalScore -= card['annual_fee']

            recommendations.append({'cardName': card['name'], 'score': totalScore, 'cardId': card['id']})

        recommendations.sort(key=lambda x: x['score'], reverse=True)

        # Form dictionary that has the top 3 cards
        top3Dict = {i+1: recommendations[i] for i in range(min(3, len(recommendations)))}

        cardsByName = {c['name']: c for c in cards_json['cards']}

        # Add insights of possible signup bonuses and credits
        for i, card in top3Dict.items():
            cardData = cardsByName[card['cardName']]
            card['signupBonus'] = cardData['signup_bonus']
            card['credits'] = cardData.get('credits', [])

        return top3Dict


# Singleton instance
from app.services.data_service import data_service
new_card_recommender = NewCardRecommender(data_service)