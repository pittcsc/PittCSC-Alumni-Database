# PittCSC Alumni Network — Deployment Guide

Production architecture:

```
  alumni.pittcs.wiki            (Netlify — static React/Vite SPA)
        │  HTTPS + JWT (Bearer)
        ▼
  pittcsc-alumni-api.onrender.com   (Render — FastAPI in Docker)
        │
        ▼
  Managed Postgres              (Render database)
```

- **Frontend** → Netlify (static build, served at the `alumni.pittcs.wiki` subdomain).
- **Backend** → Render (Docker web service, tables auto-created + admin seeded on first boot).
- **Database** → Render managed Postgres (provisioned by `render.yaml`).
- **Auth** → JWT; passwordless email-OTP is the primary login (**needs SMTP in prod**), password login is the fallback.

This is a **separate repo and deployment** from the main pittcs.wiki site.

---

## 1. Backend + Database on Render

The repo ships a Render blueprint at [`render.yaml`](./render.yaml).

1. Push this repo to GitHub (its own repo).
2. Render → **New → Blueprint** → select the repo. Render reads `render.yaml` and creates:
   - `pittcsc-alumni-api` — Docker web service from `backend/Dockerfile`
   - `pittcsc-alumni-db` — managed Postgres (connection vars wired automatically)
3. After the first deploy, set the **secret** env vars in the service dashboard (they are `sync: false` in the blueprint, so Render doesn't store them in git):
   - `FIRST_SUPERUSER` — admin email (e.g. `you@pitt.edu`)
   - `FIRST_SUPERUSER_PASSWORD` — a strong password
   - `SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAILS_FROM_EMAIL` — **required for OTP login** (see §4)
4. `SECRET_KEY` is auto-generated and stable. `FRONTEND_HOST` / `BACKEND_CORS_ORIGINS` default to `https://alumni.pittcs.wiki` — update them if your final URL differs.
5. Deploy. Verify: `https://<service>.onrender.com/api/v1/utils/health-check/` returns `true`, and `/docs` loads.

> Render's free Postgres/web instances sleep when idle and the free DB expires after ~90 days — fine for a demo, upgrade for production use.

---

## 2. Frontend on Netlify

The repo ships [`netlify.toml`](./netlify.toml) (base `frontend/`, publish `dist`, SPA redirect).

1. Netlify → **Add new site → Import from GitHub** → select the repo.
2. Build settings are read from `netlify.toml` — no changes needed.
3. Set env var **`VITE_API_URL`** = `https://<your-render-service>.onrender.com/api/v1`
   (Site settings → Environment variables). Redeploy so the build picks it up.
4. Confirm the Netlify preview URL loads and login works.

---

## 3. Domain: alumni.pittcs.wiki

1. Netlify site → **Domain settings → Add custom domain** → `alumni.pittcs.wiki`.
2. In the DNS provider for `pittcs.wiki`, add a **CNAME** `alumni` → your Netlify site
   (`<site>.netlify.app`), or follow Netlify's exact DNS instructions. Netlify issues HTTPS automatically.
3. Ensure the backend allows this origin: `FRONTEND_HOST=https://alumni.pittcs.wiki` and/or add it to
   `BACKEND_CORS_ORIGINS` on Render, then redeploy the backend.

> Prefer a subdomain here. If you instead want `pittcs.wiki/alumni` (path-based), you'd add a Netlify
> rewrite in the **main pittcs-wiki repo** (`/alumni/* → https://alumni.pittcs.wiki/:splat`) and set Vite's
> `base` to `/alumni/`. The subdomain avoids that coupling.

---

## 4. SMTP is required for OTP login in production

Email-OTP emails a 6-digit code. Locally (SMTP unset) the code is returned in the API response for testing;
**in production that dev fallback is disabled**, so without SMTP configured users can't receive codes.
Set `SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASSWORD/EMAILS_FROM_EMAIL` on Render (any SMTP provider — Gmail
app password, SendGrid, Mailgun, AWS SES, etc.). Password login keeps working regardless.

---

## 5. Post-deploy smoke test

1. `GET /api/v1/utils/health-check/` → `true`.
2. Open the site, request an OTP for your admin email, confirm the code email arrives, sign in.
3. Browse the directory, open Interview Prep, edit your profile.
4. (Optional) seed demo data on the server shell: `python -m scripts.seed_demo`.

---

## Local development

```bash
# Backend (SQLite, zero-config; auto-seeds admin@test.com / admin123)
cd backend && python3.12 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000

# Frontend (new terminal)
cd frontend && npm install
echo 'VITE_API_URL=http://127.0.0.1:8000/api/v1' > .env.local
npm run dev   # http://localhost:5173
```

Env templates: [`.env.example`](./.env.example) (backend) and [`frontend/.env.example`](./frontend/.env.example).
