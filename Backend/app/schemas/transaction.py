from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from app.models.transaction import TransactionType

class TransactionBase(BaseModel):
    amount: float = Field(..., gt=0, description="Amount must be strictly positive")
    type: TransactionType
    category: str = Field(..., min_length=1)
    date: Optional[datetime] = None
    notes: Optional[str] = None
    user_id: Optional[int] = 1

class TransactionCreate(TransactionBase):
    pass

class TransactionUpdate(BaseModel):
    amount: Optional[float] = Field(None, gt=0)
    category: Optional[str] = Field(None, min_length=1)
    date: Optional[datetime] = None
    notes: Optional[str] = None

class TransactionRead(TransactionBase):
    id: int

    class Config:
        from_attributes = True

class PaginatedTransactions(BaseModel):
    data: List[TransactionRead]
    total: int
    page: int
    limit: int

class CategoryBreakdown(BaseModel):
    category: str
    total: float

class MonthlyTotal(BaseModel):
    month: str # format YYYY-MM
    income: float
    expense: float

class SummaryResponse(BaseModel):
    total_income: float
    total_expense: float
    balance: float
    category_breakdown: List[CategoryBreakdown]
    monthly_totals: List[MonthlyTotal]
    recent_transactions: List[TransactionRead]
