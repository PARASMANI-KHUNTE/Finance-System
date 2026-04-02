from typing import Optional
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate, TransactionUpdate, PaginatedTransactions, TransactionRead
from app.repositories.transaction import TransactionRepository

class TransactionService:
    def __init__(self, session: Session):
        self.repository = TransactionRepository(session)

    def create_transaction(self, obj_in: TransactionCreate) -> Transaction:
        # Since pydantic handles basic data checks, we just pass to repo
        return self.repository.create(obj_in)

    def get_transaction(self, id: int, user_id: int) -> Transaction:
        transaction = self.repository.get_by_id(id=id, user_id=user_id)
        if not transaction:
            raise HTTPException(status_code=404, detail="Transaction not found")
        return transaction

    def update_transaction(self, id: int, user_id: int, obj_in: TransactionUpdate) -> Transaction:
        transaction = self.get_transaction(id=id, user_id=user_id)
        return self.repository.update(db_obj=transaction, obj_in=obj_in)

    def delete_transaction(self, id: int, user_id: int) -> None:
        transaction = self.get_transaction(id=id, user_id=user_id)
        self.repository.delete(db_obj=transaction)

    def get_transactions_paginated(
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
    ) -> PaginatedTransactions:
        if page < 1:
            raise HTTPException(status_code=400, detail="Page must be >= 1")
        if limit < 1 or limit > 100:
            raise HTTPException(status_code=400, detail="Limit must be between 1 and 100")
            
        allowed_sorts = ["date", "amount"]
        if sort_by not in allowed_sorts:
            raise HTTPException(status_code=400, detail=f"Sort by must be in {allowed_sorts}")

        transactions, total = self.repository.get_all_paginated(
            user_id=user_id,
            page=page,
            limit=limit,
            type=type,
            category=category,
            start_date=start_date,
            end_date=end_date,
            search=search,
            sort_by=sort_by,
            order=order
        )

        data = [TransactionRead.model_validate(t) for t in transactions]
        
        return PaginatedTransactions(
            data=data,
            total=total,
            page=page,
            limit=limit
        )
