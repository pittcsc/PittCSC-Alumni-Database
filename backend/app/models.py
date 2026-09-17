# example from template

import uuid

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel
from datetime import datetime, timezone
from typing import List, Optional

# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: Optional[str] = Field(default=None, max_length=255)

# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)

class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: Optional[str] = Field(default=None, max_length=255)

# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    full_name: Optional[str] = Field(default=None, max_length=255)
    email: Optional[EmailStr] = Field(default=None, max_length=255)  # type: ignore
    location: Optional[str] = None
    graduation_year: Optional[int] = None
    linkedin_url: Optional[str] = None
    personal_website: Optional[str] = None
    current_company: Optional[str] = None
    current_role: Optional[str] = None
    profile_image: Optional[str] = None
    open_to_coffee_chats: bool = False
    open_to_mentorship: bool = False
    available_for_referrals: bool = False
    open_to_resume_review: bool = False
    bio: Optional[str] = None
    is_alumni: Optional[bool] = False
    profile_visible: Optional[bool] = None
    profile_completed: Optional[bool] = None
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserUpdateMe(SQLModel):
    full_name: Optional[str] = Field(default=None, max_length=255)
    email: Optional[EmailStr] = Field(default=None, max_length=255)
    location: Optional[str] = None
    graduation_year: Optional[int] = None
    linkedin_url: Optional[str] = None
    personal_website: Optional[str] = None
    current_company: Optional[str] = None
    current_role: Optional[str] = None
    profile_image: Optional[str] = None
    open_to_coffee_chats: bool = False
    open_to_mentorship: bool = False
    available_for_referrals: bool = False
    open_to_resume_review: bool = False
    bio: Optional[str] = None
    is_alumni: Optional[bool] = False
    profile_visible: Optional[bool] = None
    profile_completed: Optional[bool] = None
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Database model
class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True) # auto increments because sqlalchemy is dumb
    hashed_password: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    location: Optional[str] = None
    graduation_year: Optional[int] = None
    linkedin_url: Optional[str] = None
    personal_website: Optional[str] = None
    current_company: Optional[str] = None
    current_role: Optional[str] = None
    profile_image: Optional[str] = None
    open_to_coffee_chats: bool = False
    open_to_mentorship: bool = False
    available_for_referrals: bool = False
    open_to_resume_review: bool = False
    bio: Optional[str] = None
    is_alumni: bool = False
    profile_completed: bool = False
    profile_visible: bool = True

# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: int | None = Field(default=None, primary_key=True)
    location: Optional[str]
    graduation_year: Optional[int]
    linkedin_url: Optional[str]
    personal_website: Optional[str]
    current_company: Optional[str] 
    current_role: Optional[str]
    profile_image: Optional[str]
    open_to_coffee_chats: Optional[bool]
    open_to_mentorship: Optional[bool]
    available_for_referrals: Optional[bool]
    open_to_resume_review: Optional[bool]
    bio: Optional[str]
    is_alumni: Optional[bool]
    profile_visible: Optional[bool]
    profile_completed: Optional[bool]

class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int

class EmailBase(SQLModel):
    email: EmailStr = Field(primary_key=True)
    preferred: bool = False

class Email(EmailBase, table=True):
    user_id: int = Field(foreign_key="user.id", nullable=False)

class EmailsPublic(SQLModel):
    data: List[EmailBase]
    count: int

# COMPANIES
class Company(SQLModel, table=True):
    # company lookup: https://api.orb-intelligence.com/docs/
    # don't know if its down
    name: str = Field(unique=True, primary_key=True)
    # company logos: https://clearbit.com/docs#logo-api
    # logo.dev (use on the frontend tbh)
    image_url: Optional[str] = None

class CompaniesPublic(SQLModel):
    data: list[Company]
    count: int

# INTERVIEWS
class Interview(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True) # order is implicit as id is sorted
    user_id: int = Field(foreign_key="user.id", nullable=False)
    company_name: str = Field(foreign_key="company.name", nullable=False)
    role: str
    internship: bool
    season: datetime # someone can interview with same company and role so need the season
    passed: bool = True
    note: Optional[str]
    date: Optional[datetime]
class InterviewsPublic(SQLModel):
    data: list[Interview]
    count: int

# FULL TIME
class Employment(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", nullable=False)
    company_name: str = Field(foreign_key="company.name")
    type: str = Field(regex="^(internship|full time)$")
    start: datetime
    end: Optional[datetime] = None

class EmploymentsCreate(SQLModel):
    company_name: str = Field(foreign_key="company.name")
    type: str = Field(regex="^(internship|full time)$")
    start: datetime
    end: Optional[datetime] = None

class EmploymentCounts(SQLModel):
    company_name: str = Field(foreign_key="company.name")
    employee_count: int

class EmploymentsPublic(SQLModel):
    data: list[EmploymentCounts]
    count: int

class EmploymentsList(SQLModel):
    data: list[Employment]
    count: int

# CONNECTION REQUESTS
class Request(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    requester_id: int = Field(foreign_key="user.id", nullable=False)
    requested_id: int = Field(foreign_key="user.id", nullable=False)
    message: str | None

class RequestPublic(SQLModel):
    requester_id: int = Field(foreign_key="user.id", nullable=False)
    requested_id: int = Field(foreign_key="user.id", nullable=False)
    message: str | None

class CompletedRequest(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    requester_id: int = Field(foreign_key="user.id", nullable=False)
    requested_id: int = Field(foreign_key="user.id", nullable=False)

# # Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)