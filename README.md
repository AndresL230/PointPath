# PointPath - Smart Credit Card Rewards Optimization

![Preview](landingpage.png)

![Python](https://img.shields.io/badge/-Python-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/-Next.js-000000?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)
![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Git](https://img.shields.io/badge/-Git-F05032?style=flat-square&logo=git&logoColor=white)

A credit card rewards optimization platform that helps users maximize their credit card rewards by analyzing spending patterns and recommending the best cards to use for each transaction.

## Overview

PointPath analyzes your transaction history across multiple credit cards and provides intelligent recommendations to help you:

- **Optimize existing card usage** – Get real-time recommendations on which card to use for any purchase
- **Discover new cards** – Receive personalized suggestions for new credit cards based on your spending habits
- **Analyze spending patterns** – Understand your spending across different categories
- **Maximize rewards** – Ensure you're always earning the maximum points, cash back, or miles

## Features

- **Transaction Recommendations** – Input a transaction amount and category, and PointPath recommends which of your existing cards will earn the most rewards
- **New Card Recommendations** – Using sophisticated engagement scoring (based on spending amount, frequency, and consistency), PointPath suggests the top 3 new credit cards you should apply for
- **Spending Analysis** – View detailed breakdowns of your spending by category
- **AI Chatbot** – An AI-powered assistant that helps you understand your spending and provides personalized financial insights

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

## Tech Stack

- **Frontend:** Next.js + React with TypeScript, Tailwind CSS
- **Backend:** Python FastAPI with JSON data storage
- **AI:** Anthropic Claude API for chatbot
- **Styling:** Capital One-inspired design system

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
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│   └── package.json
└── README.md
```

## Usage

**Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API will be available at:
- API: `http://localhost:8000`
- Interactive docs: `http://localhost:8000/docs`

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Recommendations
- `GET /api/recommendations/transaction` – Get best card for a transaction
- `GET /api/recommendations/new-cards/{user_id}` – Get top 3 new card recommendations
- `GET /api/recommendations/categories` – Get list of spending categories
- `GET /api/recommendations/analyze/{user_id}` – Analyze all user transactions

### Users
- `GET /api/users/{user_id}` – Get user profile
- `GET /api/users/{user_id}/cards` – Get user's cards

### Transactions
- `GET /api/transactions/user/{user_id}/analysis` – Get spending analysis

### Chat
- `GET /api/chat/intro/{user_id}` – Get chatbot intro message

### Cards
- `GET /api/cards` – Get all available cards
- `GET /api/cards/{card_id}` – Get specific card details

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
- **S (Spending Score):** Percentage of total spending in each category
- **F (Frequency Score):** How often transactions occur in each category (logarithmic scale)
- **T (Timing Consistency):** How regular/consistent transactions are

The algorithm then:
1. Analyzes user's transaction history across all categories
2. Calculates engagement scores for each category
3. For each available card, computes expected annual rewards based on user's spending patterns
4. Accounts for annual fees in the final score
5. Returns top 3 cards ranked by net value (rewards - fees)

## Environment Variables

Create a `.env` file in the backend directory:

```
ANTHROPIC_API_KEY=your_api_key_here
```

## License

Copyright (c) 2026
