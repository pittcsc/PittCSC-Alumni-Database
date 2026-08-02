import logging
import secrets
from datetime import datetime, timedelta, timezone
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import select

from app import crud
from app.api.deps import CurrentUser, SessionDep, get_current_active_superuser
from app.core import security
from app.core.config import settings
from app.core.security import get_password_hash, verify_password
from app.models import (
    Email,
    Message,
    NewPassword,
    OTPCode,
    OTPRequest,
    OTPRequestResponse,
    OTPVerify,
    Token,
    UserCreate,
    UserPublic,
)
from app.utils import (
    generate_otp_email,
    generate_password_reset_token,
    generate_reset_password_email,
    send_email,
    verify_password_reset_token,
)

logger = logging.getLogger(__name__)

router = APIRouter(tags=["login"])


@router.post("/login/access-token")
def login_access_token(
    session: SessionDep, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = crud.authenticate(
        session=session, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return Token(
        access_token=security.create_access_token(
            user.id, expires_delta=access_token_expires
        )
    )


@router.post("/login/test-token", response_model=UserPublic)
def test_token(current_user: CurrentUser) -> Any:
    """
    Test access token
    """
    return current_user


@router.post("/login/otp/request", response_model=OTPRequestResponse)
def request_otp(body: OTPRequest, session: SessionDep) -> Any:
    """
    Passwordless login step 1: email a 6-digit one-time code.

    Always returns 200 so we don't leak which emails have accounts. Any previous
    unused code for the email is invalidated. The code is stored hashed.
    """
    email = body.email.strip().lower()

    # Invalidate any prior unused codes for this email
    prior = session.exec(
        select(OTPCode).where(OTPCode.email == email, OTPCode.used == False)  # noqa: E712
    ).all()
    for code_row in prior:
        code_row.used = True
        session.add(code_row)

    code = f"{secrets.randbelow(1_000_000):06d}"
    otp = OTPCode(
        email=email,
        hashed_code=get_password_hash(code),
        expires_at=datetime.now(timezone.utc)
        + timedelta(minutes=settings.EMAIL_OTP_EXPIRE_MINUTES),
    )
    session.add(otp)
    session.commit()

    dev_code = None
    if settings.emails_enabled:
        email_data = generate_otp_email(
            email_to=email,
            code=code,
            valid_minutes=settings.EMAIL_OTP_EXPIRE_MINUTES,
        )
        send_email(
            email_to=email,
            subject=email_data.subject,
            html_content=email_data.html_content,
        )
    else:
        # Dev fallback: email is not configured, so surface the code for testing.
        logger.info(f"[DEV] OTP for {email}: {code}")
        if settings.ENVIRONMENT == "local":
            dev_code = code

    return OTPRequestResponse(
        message="If this email is valid, a login code has been sent.",
        dev_code=dev_code,
    )


@router.post("/login/otp/verify")
def verify_otp(body: OTPVerify, session: SessionDep) -> Token:
    """
    Passwordless login step 2: verify the code and return an access token.

    Creates a passwordless account on first successful verify (the code proves
    the user controls the email), so this doubles as sign-up.
    """
    email = body.email.strip().lower()

    otp = session.exec(
        select(OTPCode)
        .where(OTPCode.email == email, OTPCode.used == False)  # noqa: E712
        .order_by(OTPCode.created_at.desc())
    ).first()

    if not otp:
        raise HTTPException(status_code=400, detail="Invalid or expired code.")
    if otp.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="This code has expired.")
    if otp.attempts >= settings.EMAIL_OTP_MAX_ATTEMPTS:
        raise HTTPException(
            status_code=400, detail="Too many attempts. Request a new code."
        )

    if not verify_password(body.code, otp.hashed_code):
        otp.attempts += 1
        session.add(otp)
        session.commit()
        raise HTTPException(status_code=400, detail="Invalid or expired code.")

    otp.used = True
    session.add(otp)

    # Get-or-create the user (passwordless sign-up on first login)
    user = crud.get_user_by_email(session=session, email=email)
    if not user:
        user = crud.create_user(
            session=session,
            user_create=UserCreate(
                email=email,
                password=secrets.token_urlsafe(16),
                full_name=None,
            ),
        )
        session.add(Email(email=user.email, preferred=True, user_id=user.id))
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")

    session.commit()

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return Token(
        access_token=security.create_access_token(
            user.id, expires_delta=access_token_expires
        )
    )


@router.post("/password-recovery/{email}")
def recover_password(email: str, session: SessionDep) -> Message:
    """
    Password Recovery
    """
    user = crud.get_user_by_email(session=session, email=email)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this email does not exist in the system.",
        )
    password_reset_token = generate_password_reset_token(email=email)
    email_data = generate_reset_password_email(
        email_to=user.email, email=email, token=password_reset_token
    )
    send_email(
        email_to=user.email,
        subject=email_data.subject,
        html_content=email_data.html_content,
    )
    return Message(message="Password recovery email sent")


@router.post("/reset-password/")
def reset_password(session: SessionDep, body: NewPassword) -> Message:
    """
    Reset password
    """
    email = verify_password_reset_token(token=body.token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid token")
    user = crud.get_user_by_email(session=session, email=email)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this email does not exist in the system.",
        )
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    hashed_password = get_password_hash(password=body.new_password)
    user.hashed_password = hashed_password
    session.add(user)
    session.commit()
    return Message(message="Password updated successfully")


@router.post(
    "/password-recovery-html-content/{email}",
    dependencies=[Depends(get_current_active_superuser)],
    response_class=HTMLResponse,
)
def recover_password_html_content(email: str, session: SessionDep) -> Any:
    """
    HTML Content for Password Recovery
    """
    user = crud.get_user_by_email(session=session, email=email)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this username does not exist in the system.",
        )
    password_reset_token = generate_password_reset_token(email=email)
    email_data = generate_reset_password_email(
        email_to=user.email, email=email, token=password_reset_token
    )

    return HTMLResponse(
        content=email_data.html_content, headers={"subject:": email_data.subject}
    )