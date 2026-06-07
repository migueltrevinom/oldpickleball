# AGENTS.md

## Cursor Cloud specific instructions

Monorepo managed with **pnpm workspaces** (`pnpm-workspace.yaml` includes `apps/*` and `packages/*`). Node >= 20, pnpm >= 9.

### Services

| App | Path | Dev command | Port |
|---|---|---|---|
| API (Koa.js) | `apps/api` | `pnpm dev:api` | 3050 |
| Web (Angular 17) | `apps/web` | `cd apps/web && npx ng serve` | 4200 |
| Landing (Next.js 14) | `apps/landing` | `pnpm dev:landing` | 3010 |

### Prerequisites

- **MongoDB 7** must be running. Start with `sudo docker compose up -d` from the repo root (`docker-compose.yml` defines the service).
- **Shared package** must be built before starting the API: `pnpm build:shared`.
- **API `.env` file:** Copy `.env.example` to `apps/api/.env` and set `PORT=3050` (the web app expects the API at `http://localhost:3050/api/v1`).

### Key commands (from repo root)

- **Install deps:** `pnpm install`
- **Dev API:** `pnpm dev:api` (Koa.js on port 3050)
- **Dev web:** `cd apps/web && npx ng serve` (Angular on port 4200). Note: the web `package.json` has no `dev` script, so `pnpm dev:web` will fail; use `ng serve` directly.
- **Build web:** `cd apps/web && npx ng build`
- **Lint:** `pnpm lint` (API + landing; web has no lint script)
- **Test API:** `pnpm --filter @oldpickleball/api test` (Vitest). The root `pnpm test` will fail because the web app has no spec files.

### Web app (`apps/web`) notes

- Angular 17 standalone components with signals, Tailwind CSS, inline templates.
- Auth flow: OTP-based (request-otp → verify-otp). JWT stored in `localStorage` under key `access_token`.
- Roles: `super_admin`, `court_admin`, `court_staff`, `player` — sidebar and routes adapt per role.
- The web app's `node_modules` is installed independently under `apps/web/` by the workspace. Running `pnpm install` at the repo root handles it.
- API URL defaults to `http://localhost:3050/api/v1` in dev (see `src/environments/environment.ts`).

### Dev login without Mailgun

When `MAILGUN_API_KEY` is empty (default), emails are not sent. To log in during development, retrieve the OTP code directly from MongoDB after calling request-otp:
```
sudo docker exec workspace-mongodb-1 mongosh --quiet --eval \
  'db.users.findOne({email: "EMAIL"}, {otp: 1}).otp.code' oldpickleball
```
