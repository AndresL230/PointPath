# PointPath

**PointPath** is a credit card rewards optimization platform that helps users maximize their credit card rewards by analyzing their spending patterns and recommending the best cards to use for each transaction.

## Overview

PointPath analyzes your transaction history across multiple credit cards and provides intelligent recommendations to help you:
- **Optimize existing card usage**: Get real-time recommendations on which card to use for any purchase
- **Discover new cards**: Receive personalized suggestions for new credit cards based on your spending habits
- **Analyze spending patterns**: Understand your spending across different categories
- **Maximize rewards**: Ensure you're always earning the maximum points, cash back, or miles

## Features

### 1. Transaction Recommendations
Input a transaction amount and category, and PointPath recommends which of your existing cards will earn the most rewards.

### 2. New Card Recommendations
Using sophisticated engagement scoring (based on spending amount, frequency, and consistency), PointPath suggests the top 3 new credit cards you should apply for to maximize your rewards.

### 3. Spending Analysis
View detailed breakdowns of your spending by category, helping you understand where your money goes.

### 4. AI Chatbot
An AI-powered assistant that helps you understand your spending and provides personalized financial insights.

---

## Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                       │
│  ┌───────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │  Card Wallet  │  │ Transaction  │  │  Recommendations   │   │
│  │     Page      │  │  Input Form  │  │       Page         │   │
│  └───────┬───────┘  └──────┬───────┘  └─────────┬──────────┘   │
│          │                 │                    │              │
└──────────┼─────────────────┼────────────────────┼──────────────┘
           │                 │                    │
           │                 ▼                    │
           │         ┌───────────────┐            │
           └────────►│   API Layer   │◄───────────┘
                     │  (FastAPI)    │
                     └───────┬───────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐   ┌────────────────┐   ┌──────────────────┐
│ Transaction   │   │  New Card      │   │  Data Service    │
│ Recommender   │   │  Recommender   │   │  (Read-Only)     │
└───────┬───────┘   └────────┬───────┘   └─────────┬────────┘
        │                    │                     │
        └────────────────────┼─────────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   JSON Storage  │
                    │  - users/*.json │
                    │  - cards.json   │
                    └─────────────────┘
```

### Key Components

#### Backend (FastAPI)
- **Routers**: Handle HTTP endpoints for different features
  - `recommendations.py`: Card and transaction recommendations
  - `users.py`: User data retrieval
  - `transactions.py`: Transaction analysis
  - `chat.py`: AI chatbot integration
  - `cards.py`: Card catalog

- **Services**: Business logic layer
  - `transaction_recommender.py`: Recommends best card for a given transaction
  - `new_card_recommender.py`: Recommends new cards using engagement scoring algorithm
  - `transaction_analyzer.py`: Analyzes spending patterns
  - `data_service.py`: Data access layer (read-only)
  - `chatbot.py`: AI-powered financial assistant

- **Models**: Pydantic data models for validation and serialization

#### Frontend (React)
- Component-based UI
- Card catalog and wallet management
- Transaction input forms
- Recommendation displays

---

## Project Structure

```
PointPath/
├── backend/
│   ├── app/
│   │   ├── routers/           # API endpoints
│   │   │   ├── recommendations.py
│   │   │   ├── users.py
│   │   │   ├── transactions.py
│   │   │   ├── chat.py
│   │   │   └── cards.py
│   │   ├── services/          # Business logic
│   │   │   ├── transaction_recommender.py
│   │   │   ├── new_card_recommender.py
│   │   │   ├── transaction_analyzer.py
│   │   │   ├── data_service.py
│   │   │   └── chatbot.py
│   │   ├── models.py          # Pydantic models
│   │   └── main.py            # FastAPI app entry point
│   ├── data/
│   │   ├── users/             # User data (JSON)
│   │   └── cards.json         # Credit card catalog
│   ├── venv/                  # Python virtual environment
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│   └── package.json
└── README.md
```

---

## Setup Instructions

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Activate virtual environment**
   ```bash
   source venv/bin/activate
   ```

3. **Install dependencies** (if not already installed)
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the FastAPI server**
   ```bash
   uvicorn app.main:app --reload
   ```

   The API will be available at:
   - API: `http://localhost:8000`
   - Interactive docs: `http://localhost:8000/docs`
   - Alternative docs: `http://localhost:8000/redoc`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

---

## API Endpoints

### Recommendations
- `GET /api/recommendations/transaction` - Get best card for a transaction
  - Query params: `user_id`, `amount`, `category`

- `GET /api/recommendations/new-cards/{user_id}` - Get top 3 new card recommendations

- `GET /api/recommendations/categories` - Get list of spending categories

- `GET /api/recommendations/analyze/{user_id}` - Analyze all user transactions

### Users
- `GET /api/users/{user_id}` - Get user profile
- `GET /api/users/{user_id}/cards` - Get user's cards

### Transactions
- `GET /api/transactions/user/{user_id}/analysis` - Get spending analysis

### Chat
- `GET /api/chat/intro/{user_id}` - Get chatbot intro message

### Cards
- `GET /api/cards` - Get all available cards
- `GET /api/cards/{card_id}` - Get specific card details

---

## How It Works

### Transaction Recommendation Algorithm
1. Retrieves all cards owned by the user
2. For each card, calculates the rewards rate for the specified category
3. Computes total points earned based on transaction amount
4. Returns cards ranked by points earned (best first)

### New Card Recommendation Algorithm
Uses a sophisticated **engagement scoring system**:

**Engagement Score = 0.55 × S + 0.25 × F + 0.20 × T**

Where:
- **S (Spending Score)**: Percentage of total spending in each category
- **F (Frequency Score)**: How often transactions occur in each category (logarithmic scale)
- **T (Timing Consistency)**: How regular/consistent transactions are (e.g., weekly groceries vs. random flights)

The algorithm then:
1. Analyzes user's transaction history across all categories
2. Calculates engagement scores for each category
3. For each available card, computes expected annual rewards based on user's spending patterns
4. Accounts for annual fees in the final score
5. Returns top 3 cards ranked by net value (rewards - fees)

---

## Data Models

### Card
- Basic info (name, issuer, network, annual fee)
- Rewards structure (base rate + category bonuses)
- Signup bonuses
- Credits and benefits

### User
- User ID
- List of owned cards
- Transaction history

### Transaction
- Date, merchant, category
- Amount
- Card used

---

## Environment Variables

Create a `.env` file in the backend directory:

```
ANTHROPIC_API_KEY=your_api_key_here
```

---

## Development Notes

- **Read-Only Mode**: All POST/DELETE endpoints and write methods are currently commented out to prevent data modification during development
- **Data Storage**: Currently uses JSON files for simplicity; can be migrated to a database in the future
- **AI Integration**: Uses Anthropic's Claude API for the chatbot feature

---

## Future Enhancements

- Database integration (PostgreSQL/MongoDB)
- User authentication and authorization
- Transaction import from banks/credit card companies
- Advanced analytics and visualizations
- Mobile app
- Real-time rewards tracking
- Multi-currency support

---

## License

