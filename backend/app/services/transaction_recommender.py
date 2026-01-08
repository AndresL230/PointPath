import json
import re

def load_data(file_path):
    with open(file_path, 'r') as file:
        content = file.read().strip()
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            match = re.search(r'\[.*\]|\{.*\}', content, re.DOTALL)
            if match:
                return json.loads(match.group(0))
            raise ValueError(f"Could not parse JSON in {file_path}")

# load data 
user_data = load_data('backend/data/users/user01.json')
master_cards_data = load_data('backend/data/cards.json')

# filter cards
owned_card_ids = [c['card_id'] for c in user_data['cards']]

# only keep cards from master list if user owns them
user_owned_cards = [
    card for card in master_cards_data['cards'] 
    if card['id'] in owned_card_ids
]

def get_best_card(target_category, amount, available_cards):
    rankings = []
    
    # loop only through cards the user owns
    for card in available_cards:
        card_name = card['name']
        base_rate = card['rewards']['base_rate']

        category_data = next(
            (cat for cat in card['rewards']['categories'] if cat['name'] == target_category), 
            None
        )
        
        active_rate = category_data['rate'] if category_data else base_rate
        points_earned = amount * active_rate
        
        rankings.append({
            "card": card_name,
            "rate": active_rate,
            "points_earned": points_earned
        })
    
    return sorted(rankings, key=lambda x: x['points_earned'], reverse=True)

# process transactions
total_points = 0
all_transactions = user_data['transactions']

for txn in all_transactions:
    # pass user_owned_cards instead of the whole master list
    recommendations = get_best_card(txn['category'], txn['amount'], user_owned_cards)

    if recommendations:
        best_choice = recommendations[0]
        total_points += best_choice['points_earned']

        print(f"Transaction: {txn['merchant']} ({txn['category']}) - ${txn['amount']}")
        print(f"Recommended Card: {best_choice['card']} at {best_choice['rate']}x \n")

print(f"Total Points Earned: {round(total_points, 2)}")