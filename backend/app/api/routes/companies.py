from fastapi import APIRouter, HTTPException
from pydantic import ValidationError
from typing import Any
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.models import (
    Company, 
    CompaniesPublic, 
    User, 
    UsersPublic, 
    Employment, 
    EmploymentsPublic,
    EmploymentCounts
)

router = APIRouter(prefix="/companies", tags=["companies"])

@router.get("/", response_model=CompaniesPublic)
def read_companies(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
):
    """
    retrieves companies
    """
    count_statement = (
            select(func.count())
            .select_from(Company)
        )
    count = session.exec(count_statement).one()

    statement = select(Company).select_from(Company)
    companies = session.exec(statement).all()
    
    return CompaniesPublic(data=companies, count=count)


@router.get("/employee_counts", response_model=EmploymentsPublic)
def read_employee_counts(
    session: SessionDep, current_user: CurrentUser
):
    """
    Get current employee counts for all companies, sorted by count in descending order.
    """
    statement = (
        select(
            Company.name.label("company_name"),
            func.count(User.id).label("employee_count")
        )
        .select_from(Company)
        .outerjoin(User, Company.name == User.current_company)
        .group_by(Company.name)
        .order_by(func.count(User.id).desc())
    )
    
    results = session.exec(statement).all()
    
    counts = [
        EmploymentCounts(company_name=row.company_name, employee_count=row.employee_count)
        for row in results
    ]
    
    return EmploymentsPublic(data=counts, count=len(counts))


@router.get("/{name}", response_model=Company)
def read_company(
    name: str, session: SessionDep, current_user: CurrentUser
):
    """
    retrieves a single company by name
    """
    db_company = session.get(Company, name)
    if not db_company:
        raise HTTPException(
            status_code=404,
            detail="The company with this name does not exist in the system",
        )
    return db_company


@router.post("/", response_model=Company)
def create_company(
    *, session: SessionDep, company_in: Company
) -> Any:
    """
    Create new company.
    """

    try:
        company = Company.model_validate(company_in)
    except ValidationError as e:
            raise HTTPException(
                status_code=400,
                detail=f"Validation error for company data: {e.errors()}"
            )

    statement = select(Company).where(Company.name == company.name)
    old_company = session.exec(statement).first()
    if old_company:
        raise HTTPException(
            status_code=400,
            detail="A company with this name already exists in the system.",
        )

    session.add(company)
    session.commit()
    session.refresh(company)
    return company

@router.get("/all_employees/{name}", response_model=UsersPublic)
def read_employees(
    name: str, session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
):
    """
    retrieves everyone who has worked at the company (via employment history)
    """
    users_statement = (
            select(Employment.user_id)
            .select_from(Employment)
            .where(Employment.company_name == name)
        )
    user_ids = session.exec(users_statement).all()

    statement = select(User).select_from(User).where(
        User.id.in_(user_ids)).offset(skip).limit(limit)
    users = session.exec(statement).all()

    return UsersPublic(data=users, count=len(users))

@router.get("/current_employees/{name}", response_model=UsersPublic)
def read_current_employees(
    name: str, session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
):
    """
    retrieves people who work at the company.
    """
    count_statement = (
            select(func.count())
            .select_from(User)
            .where(User.current_company == name, User.id != current_user.id)
        )
    count = session.exec(count_statement).one()

    statement = select(User).select_from(User).where(
        User.current_company == name, User.id != current_user.id).offset(skip).limit(limit)
    users = session.exec(statement).all()

    return UsersPublic(data=users, count=count)