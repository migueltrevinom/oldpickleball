# AGENTS.md

## Cursor Cloud specific instructions

Monorepo managed with **pnpm workspaces** (`pnpm-workspace.yaml` includes `apps/*` and `packages/*`). Node >= 20, pnpm >= 9.

### Services

| App | Path | Dev command | Port |
|---|---|---|---|
| API (NestJS) | `apps/api` | `pnpm dev:api` | 3050 |
| Web (Angular 17) | `apps/web` | `pnpm dev:web` | 4200 |
| Landing | `apps/landing` | `pnpm dev:landing` | — |

### Key commands (from repo root)

- **Install deps:** `pnpm install`
- **Dev all:** `pnpm dev`
- **Dev web only:** `pnpm dev:web` (runs `ng serve` on port 4200)
- **Build web:** `cd apps/web && npx ng build`
- **Lint:** `pnpm lint`
- **Test:** `pnpm test`

### Web app (`apps/web`) notes

- Angular 17 standalone components with signals, Tailwind CSS, inline templates.
- Auth flow: OTP-based (request-otp → verify-otp). JWT stored in `localStorage`.
- Roles: `super_admin`, `court_admin`, `court_staff`, `player` — sidebar and routes adapt per role.
- The web app's `node_modules` is installed independently under `apps/web/` by the workspace. Running `pnpm install` at the repo root handles it.
- API URL defaults to `http://localhost:3050/api/v1` in dev (see `src/environments/environment.ts`).
