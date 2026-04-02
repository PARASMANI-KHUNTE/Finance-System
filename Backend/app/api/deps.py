from fastapi import Depends, Request
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import Role, get_current_role, verify_can_filter


def get_current_user_id() -> int:
    return 1


def get_role_and_verify_filters(
    request: Request,
    role: Role = Depends(get_current_role),
) -> Role:
    verify_can_filter(role, request)
    return role
