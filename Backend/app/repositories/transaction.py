from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import select, func, desc, or_

from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate, TransactionUpdate

class TransactionRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, obj_in: TransactionCreate) -> Transaction:
        # Ensure date defaults correctly
        db_obj = Transaction(
            amount=obj_in.amount,
            type=obj_in.type,
            category=obj_in.category,
            notes=obj_in.notes,
            user_id=obj_in.user_id,
        )
        if obj_in.date:
            db_obj.date = obj_in.date
            
        self.session.add(db_obj)
        self.session.commit()
        self.session.refresh(db_obj)
        return db_obj

    def get_by_id(self, id: int, user_id: int) -> Optional[Transaction]:
        return self.session.query(Transaction).filter(Transaction.id == id, Transaction.user_id == user_id).first()

    def update(self, db_obj: Transaction, obj_in: TransactionUpdate) -> Transaction:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        self.session.commit()
        self.session.refresh(db_obj)
        return db_obj

    def delete(self, db_obj: Transaction) -> None:
        self.session.delete(db_obj)
        self.session.commit()

    def get_all_paginated(
        self,
        user_id: int,
        page: int = 1,
        limit: int = 10,
        type: Optional[str] = None,
        category: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        search: Optional[str] = None,
        sort_by: str = "date",
        order: str = "desc"
    ) -> Tuple[List[Transaction], int]:
        
        query = self.session.query(Transaction).filter(Transaction.user_id == user_id)

        if type:
            query = query.filter(Transaction.type == type)
        if category:
            query = query.filter(Transaction.category.ilike(f"%{category}%"))
        if start_date:
            query = query.filter(Transaction.date >= start_date)
        if end_date:
            query = query.filter(Transaction.date <= end_date)
        if search:
            query = query.filter(
                or_(
                    Transaction.notes.ilike(f"%{search}%"),
                    Transaction.category.ilike(f"%{search}%")
                )
            )

        # Ordering
        sort_column = getattr(Transaction, sort_by, Transaction.date)
        if order.lower() == "desc":
            query = query.order_by(desc(sort_column))
        else:
            query = query.order_by(sort_column)

        total = query.count()
        offset = (page - 1) * limit
        transactions = query.offset(offset).limit(limit).all()

        return transactions, total

    def get_all_for_summary(self, user_id: int) -> List[Transaction]:
        return self.session.query(Transaction).filter(Transaction.user_id == user_id).all()
