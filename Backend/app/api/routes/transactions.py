from typing import Optional
from fastapi import APIRouter, Depends, Query, Path
from sqlalchemy.orm import Session

from app.api import deps
from app.schemas.transaction import TransactionCreate, TransactionUpdate, TransactionRead, PaginatedTransactions
from app.services.transaction import TransactionService
from app.core.security import Role, verify_can_create_edit_delete

router = APIRouter()

@router.post("", response_model=TransactionRead, status_code=201)
def create_transaction(
    transaction_in: TransactionCreate,
    db: Session = Depends(deps.get_db),
    user_id: int = Depends(deps.get_current_user_id),
    role: Role = Depends(deps.get_current_role)
):
    verify_can_create_edit_delete(role)
    service = TransactionService(db)
    # Ensure assigning correct user_id
    transaction_in.user_id = user_id
    return service.create_transaction(transaction_in)

@router.get("", response_model=PaginatedTransactions)
def read_transactions_paginated(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    type: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    sort_by: str = Query("date"),
    order: str = Query("desc"),
    db: Session = Depends(deps.get_db),
    user_id: int = Depends(deps.get_current_user_id),
    role: Role = Depends(deps.get_role_and_verify_filters) # Viewer checks run inside here
):
    service = TransactionService(db)
    return service.get_transactions_paginated(
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

@router.get("/{id}", response_model=TransactionRead)
def read_transaction(
    id: int = Path(...),
    db: Session = Depends(deps.get_db),
    user_id: int = Depends(deps.get_current_user_id),
    role: Role = Depends(deps.get_current_role) 
):
    service = TransactionService(db)
    return service.get_transaction(id, user_id)

@router.put("/{id}", response_model=TransactionRead)
def update_transaction(
    transaction_in: TransactionUpdate,
    id: int = Path(...),
    db: Session = Depends(deps.get_db),
    user_id: int = Depends(deps.get_current_user_id),
    role: Role = Depends(deps.get_current_role)
):
    verify_can_create_edit_delete(role)
    service = TransactionService(db)
    return service.update_transaction(id, user_id, transaction_in)

@router.delete("/{id}", status_code=204)
def delete_transaction(
    id: int = Path(...),
    db: Session = Depends(deps.get_db),
    user_id: int = Depends(deps.get_current_user_id),
    role: Role = Depends(deps.get_current_role)
):
    verify_can_create_edit_delete(role)
    service = TransactionService(db)
    service.delete_transaction(id, user_id)
