"""Seed the database with realistic demo alumni, employment, and interview data.

Run from the backend directory:  ./venv/bin/python -m scripts.seed_demo

Idempotent: skips users that already exist. Safe to re-run.
"""
from datetime import datetime, timezone

from sqlmodel import Session, select

from app.core.db import engine
from app.crud import create_user
from app.models import (
    Company,
    Email,
    Employment,
    Interview,
    User,
    UserCreate,
)


def _logo(domain: str) -> str:
    return f"https://logo.clearbit.com/{domain}"


# name -> logo domain
COMPANIES = {
    "Coinbase": "coinbase.com",
    "Vanguard": "vanguard.com",
    "Lockheed Martin": "lockheedmartin.com",
    "NVIDIA": "nvidia.com",
    "Palantir": "palantir.com",
    "Circle": "circle.com",
    "Google": "google.com",
    "Meta": "meta.com",
    "Stripe": "stripe.com",
    "Databricks": "databricks.com",
    "Amazon": "amazon.com",
    "Microsoft": "microsoft.com",
    "Duolingo": "duolingo.com",
    "Two Sigma": "twosigma.com",
    "Anthropic": "anthropic.com",
    "Jane Street": "janestreet.com",
    "Bloomberg": "bloomberg.com",
    "Snowflake": "snowflake.com",
    "Roblox": "roblox.com",
    "Airbnb": "airbnb.com",
    "Datadog": "datadoghq.com",
    "Capital One": "capitalone.com",
    "PNC": "pnc.com",
}


def _d(year: int, month: int = 6, day: int = 1) -> datetime:
    return datetime(year, month, day, tzinfo=timezone.utc)


# Each alum: profile dict, employment [(company, type, start, end)], interviews [(company, role, internship, season_year, passed, note)]
ALUMNI = [
    {
        "email": "shreyash@pitt.edu",
        "password": "pittcsc2025",
        "full_name": "Shreyash Ranjan",
        "profile": dict(
            location="San Francisco, CA",
            graduation_year=2026,
            linkedin_url="https://linkedin.com/in/shreyashranjan",
            current_company="NVIDIA",
            current_role="Software Engineer",
            bio="CS @ Pitt. Interested in AI infra + crypto. Happy to help with interview prep and referrals.",
            open_to_coffee_chats=True,
            open_to_mentorship=True,
            available_for_referrals=True,
            open_to_resume_review=True,
            is_alumni=True,
            profile_completed=True,
        ),
        "employment": [
            ("Coinbase", "internship", _d(2023), _d(2023, 8)),
            ("Vanguard", "internship", _d(2024), _d(2024, 8)),
            ("Lockheed Martin", "internship", _d(2022), _d(2022, 8)),
            ("NVIDIA", "full time", _d(2026), None),
        ],
        "interviews": [
            ("Palantir", "Software Engineer", True, 2024, False, "Onsite: 2 coding + 1 system design. Great people."),
            ("Circle", "Backend Engineer", True, 2024, True, "Take-home + 2 rounds. Crypto-heavy."),
            ("Google", "SWE Intern", True, 2023, False, "Phone screen graph + DP. Rejected after onsite."),
            ("Meta", "Production Engineer", True, 2023, True, "2 coding + 1 systems. Fast process."),
        ],
    },
    {
        "email": "maya.chen@pitt.edu",
        "password": "pittcsc2025",
        "full_name": "Maya Chen",
        "profile": dict(
            location="Seattle, WA",
            graduation_year=2024,
            linkedin_url="https://linkedin.com/in/mayachen",
            current_company="Microsoft",
            current_role="Product Manager",
            bio="APM @ Microsoft. Former Pitt CSC board. Love mentoring underclassmen on PM breaking-in.",
            open_to_coffee_chats=True,
            open_to_mentorship=True,
            available_for_referrals=False,
            is_alumni=True,
            profile_completed=True,
        ),
        "employment": [
            ("Amazon", "internship", _d(2023), _d(2023, 8)),
            ("Microsoft", "full time", _d(2024), None),
        ],
        "interviews": [
            ("Google", "APM", False, 2024, False, "Product sense + analytical. Tough final round."),
            ("Stripe", "PM", False, 2024, True, "Loved the user-empathy focus."),
        ],
    },
    {
        "email": "deshawn.brooks@pitt.edu",
        "password": "pittcsc2025",
        "full_name": "DeShawn Brooks",
        "profile": dict(
            location="New York, NY",
            graduation_year=2023,
            linkedin_url="https://linkedin.com/in/deshawnbrooks",
            current_company="Two Sigma",
            current_role="Quant Developer",
            bio="Quant dev @ Two Sigma. Ask me about finance interviews and low-latency systems.",
            open_to_coffee_chats=False,
            open_to_mentorship=True,
            available_for_referrals=True,
            open_to_resume_review=True,
            is_alumni=True,
            profile_completed=True,
        ),
        "employment": [
            ("Two Sigma", "full time", _d(2023), None),
        ],
        "interviews": [
            ("Databricks", "Software Engineer", False, 2023, True, "Spark internals + coding."),
            ("Palantir", "Forward Deployed Engineer", False, 2022, True, "Very applied, real dataset."),
        ],
    },
    {
        "email": "priya.patel@pitt.edu",
        "password": "pittcsc2025",
        "full_name": "Priya Patel",
        "profile": dict(
            location="Pittsburgh, PA",
            graduation_year=2025,
            linkedin_url="https://linkedin.com/in/priyapatel",
            current_company="Duolingo",
            current_role="ML Engineer",
            bio="ML @ Duolingo (stayed in Pittsburgh!). Happy to chat about ML interviews and staying local.",
            open_to_coffee_chats=True,
            open_to_mentorship=False,
            available_for_referrals=True,
            is_alumni=True,
            profile_completed=True,
        ),
        "employment": [
            ("Duolingo", "internship", _d(2024), _d(2024, 8)),
            ("Duolingo", "full time", _d(2025), None),
        ],
        "interviews": [
            ("Anthropic", "ML Engineer", False, 2025, False, "Deep ML + coding. Learned a ton."),
            ("Meta", "ML Engineer", False, 2024, True, "ML system design was the differentiator."),
        ],
    },
    {
        "email": "aisha.khan@pitt.edu", "password": "pittcsc2025", "full_name": "Aisha Khan",
        "profile": dict(location="New York, NY", graduation_year=2022,
            linkedin_url="https://linkedin.com/in/aishakhan", current_company="Jane Street",
            current_role="Software Engineer", bio="Trading systems @ Jane Street. Ask me about OCaml, low-latency, and finance interviews.",
            open_to_coffee_chats=True, available_for_referrals=True, is_alumni=True, profile_completed=True),
        "employment": [("Jane Street", "full time", _d(2022), None)],
        "interviews": [("Bloomberg", "Software Engineer", False, 2021, True, "Systems + coding, fair process."),
            ("Two Sigma", "Software Engineer", True, 2021, False, "Hard probability round.")],
    },
    {
        "email": "liam.oconnor@pitt.edu", "password": "pittcsc2025", "full_name": "Liam O'Connor",
        "profile": dict(location="New York, NY", graduation_year=2021,
            linkedin_url="https://linkedin.com/in/liamoconnor", current_company="Bloomberg",
            current_role="Senior Software Engineer", bio="Infra @ Bloomberg. Happy to mentor on backend + distributed systems.",
            open_to_mentorship=True, open_to_resume_review=True, is_alumni=True, profile_completed=True),
        "employment": [("Bloomberg", "full time", _d(2021), None)],
        "interviews": [("Google", "Software Engineer", False, 2021, True, "Standard SWE loop.")],
    },
    {
        "email": "sofia.rossi@pitt.edu", "password": "pittcsc2025", "full_name": "Sofia Rossi",
        "profile": dict(location="San Francisco, CA", graduation_year=2023,
            linkedin_url="https://linkedin.com/in/sofiarossi", current_company="Snowflake",
            current_role="Data Engineer", bio="Data infra @ Snowflake. Ex-Amazon intern. Referrals open.",
            available_for_referrals=True, open_to_resume_review=True, is_alumni=True, profile_completed=True),
        "employment": [("Amazon", "internship", _d(2022), _d(2022, 8)), ("Snowflake", "full time", _d(2023), None)],
        "interviews": [("Databricks", "Software Engineer", False, 2023, False, "Spark deep-dive, tough.")],
    },
    {
        "email": "marcus.johnson@pitt.edu", "password": "pittcsc2025", "full_name": "Marcus Johnson",
        "profile": dict(location="San Mateo, CA", graduation_year=2024,
            linkedin_url="https://linkedin.com/in/marcusjohnson", current_company="Roblox",
            current_role="Gameplay Engineer", bio="Building creator tools @ Roblox. Ask me about game/graphics interviews.",
            open_to_coffee_chats=True, open_to_mentorship=True, is_alumni=True, profile_completed=True),
        "employment": [("Roblox", "full time", _d(2024), None)],
        "interviews": [("Meta", "Software Engineer", True, 2023, True, "Two coding rounds, quick turnaround.")],
    },
    {
        "email": "emily.nguyen@pitt.edu", "password": "pittcsc2025", "full_name": "Emily Nguyen",
        "profile": dict(location="San Francisco, CA", graduation_year=2022,
            linkedin_url="https://linkedin.com/in/emilynguyen", current_company="Airbnb",
            current_role="Frontend Engineer", bio="Design systems @ Airbnb. Love talking React + design-eng.",
            open_to_coffee_chats=True, available_for_referrals=True, open_to_resume_review=True, is_alumni=True, profile_completed=True),
        "employment": [("Airbnb", "full time", _d(2022), None)],
        "interviews": [("Stripe", "Frontend Engineer", False, 2022, True, "Practical, built a real component.")],
    },
    {
        "email": "raj.gupta@pitt.edu", "password": "pittcsc2025", "full_name": "Raj Gupta",
        "profile": dict(location="Boston, MA", graduation_year=2023,
            linkedin_url="https://linkedin.com/in/rajgupta", current_company="Datadog",
            current_role="Site Reliability Engineer", bio="SRE @ Datadog. Ask me about on-call, observability, and infra roles.",
            open_to_mentorship=True, is_alumni=True, profile_completed=True),
        "employment": [("Datadog", "full time", _d(2023), None)],
        "interviews": [("Google", "SRE", False, 2023, False, "Linux + systems heavy, learned a lot.")],
    },
    {
        "email": "hannah.weiss@pitt.edu", "password": "pittcsc2025", "full_name": "Hannah Weiss",
        "profile": dict(location="Remote", graduation_year=2025,
            linkedin_url="https://linkedin.com/in/hannahweiss", current_company="Capital One",
            current_role="Machine Learning Engineer", bio="ML @ Capital One. Recent grad, happy to chat about new-grad ML roles.",
            open_to_coffee_chats=True, is_alumni=True, profile_completed=True),
        "employment": [("Capital One", "full time", _d(2025), None)],
        "interviews": [("Meta", "ML Engineer", True, 2024, False, "ML coding + case, close call.")],
    },
    {
        "email": "tyler.scott@pitt.edu", "password": "pittcsc2025", "full_name": "Tyler Scott",
        "profile": dict(location="Pittsburgh, PA", graduation_year=2024,
            linkedin_url="https://linkedin.com/in/tylerscott", current_company="PNC",
            current_role="Software Engineer", bio="Stayed in Pittsburgh at PNC. Ask me about staying local + finance tech.",
            open_to_mentorship=True, open_to_resume_review=True, is_alumni=True, profile_completed=True),
        "employment": [("PNC", "internship", _d(2023), _d(2023, 8)), ("PNC", "full time", _d(2024), None)],
        "interviews": [("Bloomberg", "Software Engineer", False, 2023, False, "Onsite in NYC, great experience.")],
    },
]


def seed() -> None:
    with Session(engine) as session:
        # Companies first (FK target for employment + interviews)
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
                    password=alum["password"],
                    full_name=alum["full_name"],
                ),
            )
            # apply profile fields
            for k, v in alum["profile"].items():
                setattr(user, k, v)
            session.add(user)
            session.add(Email(email=user.email, preferred=True, user_id=user.id))

            for company, etype, start, end in alum["employment"]:
                session.add(
                    Employment(
                        user_id=user.id,
                        company_name=company,
                        type=etype,
                        start=start,
                        end=end,
                    )
                )
            for company, role, internship, season_year, passed, note in alum["interviews"]:
                session.add(
                    Interview(
                        user_id=user.id,
                        company_name=company,
                        role=role,
                        internship=internship,
                        season=_d(season_year),
                        passed=passed,
                        note=note,
                        date=_d(season_year),
                    )
                )
            session.commit()
            print(f"seeded: {alum['full_name']} ({alum['email']})")

    print("Done.")


if __name__ == "__main__":
    seed()
