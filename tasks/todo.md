# Pitt CSC Alumni Network — Cleanup & Wiring Plan

## 0. Git recovery (DONE)
- Local `.git` was a hollow shell (zero objects) — no recoverable local history.
- Real work lived on remote `pittcsc/PittCSC-Alumni-Database` branch `jeremy/frontend-overhaul` (9 commits ahead of `main`).
- Local working tree was a botched partial copy: a hybrid of old `main` + some `jeremy` files.
- Recovered non-destructively: re-init git, fetch, reset onto `jeremy/frontend-overhaul`; reverted 14 stale files, preserved 3 genuine improvements. Full backup in scratchpad.
- Now on branch `cleanup-and-wire`.

## State assessment

### Backend (FastAPI + SQLModel + SQLite) — MOSTLY WORKS
- Solid: JWT auth, users CRUD, SMTP email + templates, password reset.
- Data model already covers the vision: User (with `open_to_coffee_chats`/`open_to_mentorship`/`available_for_referrals` toggles), **Interview** (companies interviewed at — the "not on LinkedIn" feature), Employment, Company (+logos), Request/CompletedRequest (connections), Event.
- Domain routes implemented but buggy: copy-paste error messages, wrong `count` values, stale docstrings.
- Dead: `Event` table (no routes), `Internship` table (superseded by `Employment.type`), `private.py` (broken `tags="private"` stub).
- Gaps: no "list my incoming pending requests" endpoint; no resume-advice toggle; no email verification / signup welcome email; `init_db` NOT called on startup (fresh boot = no tables); `FIRST_SUPERUSER` has no default (import crash); random `SECRET_KEY` default (sessions die on restart); Postgres deps present but not wired; README materially wrong.

### Frontend (React + Vite + Zustand) — HALF WIRED
- WIRED to FastAPI: Auth (login/register/logout/me), AlumniListPage, ConnectionsPage.
- BROKEN/DEAD: ProfilePage, ProfileSetupPage, AdminPage (crash — destructure `authStore.profile`/`getProfile` which don't exist; hit stubbed Supabase), EventsPage (Supabase, no backend), AlumniDetailPage (always renders mock), CompanyProcessesPage (100% mock, ignores existing `interviewAPI`).
- Dead code: flat duplicate components (removed 4), Supabase stubs (`lib/supabase.ts`, `lib/supabaseClient.ts`), `@supabase/supabase-js` dep, `store/adminStore.ts` + `store/profileStore.ts` (Supabase), MockCredentialsPage, ID type mismatch (number vs Supabase-era string).

## Phased plan

### Phase 1 — Dead code cleanup (low risk)
- [x] Remove flat duplicate components + `types/supabase.ts`.
- [ ] Remove backend `Internship` model + `Event` model/table (or keep Event if we build events).
- [ ] Remove broken `private.py` + its conditional include.
- [ ] Strip debug `print`s, commented dead blocks, fix copy-paste docstrings/error messages.
- [ ] Consolidate Button/Card onto `ui/` versions (verify prop parity first), delete flat ones.
- [ ] Drop `@supabase/supabase-js` + Supabase stub files (after pages rewired).

### Phase 2 — Unbreak the crashing pages (make it usable)
- [ ] Fix `authStore` contract: pages expect `profile`/`getProfile`; refactor to use `user` + `updateProfile`/`fetchCurrentUser`.
- [ ] Rewire ProfilePage + ProfileSetupPage off Supabase → `authAPI.updateProfile` / `userAPI`.
- [ ] Rewire AlumniDetailPage → `userAPI.getUserById` (kill mock fallback).
- [ ] Rewire `adminStore` → `userAPI`/`connectionAPI`, fix `set.getState()` bug; gate admin on `is_superuser`.

### Phase 3 — Wire the core features (interviews + profiles + directory)
- [ ] CompanyProcessesPage → real `interviewAPI`/`companyAPI` (the interview-history feature).
- [ ] Profile onboarding flow end-to-end (employment, interviews, toggles).
- [ ] Add "resume advice" toggle to model + profile UI (+ any other help toggles).
- [ ] Add backend endpoint: list incoming pending connection requests.
- [ ] Fix backend bugs (counts, docstrings), auth-guard protected routes on frontend.

### Phase 4 — Auth polish (streamlined login)
- [ ] Decide auth approach (email/password vs Google/Pitt SSO vs magic link).
- [ ] init_db on startup, SECRET_KEY + superuser env hardening.

### Phase 5 — Run & deploy
- [ ] Boot backend + frontend locally end-to-end, seed data, verify core flows.
- [ ] Decide SQLite vs Postgres; docker-compose up from cold clone.
- [ ] Onboarding path for importing all Pitt CSC alumni.

## Review — session 1 (working app achieved)

**Done & verified in browser (both servers running locally):**
- Git recovery: clean `cleanup-and-wire` branch, full history, 3 local improvements preserved.
- Backend: dual-mode DB (SQLite local / Postgres-ready), startup table creation + admin seed, hardened config, dropped dead Event/Internship/private, fixed count/docstring/error bugs, added `/connections/pending/incoming`, added `open_to_resume_review` toggle + exposed `profile_completed`, fixed `UserUpdate` schema gaps (location/visibility/completed). Demo seed script (4 alumni, 10 interviews, 15 companies w/ logos).
- Frontend: rewired ProfilePage, ProfileSetupPage, AlumniDetailPage, AdminPage, CompanyProcessesPage(interviews), adminStore off Supabase/mock → FastAPI. Deleted Events, MockCredentials, Supabase stubs, profileStore, `@supabase/supabase-js`. Added resume-review toggle across UI. `npm run build` passes.
- Verified flows: login → directory → interview prep (real data, pass/fail, notes) → profile (4 toggles) → connections. Admin hidden from directory.

**Still open (next sessions):**
- Richer auth: Google OAuth + email OTP/magic-link (currently email+password JWT works). Pluggable seam not yet built.
- Postgres for real deploy (config ready; needs a DB instance + POSTGRES_SERVER env).
- Profile onboarding: employment/interview history entry from the setup wizard (currently core User fields only; interviews added via Interview Prep page).
- Duplicate Button/Card components not yet consolidated (both work).
- AlumniListPage double-pagination bug; auth-guarding protected routes; alumni onboarding/import path for all Pitt CSC alumni.
