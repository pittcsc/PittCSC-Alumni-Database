from fastapi import APIRouter, Depends
from pydantic.networks import EmailStr

from app.api.deps import get_current_active_superuser
from app.models import Message
from app.utils import send_email

router = APIRouter(prefix="/utils", tags=["utils"])




@router.get("/health-check/")
async def health_check() -> bool:
    return True