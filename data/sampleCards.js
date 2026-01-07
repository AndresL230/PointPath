{
  "cards": [
    {
      "id": "amex-gold",
      "name": "American Express Gold Card",
      "issuer": "American Express",
      "network": "Amex",
      "annual_fee": 250,
      
      "signup_bonus": {
        "amount": 60000,
        "type": "points",
        "minimum_spend": 6000,
        "time_period_days": 180
      },
      
      "rewards": {
        "base_rate": 1,
        "categories": [
          { "name": "dining", "rate": 4 },
          { "name": "groceries", "rate": 4, "annual_cap": 25000 },
          { "name": "flights", "rate": 3 },
          { "name": "hotels", "rate": 3 }
        ]
      },
      
      "credits": [
        { "name": "Uber Cash", "amount": 120, "frequency": "monthly" },
        { "name": "Dining Credit", "amount": 120, "frequency": "monthly" },
        { "name": "Dunkin Credit", "amount": 84, "frequency": "monthly" }
      ]
    },
    
    {
      "id": "chase-sapphire-preferred",
      "name": "Chase Sapphire Preferred",
      "issuer": "Chase",
      "network": "Visa",
      "annual_fee": 95,
      
      "signup_bonus": {
        "amount": 60000,
        "type": "points",
        "minimum_spend": 4000,
        "time_period_days": 90
      },
      
      "rewards": {
        "base_rate": 1,
        "categories": [
          { "name": "travel", "rate": 5 },
          { "name": "dining", "rate": 3 },
          { "name": "streaming", "rate": 3 },
          { "name": "groceries", "rate": 3 }
        ]
      },
      
      "credits": [
        { "name": "Hotel Credit", "amount": 50, "frequency": "annual" }
      ]
    }
  ]
}