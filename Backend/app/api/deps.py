from typing import Generator
from fastapi import Depends, Request
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.core.security import Role, get_current_role, verify_can_filter

def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

# Mocking user context for multi-tenant simulation
def get_current_user_id() -> int:
    return 1  # Simulated user id since we don't have full JWT auth

def get_role_and_verify_filters(
    request: Request,
    role: Role = Depends(get_current_role),
) -> Role:
    """Dependency that ensures Viewer isn't using unauthorized filters"""
    verify_can_filter(role, request)
    return role
