import json
import re

# load the data safely
def load_data(file_path):
    with open(file_path, 'r') as file:
        content = file.read().strip()
        
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            # 2. fallback if .js file again
            match = re.search(r'\[.*\]|\{.*\}', content, re.DOTALL)
            if match:
                return json.loads(match.group(0))
            raise ValueError(f"Could not parse JSON in {file_path}")
    
# loading both datasets
transactions_data = load_data('backend/data/users/user01.json')
cards_data = load_data('backend/data/cards.json')

all_transactions = transactions_data['transactions']
all_cards = cards_data['cards']

# example: Print the first transaction's merchant
# print(f"First Merchant: {all_transactions[0]['merchant']}")
# print(f"First Card Type: {all_cards[0]['rewards']['categories']}")

def get_best_card(target_category, amount, cards_data):
    rankings = []
    
    for card in all_cards:
        card_name = card['name']
        base_rate = card['rewards']['base_rate']

        # check if the category exists in the card's specific rewards
        # generator expression to find the rate if it exists
        category_data = next(
            (cat for cat in card['rewards']['categories'] if cat['name'] == target_category), 
            None
        )
        
        # if category found, use its rate or otherwise, use base_rate
        active_rate = category_data['rate'] if category_data else base_rate
        
        # potential earnings
        points_earned = amount * active_rate
        
        rankings.append({
            "card": card_name,
            "rate": active_rate,
            "points_earned": points_earned
        })
    
    # Sort by points earned descending
    return sorted(rankings, key=lambda x: x['points_earned'], reverse=True)


total_points = 0

for first_txn in all_transactions:
    recommendations = get_best_card(first_txn['category'], first_txn['amount'], all_cards)

    total_points += recommendations[0]['points_earned']

    print(f"Transaction: {first_txn['merchant']} ({first_txn['category']}) - ${first_txn['amount']}")
    print(f"Recommended Card: {recommendations[0]['card']} at {recommendations[0]['rate']}x \n")

print(f"\nTotal Points Earned across all transactions: {round(total_points, 2)}")

#