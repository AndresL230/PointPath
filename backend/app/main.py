from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import cards, users, transactions, recommendations, chat

app = FastAPI(
    title="PointPath API",
    description="Credit card rewards optimization API for college students",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cards.router)
app.include_router(users.router)
app.include_router(transactions.router)
app.include_router(recommendations.router)
app.include_router(chat.router)


@app.get("/")
def root():
    return {
        "message": "PointPath API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
