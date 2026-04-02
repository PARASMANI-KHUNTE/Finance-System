import enum
from typing import Optional
from fastapi import Request, HTTPException, Security
from fastapi.security import APIKeyHeader

class Role(str, enum.Enum):
    ADMIN = "admin"
    ANALYST = "analyst"
    VIEWER = "viewer"

header_scheme = APIKeyHeader(name="X-Role", auto_error=False)

def get_current_role(role_header: str = Security(header_scheme)) -> Role:
    if not role_header:
        raise HTTPException(status_code=403, detail="X-Role header is missing")
    
    try:
        role = Role(role_header.lower())
        return role
    except ValueError:
        raise HTTPException(status_code=403, detail="Invalid role specified")

def verify_can_create_edit_delete(role: Role):
    if role != Role.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions. Admin role required.")

def verify_can_filter(role: Role, request: Request):
    if role == Role.VIEWER:
        # Viewer gets GET /transactions and GET /summary ONLY, no filters
        # We can check the query params of the request. Viewer is only allowed 'page' and 'limit'
        allowed_params = {"page", "limit"}
        query_params = set(request.query_params.keys())
        
        if not query_params.issubset(allowed_params):
            raise HTTPException(status_code=403, detail="Viewers are not allowed to use filters")
