import pandas as pd
import json
from datetime import datetime
import math

data = pd.read_csv('./transactionsTest3.csv').to_dict(orient='records')
cardData = pd.read_csv('./creditCardList.csv').to_dict(orient='records') 
cardDataJSON = json.load(open('../backend/data/cards.json')) 


totals = {
    'grocery': {'amount': 0, 'transactions': 0, 'daysDifference': 0, 'lastDate': None},
    'hotel': {'amount': 0, 'transactions': 0, 'daysDifference': 0, 'lastDate': None},
    'transportation': {'amount': 0, 'transactions': 0, 'daysDifference': 0, 'lastDate': None},
    'restaurant': {'amount': 0, 'transactions': 0, 'daysDifference': 0, 'lastDate': None}
}

for transaction in data:
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
maxTransactions = max(v['transactions'] for v in totals.values())

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

def recommendTop3FromJSON(cardsJson, normalized):
    recommendations = []

    categoryMap = {
        'grocery': ['groceries'],
        'restaurant': ['dining'],
        'hotel': ['hotels', 'travel', 'flights'],
        'transportation': ['base_rate', 'transit', 'gas']
    }

    for card in cardsJson['cards']:
        totalScore = 0
        baseRate = card['rewards'].get('base_rate', 0) / 100

        for category, data in normalized.items(): # Calculates how much each category contributes to card score (simple sum. Weights are already applied)
            contributionRate = baseRate

            for cat in card['rewards']['categories']:
                if cat['name'] in categoryMap[category]:
                    contributionRate = cat['rate'] / 100 # If category has special rates
                    if 'annual_cap' in cat and data['amount'] > cat['annual_cap']: # If the category has an annual cap
                        dataAmount = cat['annual_cap']
                    else:
                        dataAmount = data['amount']
                    break
                else:
                    dataAmount = data['amount']

            contribution = dataAmount * contributionRate * data['score']
            totalScore += contribution

        totalScore -= card['annual_fee'] 

        # Score can be interpreted as "dollars user CAN earn if maximizing category rates based on transaction history"

        recommendations.append({'cardName': card['name'], 'score': totalScore})

    recommendations.sort(key=lambda x: x['score'], reverse=True)

    # Form dictionary that has the top 3 cards
    top3Dict = {i+1: recommendations[i] for i in range(min(3, len(recommendations)))}

    cardsByName = {c['name']: c for c in cardsJson['cards']} # Dictionary of cards to card data

    # Add insights of possible signup bonuses and credits
    for i, card in top3Dict.items():
        cardData = cardsByName[card['cardName']]  
        card['signupBonus'] = cardData['signup_bonus']
        card['credits'] = cardData.get('credits', [])

    return top3Dict


top3Cards = recommendTop3FromJSON(cardDataJSON, normalized)

print(top3Cards)