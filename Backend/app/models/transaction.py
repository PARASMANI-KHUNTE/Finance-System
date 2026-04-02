import enum
from datetime import datetime
from sqlalchemy import Column, Integer, Float, String, Text, DateTime, Enum
from app.db.base import Base

class TransactionType(str, enum.Enum):
    INCOME = "income"
    EXPENSE = "expense"

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, default=1)  # Defaulting 1 for simple scenarios without explicit auth
    amount = Column(Float, nullable=False)
    type = Column(Enum(TransactionType), nullable=False, index=True)
    category = Column(String, index=True, nullable=False)
    date = Column(DateTime, default=datetime.utcnow, index=True)
    notes = Column(Text, nullable=True)
