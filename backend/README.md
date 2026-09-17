# PittCSC Alumni Network API

Overview of the backend API routes. All routes are under `/api/v1`. The easiest reference is the live, auto-generated docs — run the backend and open `/docs`.

## Auth (`/login`)
- `POST /login/access-token` — password login, returns a JWT
- `POST /login/test-token` — validate the current token
- `POST /login/otp/request` — passwordless: email a 6-digit code (dev returns it in the response)
- `POST /login/otp/verify` — verify the code, returns a JWT (creates the account if new)
- `POST /password-recovery/{email}` — email a password-reset link
- `POST /reset-password/` — reset a password with a token

## Users (`/users`)
- `GET /users/` — list visible users (paginated; auth)
- `GET /users/preview` — small public teaser for the landing page (no auth)
- `GET /users/me` · `PATCH /users/me` · `PATCH /users/me/password` · `DELETE /users/me`
- `POST /users/signup` — public registration
- `GET /users/{id}` — get a user
- `POST /users/` · `PATCH /users/{id}` · `DELETE /users/{id}` — admin only
- `GET /users/company/{company_name}` — users at a company

## Companies (`/companies`)
- `GET /companies/` · `POST /companies/`
- `GET /companies/{name}`
- `GET /companies/employee_counts`
- `GET /companies/current_employees/{name}` · `GET /companies/all_employees/{name}`

## Interviews (`/interviews`)
- `GET /interviews/` — all interview reports
- `POST /interviews/` · `POST /interviews/bulk`

## Employment (`/employment`)
- `GET /employment/` — current user's employment history
- `POST /employment/` — add an entry (auto-creates the company)
- `DELETE /employment/{id}`

## Connections (`/connections`)
- `POST /connections/` — send a connection request (emails the recipient)
- `POST /connections/accept/{request_id}` · `POST /connections/ignore/{request_id}`
- `DELETE /connections/{connection_id}`
- `GET /connections/pending/incoming` — pending requests sent to me
- `GET /connections/{user_id}/accepted_requests` · `GET /connections/{user_id}/accepted_requested`

## Emails (`/emails`)
- `POST /emails/me` — add an email to my account
- `PATCH /emails/me/preferred` — set my preferred email
- `GET /emails/{user_id}` — list a user's emails (admin only)

## Utils (`/utils`)
- `GET /utils/health-check/` — liveness probe
- `POST /utils/test-email/` — send a test email (admin only)

## Notes
- Routes require authentication unless marked public.
- List endpoints paginate via `skip` / `limit`.
- OTP login needs SMTP configured in production; in local/dev the code is returned in the response instead of emailed.
