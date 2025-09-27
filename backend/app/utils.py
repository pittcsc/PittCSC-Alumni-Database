import logging
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

import emails  # type: ignore
import jwt
from jinja2 import Template
from jwt.exceptions import InvalidTokenError

from app.core import security
from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class EmailData:
    html_content: str
    subject: str


def render_email_template(*, template_name: str, context: dict[str, Any]) -> str:
    template_str = (
        Path(__file__).parent / "email_templates" / "build" / template_name
    ).read_text()
    html_content = Template(template_str).render(context)
    return html_content


def send_email(
    *,
    email_to: str,
    subject: str = "",
    html_content: str = "",
) -> None:
    assert settings.emails_enabled, "no provided configuration for email variables"
    message = emails.Message(
        subject=subject,
        html=html_content,
        mail_from=(settings.EMAILS_FROM_NAME, settings.EMAILS_FROM_EMAIL),
    )
    smtp_options = {"host": settings.SMTP_HOST, "port": settings.SMTP_PORT}
    if settings.SMTP_TLS:
        smtp_options["tls"] = True
    elif settings.SMTP_SSL:
        smtp_options["ssl"] = True
    if settings.SMTP_USER:
        smtp_options["user"] = settings.SMTP_USER
    if settings.SMTP_PASSWORD:
        smtp_options["password"] = settings.SMTP_PASSWORD
    response = message.send(to=email_to, smtp=smtp_options)
    logger.info(f"send email result: {response}")




def generate_reset_password_email(email_to: str, email: str, token: str) -> EmailData:
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - Password recovery for user {email}"
    link = f"{settings.FRONTEND_HOST}/reset-password?token={token}"
    html_content = render_email_template(
        template_name="reset_password.html",
        context={
            "project_name": settings.PROJECT_NAME,
            "username": email,
            "email": email_to,
            "valid_hours": settings.EMAIL_RESET_TOKEN_EXPIRE_HOURS,
            "link": link,
        },
    )
    return EmailData(html_content=html_content, subject=subject)


def generate_new_account_email(
    email_to: str, username: str, password: str
) -> EmailData:
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - New account for user {username}"
    html_content = render_email_template(
        template_name="new_account.html",
        context={
            "project_name": settings.PROJECT_NAME,
            "username": username,
            "password": password,
            "email": email_to,
            "link": settings.FRONTEND_HOST,
        },
    )
    return EmailData(html_content=html_content, subject=subject)


def generate_password_reset_token(email: str) -> str:
    delta = timedelta(hours=settings.EMAIL_RESET_TOKEN_EXPIRE_HOURS)
    now = datetime.now(timezone.utc)
    expires = now + delta
    exp = expires.timestamp()
    encoded_jwt = jwt.encode(
        {"exp": exp, "nbf": now, "sub": email},
        settings.SECRET_KEY,
        algorithm=security.ALGORITHM,
    )
    return encoded_jwt


def verify_password_reset_token(token: str) -> str | None:
    try:
        decoded_token = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        return str(decoded_token["sub"])
    except InvalidTokenError:
        return None


def generate_connection_request_email(
    email_to: str,
    requested_name: str,
    requester_name: str,
    requester_title: str | None,
    requester_company: str | None,
    requester_location: str | None,
    requester_graduation_year: int | None,
    request_id: int,
    message: str | None = None
) -> EmailData:
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - New Connection Request from {requester_name}"
    accept_link = f"{settings.FRONTEND_HOST}/connections/accept/{request_id}"
    ignore_link = f"{settings.FRONTEND_HOST}/connections/ignore/{request_id}"
    html_content = render_email_template(
        template_name="connection_request.html",
        context={
            "project_name": settings.PROJECT_NAME,
            "requested_name": requested_name,
            "requester_name": requester_name,
            "requester_title": requester_title or "",
            "requester_company": requester_company or "",
            "requester_location": requester_location or "",
            "requester_graduation_year": requester_graduation_year or "",
            "accept_link": accept_link,
            "ignore_link": ignore_link,
            "message": message,
        },
    )
    return EmailData(html_content=html_content, subject=subject)


def generate_connection_acceptance_email(
    email_to: str,
    requester_name: str,
    accepted_name: str,
    contact_email: str | None,
    linkedin_url: str | None
) -> EmailData:
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - Your Connection Request was Accepted"
    html_content = render_email_template(
        template_name="connection_acceptance.html",
        context={
            "project_name": settings.PROJECT_NAME,
            "requester_name": requester_name,
            "accepted_name": accepted_name,
            "contact_email": contact_email,
            "linkedin_url": linkedin_url,
        },
    )
    return EmailData(html_content=html_content, subject=subject)
