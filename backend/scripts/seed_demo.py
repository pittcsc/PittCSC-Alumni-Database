"""Seed the database with demo alumni for the directory.

Run from the backend directory:  ./venv/bin/python -m scripts.seed_demo

Idempotent: skips users that already exist. Safe to re-run.

Note: these are real PittCSC alumni names with their public role/company. We do
NOT fabricate interview histories or bios for them — those are left empty for the
real person to fill in. Graduation years / locations are best-effort placeholders.
"""
from datetime import datetime, timezone

from sqlmodel import Session, select

from app.core.db import engine
from app.crud import create_user
from app.models import (
    Company,
    Email,
    Employment,
    User,
    UserCreate,
)


def _logo(domain: str) -> str:
    return f"https://logo.clearbit.com/{domain}"


# name -> logo domain
COMPANIES = {
    "Anthropic": "anthropic.com",
    "Character.AI": "character.ai",
    "Google": "google.com",
    "Netflix": "netflix.com",
    "Roblox": "roblox.com",
    "AWS": "aws.amazon.com",
    "Plaid": "plaid.com",
    "Descope": "descope.com",
    "Sol Browser": "solbrowser.com",
    "Fragile": "fragile.dev",
    "University of Maryland": "umd.edu",
    "Harvard": "harvard.edu",
}


# email -> profile photo (served by the frontend from public/alumni/)
PFP = {
    "richie.goulazian@pitt.edu": "/alumni/richie.jpeg",
    "jeremy.luu@pitt.edu": "/alumni/jeremy.jpeg",
    "ritwik.gupta@pitt.edu": "/alumni/ritwik.jpeg",
    "quentin.romerolauro@pitt.edu": "/alumni/quentin.jpeg",
    "nij.patel@pitt.edu": "/alumni/nij.png",
    "brayden.nguyen@pitt.edu": "/alumni/brayden.jpeg",
    "olivia.wininsky@pitt.edu": "/alumni/olivia.jpeg",
    "rachel.jan@pitt.edu": "/alumni/rachel.jpeg",
    "delaney.scheidell@pitt.edu": "/alumni/delaney.jpeg",
    "michael.henry@pitt.edu": "/alumni/michael.jpeg",
    "julian.alamorosas@pitt.edu": "/alumni/julian.jpeg",
    "rohit.ganguly@pitt.edu": "/alumni/rohit.jpeg",
}


def _d(year: int, month: int = 6, day: int = 1) -> datetime:
    return datetime(year, month, day, tzinfo=timezone.utc)


# Each alum: profile dict + employment [(company, type, start, end)].
# interviews are intentionally empty for real people (not fabricated).
ALUMNI = [
    {
        "email": "richie.goulazian@pitt.edu", "full_name": "Richie Goulazian",
        "profile": dict(location="San Francisco, CA", graduation_year=2022,
            current_company="Anthropic", current_role="Member of Technical Staff",
            open_to_coffee_chats=True, open_to_mentorship=True, available_for_referrals=True),
        "company": "Anthropic", "since": 2022,
    },
    {
        "email": "jeremy.luu@pitt.edu", "full_name": "Jeremy Luu",
        "profile": dict(location="Menlo Park, CA", graduation_year=2025,
            current_company="Character.AI", current_role="Member of Technical Staff",
            open_to_coffee_chats=True, open_to_mentorship=True),
        "company": "Character.AI", "since": 2025,
    },
    {
        "email": "ritwik.gupta@pitt.edu", "full_name": "Ritwik Gupta",
        "profile": dict(location="College Park, MD", graduation_year=2016,
            current_company="University of Maryland", current_role="Assistant Professor",
            open_to_mentorship=True, open_to_resume_review=True),
        "company": "University of Maryland", "since": 2016,
    },
    {
        "email": "quentin.romerolauro@pitt.edu", "full_name": "Quentin Romero Lauro",
        "profile": dict(location="San Francisco, CA", graduation_year=2024,
            current_company="Sol Browser", current_role="Co-Founder & CEO",
            open_to_coffee_chats=True, open_to_mentorship=True),
        "company": "Sol Browser", "since": 2024,
    },
    {
        "email": "nij.patel@pitt.edu", "full_name": "Nij Patel",
        "profile": dict(location="San Francisco, CA", graduation_year=2024,
            current_company="Fragile", current_role="Engineer",
            open_to_coffee_chats=True, available_for_referrals=True),
        "company": "Fragile", "since": 2024,
    },
    {
        "email": "brayden.nguyen@pitt.edu", "full_name": "Brayden Nguyen",
        "profile": dict(location="San Mateo, CA", graduation_year=2025,
            current_company="Roblox", current_role="Software Engineer",
            open_to_coffee_chats=True, open_to_mentorship=True, open_to_resume_review=True),
        "company": "Roblox", "since": 2024,
    },
    {
        "email": "olivia.wininsky@pitt.edu", "full_name": "Olivia Wininsky",
        "profile": dict(location="Cambridge, MA", graduation_year=2021,
            current_company="Harvard", current_role="Investor",
            open_to_coffee_chats=True, open_to_mentorship=True),
        "company": "Harvard", "since": 2023,
    },
    {
        "email": "rachel.jan@pitt.edu", "full_name": "Rachel Jan",
        "profile": dict(location="San Francisco, CA", graduation_year=2025,
            current_company="Plaid", current_role="Software Engineer",
            open_to_coffee_chats=True, available_for_referrals=True, open_to_resume_review=True),
        "company": "Plaid", "since": 2023,
    },
    {
        "email": "delaney.scheidell@pitt.edu", "full_name": "Delaney Scheidell",
        "profile": dict(location="Washington, DC", graduation_year=2025,
            current_company="AWS", current_role="Frontend Engineer",
            open_to_coffee_chats=True, open_to_resume_review=True),
        "company": "AWS", "since": 2024,
    },
    {
        "email": "michael.henry@pitt.edu", "full_name": "Michael LJ Henry",
        "profile": dict(location="Los Gatos, CA", graduation_year=2023,
            current_company="Netflix", current_role="Software Engineer",
            open_to_mentorship=True, available_for_referrals=True),
        "company": "Netflix", "since": 2022,
    },
    {
        "email": "julian.alamorosas@pitt.edu", "full_name": "Julian Alamo-Rosas",
        "profile": dict(location="Mountain View, CA", graduation_year=2024,
            current_company="Google", current_role="Software Engineer",
            open_to_coffee_chats=True, available_for_referrals=True),
        "company": "Google", "since": 2023,
    },
    {
        "email": "rohit.ganguly@pitt.edu", "full_name": "Rohit Ganguly",
        "profile": dict(location="Los Altos, CA", graduation_year=2021,
            current_company="Descope", current_role="Product Manager",
            open_to_coffee_chats=True, open_to_mentorship=True, open_to_resume_review=True),
        "company": "Descope", "since": 2024,
    },
]


def seed() -> None:
    with Session(engine) as session:
        # Companies first (FK target for employment)
        for name, domain in COMPANIES.items():
            if not session.get(Company, name):
                session.add(Company(name=name, image_url=_logo(domain)))
        session.commit()

        for alum in ALUMNI:
            existing = session.exec(
                select(User).where(User.email == alum["email"])
            ).first()
            if existing:
                print(f"skip (exists): {alum['email']}")
                continue

            user = create_user(
                session=session,
                user_create=UserCreate(
                    email=alum["email"],
                    password="pittcsc2025",
                    full_name=alum["full_name"],
                ),
            )
            for k, v in alum["profile"].items():
                setattr(user, k, v)
            user.is_alumni = True
            user.profile_completed = True
            user.profile_image = PFP.get(alum["email"])
            session.add(user)
            session.add(Email(email=user.email, preferred=True, user_id=user.id))

            session.add(
                Employment(
                    user_id=user.id,
                    company_name=alum["company"],
                    type="full time",
                    start=_d(alum["since"]),
                    end=None,
                )
            )
            session.commit()
            print(f"seeded: {alum['full_name']} ({alum['email']})")

    print("Done.")


if __name__ == "__main__":
    seed()
