from sqlmodel import Session, create_engine, SQLModel, select, text

from app import crud
from app.core.config import settings
from app.models import User, UserCreate, Email

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))

def init_db(session: Session) -> None:
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-commenting the next lines
    # from sqlmodel import SQLModel

    # This works because the models are already imported and registered from app.models
    SQLModel.metadata.create_all(engine)
    # SQLite does not enforce foreign keys unless explicitly enabled. Postgres
    # enforces them natively, so this pragma is SQLite-only.
    if settings.use_sqlite:
        with engine.connect() as connection:
            connection.execute(text("PRAGMA foreign_keys=ON"))

    user = session.exec(
        select(User).where(User.email == settings.FIRST_SUPERUSER)
    ).first()
    if not user:
        user_in = UserCreate(
            email=settings.FIRST_SUPERUSER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            is_superuser=True,
            full_name=settings.FIRST_SUPERUSER_NAME
        )
        user = crud.create_user(session=session, user_create=user_in)
        # Create new email entry
        new_email = Email(
            email=user.email, 
            preferred=True,
            user_id=user.id
        )
        session.add(new_email)
        session.commit()
        session.refresh(new_email)