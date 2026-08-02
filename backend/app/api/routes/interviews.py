from fastapi import APIRouter, HTTPException
from pydantic import ValidationError
from typing import Any
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.models import Interview, InterviewsPublic

router = APIRouter(prefix="/interviews", tags=["interviews"])

@router.get("/", response_model=InterviewsPublic)
def read_interviews(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
):
    """
    retrieves ALL interviews
    """
    count_statement = (
            select(func.count())
            .select_from(Interview)
        )
    count = session.exec(count_statement).one()

    statement = select(Interview).select_from(Interview)
    companies = session.exec(statement).all()
    
    return InterviewsPublic(data=companies, count=count)


@router.post("/", response_model=Interview)
def create_interview(
    *, session: SessionDep, interview_in: Interview
) -> Any:
    """
    Create a new interview record for a user.
    """

    # try catch ValidationError??
    try:
        interview = Interview.model_validate(interview_in)
    except ValidationError as e:
            raise HTTPException(
                status_code=400,
                detail=f"Validation error for interview data: {e.errors()}"
            )


    session.add(interview)
    session.commit()
    session.refresh(interview)
    return interview

@router.post("/bulk", response_model=InterviewsPublic)
def create_interviews(
    *, session: SessionDep, interviews_in: InterviewsPublic
) -> Any:
    """
    Create multiple interviews from a list
    """
    interviews = []
    for interview_data in interviews_in.data:
        try:
            interview = Interview.model_validate(interview_data)
            session.add(interview)
            interviews.append(interview)
        except ValidationError as e:
            raise HTTPException(
                status_code=400,
                detail=f"Validation error for interview data: {e.errors()}"
            )


    session.commit()

    for interview in interviews:
        session.refresh(interview)

    # Return the count of interviews actually inserted in this request.
    return InterviewsPublic(data=interviews, count=len(interviews))