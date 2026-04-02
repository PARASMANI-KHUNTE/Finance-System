from collections import defaultdict
from sqlalchemy.orm import Session
from app.repositories.transaction import TransactionRepository
from app.schemas.transaction import SummaryResponse, CategoryBreakdown, MonthlyTotal, TransactionRead
from app.models.transaction import TransactionType
from app.utils.date_helpers import get_month_str

class SummaryService:
    def __init__(self, session: Session):
        self.repository = TransactionRepository(session)

    def get_summary(self, user_id: int) -> SummaryResponse:
        transactions = self.repository.get_all_for_summary(user_id=user_id)
        
        total_income = 0.0
        total_expense = 0.0
        category_map = defaultdict(float)
        monthly_map = defaultdict(lambda: {"income": 0.0, "expense": 0.0})

        for t in transactions:
            month_str = get_month_str(t.date)
            if t.type == TransactionType.INCOME:
                total_income += t.amount
                monthly_map[month_str]["income"] += t.amount
                category_map[t.category] += t.amount
            elif t.type == TransactionType.EXPENSE:
                total_expense += t.amount
                monthly_map[month_str]["expense"] += t.amount
                category_map[t.category] += t.amount

        balance = total_income - total_expense

        # Sort categories by highest amount
        category_breakdown = [
            CategoryBreakdown(category=k, total=v) for k, v in category_map.items()
        ]
        category_breakdown.sort(key=lambda x: x.total, reverse=True)

        monthly_totals = [
            MonthlyTotal(month=k, income=v["income"], expense=v["expense"]) 
            for k, v in monthly_map.items()
        ]
        # Sort monthly totals chronologically
        monthly_totals.sort(key=lambda x: x.month)
        
        # Recent transactions (last 5 based on date)
        # Note: In a huge DB, sorting in python is bad, but for full summary aggregation we typically need to do this anyway unless DB handles group by
        sorted_recent = sorted(transactions, key=lambda x: x.date, reverse=True)[:5]
        recent_txs = [TransactionRead.model_validate(t) for t in sorted_recent]

        return SummaryResponse(
            total_income=total_income,
            total_expense=total_expense,
            balance=balance,
            category_breakdown=category_breakdown,
            monthly_totals=monthly_totals,
            recent_transactions=recent_txs
        )
