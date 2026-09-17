# PittCSC Alumni Network

A directory of University of Pittsburgh Computer Science Club alumni — where they work, where they interviewed, and how they can help current students (coffee chats, mentorship, referrals, resume reviews).

## Tech stack

**Backend** — FastAPI · SQLModel · SQLite (dev) / Postgres (prod) · JWT + passwordless email OTP · SMTP

**Frontend** — React 18 · TypeScript · Vite · Tailwind CSS · Zustand · Axios · Lucide

## Prerequisites

- Python 3.12
- Node.js 20
- (Prod only) Postgres + an SMTP provider

## Local development

The backend runs on **SQLite with zero config** and seeds a first admin on startup — no database setup needed.

### Backend

```bash
cd backend
python3.12 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

- API: `http://127.0.0.1:8000` · docs at `/docs`
- On first boot it creates the tables and the admin from `.env` (`admin@test.com` / `admin123` by default).
- Load demo alumni: `python -m scripts.seed_demo`

### Frontend

```bash
cd frontend
npm install
echo 'VITE_API_URL=http://127.0.0.1:8000/api/v1' > .env.local
npm run dev            # http://localhost:5173
```

> Use `127.0.0.1`, not `localhost`, in `VITE_API_URL` — some machines resolve `localhost` to IPv6 while the dev backend binds IPv4, which causes 404s.

### Signing in (dev)

- **Email OTP (default):** enter any `@pitt.edu` email → the 6-digit code is shown on screen in dev (SMTP is off locally) → sign in. New emails auto-create an account.
- **Password:** `admin@test.com` / `admin123` (admin), or any seeded alum with `pittcsc2025`.

## Environment variables

- Backend reads the repo-root `.env` — see [`.env.example`](.env.example).
- Frontend reads `frontend/.env.local` — see [`frontend/.env.example`](frontend/.env.example).
- Local dev uses SQLite; set `POSTGRES_SERVER` (+ `POSTGRES_*`) to switch to Postgres.
- **SMTP is required in production** for OTP login to deliver codes (password login works without it).

## Deployment

Backend on Render (Docker + managed Postgres), frontend on Netlify, served at `alumni.pittcs.wiki`. Full runbook: [`DEPLOYMENT.md`](DEPLOYMENT.md) (blueprint in [`render.yaml`](render.yaml), config in [`netlify.toml`](netlify.toml)).

## Project structure

```
backend/
  app/
    api/routes/     # auth (login + OTP), users, companies, interviews,
                    # employment, connections, emails, utils
    core/           # config, db, security
    models.py       # SQLModel tables + schemas
  scripts/seed_demo.py
frontend/
  src/
    components/     # ui/, layout/, alumni/, home/
    pages/          # Home, Alumni list/detail, Profile, Interview Prep, Admin, ...
    services/api.ts # FastAPI client
    store/          # Zustand stores (auth, alumni, connection, profile, admin)
```

## API

REST API under `/api/v1`. Auth is JWT (Bearer). Browse the full, live API at `http://127.0.0.1:8000/docs`. Highlights:

- `POST /login/access-token`, `POST /login/otp/request`, `POST /login/otp/verify`
- `GET /users/`, `GET /users/{id}`, `GET /users/preview` (public), `PATCH /users/me`
- `GET /companies/`, `GET /interviews/`, `GET /employment/`
- `POST /connections/`, `POST /connections/accept/{id}`, `GET /connections/pending/incoming`

## Design

CSC blue `#1d2758` (the printer-gamut brand blue used on the logo and pittcs.wiki) with gold `#FFB81C`. Inter for body, Lexend for headings.

## License

MIT — see `LICENSE`.

## Contact

PittCSC — [pittcsc.org](https://pittcsc.org)
