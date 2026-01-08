from fastapi import APIRouter
from app.models import TransactionImportRequest, User, SpendingAnalysis
from app.services.data_service import data_service
from app.services.transaction_analyzer import transaction_analyzer

router = APIRouter(prefix="/api/transactions", tags=["transactions"])


@router.post("/import", response_model=User)
def import_transactions(request: TransactionImportRequest):
    user = data_service.add_transactions(request.user_id, request.transactions)
    return user


@router.get("/user/{user_id}/analysis", response_model=SpendingAnalysis)
def get_transaction_analysis(user_id: str):
    analysis = transaction_analyzer.analyze_spending(user_id)
    return analysis
