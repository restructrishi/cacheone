# CacheOne — Modular SaaS (CRM + HRMS)

Scalable modular SaaS with **Organisation** (core), **CRM**, and **HRMS**. Multi-tenant, role-based access, module-level enablement per organisation.

## Structure

- **Backend**: Node.js + Express, module-based (organisation, crm, hrms). JWT auth, role and module-access middlewares.
- **Frontend**: React (Vite) + Tailwind + Lucide, module-based apps under `apps/` (organisation, crm, hrms), shared components/hooks/utils.
- **Database**: Single PostgreSQL; `org_id` on all transactional tables.

## Quick start

### Database

1. Create PostgreSQL DB: `createdb cacheone_saas`
2. Run schema: `psql -d cacheone_saas -f backend/database/schema.sql`
3. Run onboarding migration (additive): `psql -d cacheone_saas -f backend/database/migrations/001_onboarding_additive.sql`
4. Seed demo Super Admin (optional): from `backend` run `npm run seed`

**Demo Super Admin credentials** (after running seed):

- Email: `superadmin@demo.com`
- Password: `Admin@123`

### Backend

```bash
cd backend
cp .env.example .env   # set DB_* and JWT_SECRET
npm install
npm run dev
```

Runs at `http://localhost:3000`. API base: `/api`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:5173`. Proxy to backend: `/api` → `http://localhost:3000`.

## Auth & access

- **Super Admin**: Create organisations, enable/disable modules per org, invite Org Admins, no org restriction.
- **Org Admin**: Invite users (role ADMIN or USER), assign module access; scoped to own org.
- **Module User**: Access only modules assigned to them (or all org modules if none assigned).
- Middlewares: `auth` → `role` → `module-access` → `resolveOrgContext` (for CRM/HRMS).

## Enterprise onboarding (additive)

- **Organization creation** (Super Admin): `name`, `slug`, optional `domain`, `subscription_plan`; multi-select modules via `PUT /organisations/:id/modules` body `{ moduleSlugs }`.
- **Invites**: Super Admin invites Org Admin (email + organizationId). Org Admin invites User (email, role ADMIN/USER, module slugs for USER). No password set; status `invited`.
- **Set password**: Invite link opens `/set-password?token=...`. `POST /api/auth/set-password` with `{ token, password }` activates the user.
- **APIs**: `POST /api/invites`, `GET /api/invites?organizationId=`, `GET /api/modules`, `GET /api/auth/invite/validate?token=`.
- Existing login and users are unchanged; invited users cannot login until they set a password.

## Employee Management App

Separate app (not in this repo); no own backend. Consumes **HRMS APIs only** and connects to the same HRMS DB layer.

## Adding a new module

1. Backend: add `src/modules/<module>/` (controller, service, routes, model), register in `src/routes/index.js`, add middleware for module slug.
2. DB: add tables with `org_id`, seed `modules` and `organization_modules` if needed.
3. Frontend: add `apps/<module>/` (pages, components, services, routes), add route and nav in router/layout using shared constants.
