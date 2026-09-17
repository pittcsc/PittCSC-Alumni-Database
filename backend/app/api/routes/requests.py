from fastapi import APIRouter, HTTPException
from pydantic import ValidationError
from typing import Any
from sqlmodel import func, select
from app.core.config import settings

from app.api.deps import CurrentUser, SessionDep
from app.models import Request, RequestPublic, CompletedRequest, User, Email
from app.utils import generate_connection_request_email, send_email, generate_connection_acceptance_email
from datetime import datetime, timezone

router = APIRouter(prefix="/connections", tags=["connections"])

@router.post("/", response_model=Request)
async def create_connection_request(
    request_create: RequestPublic,
    session: SessionDep,
    current_user: CurrentUser
) -> Any:
    if request_create.requester_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only create requests for yourself.")
    if request_create.requester_id == request_create.requested_id:
        raise HTTPException(status_code=400, detail="You cannot request a connection with yourself.")
    
    # check if the reverse request already exists
    statement = select(Request).where(
        Request.requester_id == request_create.requested_id,
        Request.requested_id == request_create.requester_id)
    session_user = session.exec(statement).first()
    if session_user:
        raise HTTPException(
            status_code=400,
            detail="The user has already requested you",
        )
    
    conn = Request.model_validate(request_create)
    session.add(conn)
    session.commit()
    session.refresh(conn)
    
    # get the requested user's information
    requested_user = session.get(User, request_create.requested_id)
    if not requested_user:
        raise HTTPException(status_code=404, detail="Requested user not found")
    
    # get the requested user's preferred email
    preferred_email = session.exec(
        select(Email).where(Email.user_id == requested_user.id, Email.preferred == True)
    ).first()
    
    if preferred_email and settings.emails_enabled:
        # send email notification
        email_data = generate_connection_request_email(
            email_to=preferred_email.email,
            requested_name=requested_user.full_name or requested_user.email,
            requester_name=current_user.full_name or current_user.email,
            requester_title=current_user.current_role,
            requester_company=current_user.current_company,
            requester_location=current_user.location,
            requester_graduation_year=current_user.graduation_year,
            request_id=conn.id,
            message=request_create.message
        )
        send_email(
            email_to=preferred_email.email,
            subject=email_data.subject,
            html_content=email_data.html_content,
        )
    
    return conn

@router.delete("/{connection_id}")
async def delete_connection_request(
    connection_id: int,
    session: SessionDep,
    current_user: CurrentUser
) -> Any:
    connection_request = session.get(Request, connection_id)
    if not connection_request:
        raise HTTPException(status_code=404, detail="Connection request not found.")
    if connection_request.requester_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only delete requests you created.")
    
    session.delete(connection_request)
    session.commit()
    return {"detail": "Connection request deleted successfully."}

@router.post("/accept/{request_id}")
async def accept_request(
    request_id: int,
    session: SessionDep,
    current_user: CurrentUser
) -> Any:
    connection_request = session.get(Request, request_id)
    if not connection_request:
        raise HTTPException(status_code=404, detail="Connection request not found.")
    if connection_request.requested_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only accept requests for yourself.")
    
    # create the completed request
    conn = CompletedRequest(
        requester_id=connection_request.requester_id,
        requested_id=connection_request.requested_id
    )
    session.add(conn)
    
    # get requester's information for the acceptance email
    requester = session.get(User, connection_request.requester_id)
    if not requester:
        raise HTTPException(status_code=404, detail="Requester not found")
    
    # get requester's preferred email
    requester_email = session.exec(
        select(Email).where(Email.user_id == requester.id, Email.preferred == True)
    ).first()
    
    # get current user's preferred contact info
    preferred_email = session.exec(
        select(Email).where(Email.user_id == current_user.id, Email.preferred == True)
    ).first()
    
    if requester_email and settings.emails_enabled:
        # send acceptance email to requester
        email_data = generate_connection_acceptance_email(
            email_to=requester_email.email,
            requester_name=requester.full_name or requester.email,
            accepted_name=current_user.full_name or current_user.email,
            contact_email=preferred_email.email if preferred_email else None,
            linkedin_url=current_user.linkedin_url
        )
        send_email(
            email_to=requester_email.email,
            subject=email_data.subject,
            html_content=email_data.html_content,
        )
    
    # Delete the original request
    session.delete(connection_request)
    session.commit()
    session.refresh(conn)
    
    return conn

@router.post("/ignore/{request_id}")
async def ignore_request(
    request_id: int,
    session: SessionDep,
    current_user: CurrentUser
) -> Any:
    connection_request = session.get(Request, request_id)
    if not connection_request:
        raise HTTPException(status_code=404, detail="Connection request not found.")
    if connection_request.requested_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only ignore requests for yourself.")
    
    session.delete(connection_request)
    session.commit()
    return {"detail": "Connection request ignored successfully."}

@router.get("/pending/incoming")
async def incoming_pending_requests(
    session: SessionDep,
    current_user: CurrentUser,
) -> Any:
    """List connection requests sent TO the current user that are still pending
    (not yet accepted or ignored), enriched with the requester's basic info."""
    requests = session.exec(
        select(Request).where(Request.requested_id == current_user.id)
    ).all()

    results = []
    for req in requests:
        requester = session.get(User, req.requester_id)
        results.append(
            {
                "request_id": req.id,
                "created_at": req.created_at,
                "message": req.message,
                "requester_id": req.requester_id,
                "requester_name": requester.full_name if requester else None,
                "requester_email": requester.email if requester else None,
                "requester_company": requester.current_company if requester else None,
                "requester_role": requester.current_role if requester else None,
            }
        )
    return results


@router.get("/{user_id}/accepted_requests")
async def accepted_requests(
    user_id: int,
    session: SessionDep,
    current_user: CurrentUser
) -> Any:
    if user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only view your own connections.")
    
    statement = select(CompletedRequest).where(
        CompletedRequest.requester_id == user_id
    )
    connections = session.exec(statement).all()
    return connections

@router.get("/{user_id}/accepted_requested")
async def accepted_requested(
    user_id: int,
    session: SessionDep,
    current_user: CurrentUser
) -> Any:
    if user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only view your own connections.")
    
    statement = select(CompletedRequest).where(
        CompletedRequest.requested_id == user_id
    )
    connections = session.exec(statement).all()
    return connections