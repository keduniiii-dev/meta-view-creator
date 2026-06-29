## Goal
Bring the ArchVision CRM (Dashboard, Pipeline, Capture, Outreach, Analytics) into this project as a private admin area, isolated in its own folder, and wire Book a Demo submissions into it.

## Folder layout (isolated from the marketing site)
```
src/
├── crm/
│   ├── components/        (CRM-only: LeadCaptureForm, StatsBar, ServicesGrid, CRM Navbar, etc.)
│   ├── pages/             (Dashboard, Pipeline, Capture, Outreach, Analytics)
│   ├── layout/            (CrmLayout with sidebar, top bar, sign-out)
│   └── lib/               (CRM helpers, query hooks)
├── pages/auth/
│   ├── Login.tsx
│   └── Unauthorized.tsx
└── components/auth/
    └── RequireAdmin.tsx   (auth + role guard)
```
Nothing under `src/crm/` is imported by public marketing pages, so it stays out of the public bundle paths.

## Routing (added to App.tsx)
- `/auth/login` – sign-in (email/password)
- `/crm` – redirects to `/crm/dashboard`
- `/crm/dashboard`, `/crm/pipeline`, `/crm/capture`, `/crm/outreach`, `/crm/analytics`
- All `/crm/*` routes wrapped in `<RequireAdmin>` which:
  1. Checks `supabase.auth.getSession()` – redirect to `/auth/login` if signed out
  2. Calls `has_role(auth.uid(), 'admin')` – redirect to `/unauthorized` if not admin
- `robots.txt` updated to `Disallow: /crm` and `Disallow: /auth`
- `sitemap.xml` keeps only public routes
- No nav link to `/crm` from the public Navbar or Footer

## Backend (Lovable Cloud)
Enable Cloud and run a single migration that creates:

1. `app_role` enum (`admin`, `user`)
2. `user_roles` table + `has_role(uuid, app_role)` security-definer function (per platform spec)
3. `leads` table:
   - `id`, `created_at`, `updated_at`
   - `full_name`, `work_email`, `company`, `job_title`, `phone`, `industry`
   - `source` (default `book_a_demo`), `notes`
   - `stage` enum: `new`, `contacted`, `qualified`, `proposal`, `won`, `lost`
   - `owner_id` (nullable, FK auth.users)
4. `lead_activities` table (lead_id FK, type, body, created_by, created_at) for Outreach/timeline
5. All tables: explicit `GRANT` block to `authenticated` + `service_role`, then `ENABLE RLS`
6. RLS: only `has_role(auth.uid(), 'admin')` can select/insert/update/delete on `leads` and `lead_activities`; public anon cannot read anything
7. Trigger on `auth.users` insert to auto-create a `profiles` row (no role granted by default – admins are promoted manually via SQL)

## Book a Demo wiring
Update `BookDemoDialog.tsx` so on successful validation it inserts a row into `public.leads` (anon insert allowed via a single narrow policy: insert-only, `source = 'book_a_demo'`, no select for anon). The CRM dashboard then surfaces these leads.

## CRM pages (ported from ArchVision CRM, restyled to this project's tokens)
- **Dashboard** – KPI cards (new this week, by stage), recent leads table
- **Capture** – manual lead entry form (same schema as Book a Demo)
- **Pipeline** – Kanban by `stage`, drag to update
- **Outreach** – per-lead activity log + quick "log call/email" form
- **Analytics** – simple charts (leads over time, stage funnel) using recharts (already installed)
- All pages use this project's design tokens (hero/primary cyan-teal), not the original ArchVision colors

## Admin bootstrap
After Cloud is enabled, instruct the user to sign up once at `/auth/login`, then run a one-line SQL insert to grant their `user_id` the `admin` role. Document this in the chat reply.

## Out of scope
- Email notifications on new leads (can add later via transactional email)
- CSV import/export
- Multi-tenant / team roles beyond `admin`
