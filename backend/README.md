# PointPath Backend

A FastAPI backend for credit card rewards optimization targeting college students.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Add your Anthropic API key to `.env` (optional, for chatbot functionality):
```
ANTHROPIC_API_KEY=your_api_key_here
```

## Running the Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

Interactive API documentation: `http://localhost:8000/docs`

## Project Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI application entry point
│   ├── config.py               # Configuration and environment variables
│   ├── models.py               # Pydantic data models
│   ├── routers/                # API endpoints
│   │   ├── cards.py            # Card endpoints
│   │   ├── users.py            # User management endpoints
│   │   ├── transactions.py     # Transaction endpoints
│   │   ├── recommendations.py  # Recommendation endpoints
│   │   └── chat.py             # Chatbot endpoints
│   └── services/               # Business logic
│       ├── data_service.py     # JSON file operations
│       ├── transaction_analyzer.py  # Spending analysis
│       └── chatbot.py          # AI chatbot service
├── data/
│   ├── cards.json              # Available credit cards
│   └── users/                  # User data storage
└── requirements.txt
```

## API Endpoints

### Cards
- `GET /api/cards` - Get all available cards
- `GET /api/cards/{card_id}` - Get specific card details

### Users
- `GET /api/users/{user_id}` - Get user data
- `POST /api/users/{user_id}` - Create new user
- `GET /api/users/{user_id}/cards` - Get user's cards
- `POST /api/users/{user_id}/cards` - Add card to user's wallet
- `DELETE /api/users/{user_id}/cards/{card_id}` - Remove card from user's wallet

### Transactions
- `POST /api/transactions/import` - Import transactions for a user
- `GET /api/transactions/user/{user_id}/analysis` - Get spending analysis

### Recommendations
- `POST /api/recommendations/transaction` - Get card recommendation for a purchase
- `GET /api/recommendations/new-cards/{user_id}` - Get new card recommendations
- `GET /api/recommendations/categories` - Get list of spending categories

### Chat
- `POST /api/chat` - Send message to chatbot
- `GET /api/chat/intro/{user_id}` - Get chatbot intro message
