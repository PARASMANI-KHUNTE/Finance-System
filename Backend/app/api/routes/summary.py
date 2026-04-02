from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api import deps
from app.schemas.transaction import SummaryResponse
from app.services.summary import SummaryService
from app.core.security import Role

router = APIRouter()

@router.get("", response_model=SummaryResponse)
def get_summary(
    db: Session = Depends(deps.get_db),
    user_id: int = Depends(deps.get_current_user_id),
    # Viewers can see summary, so we don't apply verify filters here since summary endpoint doesn't accept filters currently
    role: Role = Depends(deps.get_current_role)
):
    service = SummaryService(db)
    return service.get_summary(user_id)
