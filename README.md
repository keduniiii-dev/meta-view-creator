# Twinblueprint Website and CRM

For implementation status, user workflows, architecture, deployment history and outstanding verification, see the [project documentation and workflow](docs/project-overview.md).

Twinblueprint is a React/Vite application with two parts:

- A public marketing website for Twinblueprint 3D visualisation services.
- A protected CRM for capturing, qualifying, organising, and progressing construction/AEC leads.

This repository is the frontend. It consumes the separate Twinblueprint Express API; it does not connect to Supabase directly.

## What this project is about

Twinblueprint CRM is a lead-generation and sales-operations workspace built for construction, architecture, engineering, and infrastructure teams. It helps the Twinblueprint team turn website interest into qualified commercial opportunities.

The public site explains Twinblueprint's 3D visualisation offering and collects Demo & Lead Report requests. Each request becomes a CRM lead. Internal users then review the lead, add business context such as industry, region, project, deal stage, score, and temperature, and decide whether it should move into the active pipeline.

In practical terms, the CRM gives the team one place to:

- Capture website enquiries and manually add prospects.
- Keep leads organised by industry, region, project, phase, and qualification status.
- Archive or remove outdated records safely.
- View qualified opportunities and performance metrics on the dashboard.
- Turn qualified leads into bids and in-flight projects.
- Prepare for targeted outreach, regional reporting, and analytics.

## Tech stack

- React and TypeScript
- Vite
- Tailwind CSS and shadcn/ui
- React Router
- TanStack Query
- Axios
- Recharts
- Framer Motion

## Local development

### Prerequisites

- Node.js 18+
- Twinblueprint API running locally on port 5000

### Install and run

~~~bash
npm install
npm run dev
~~~

Open the website at http://localhost:8080.

CRM login route: http://localhost:8080/crm/login

### API configuration

Create .env.local:

~~~env
VITE_API_BASE_URL=/api
~~~

Vite proxies /api requests to http://localhost:5000. For another environment, set VITE_API_BASE_URL to the full API base URL, including /api.

Never commit credentials or production tokens.

### Deploy to Vercel

Import this repository with the Root Directory set to the folder containing `package.json` and `vercel.json` (the repository root). The committed Vercel configuration selects Vite, runs `npm run build`, and serves `dist`.

In the Vercel project's environment variables, set `VITE_API_BASE_URL` to your deployed Express API's HTTPS base URL, including `/api`, for example `https://your-api.example.com/api`. Enable it for the environments you deploy to. The local Vite `/api` proxy does not run on Vercel; the backend must be deployed separately and allow the frontend's origin through its CORS configuration.

Deploy again after changing environment variables, because Vite includes them at build time. Open `/crm/login` on the deployed domain to access the CRM; `/` is the public marketing homepage.

`vercel.json` rewrites page requests to `index.html` so React Router can handle direct links and refreshes on routes such as `/crm/login` and `/crm/leads`. If Vercel still returns a 404, confirm that the deployment includes this file, the Root Directory is correct, and the production build generated `dist/index.html`.

## Routes

### Public website

| Route | Purpose |
| --- | --- |
| / | Marketing homepage |
| /services | Services |
| /case-studies | Case studies |
| /blog | Blog |
| /about | About Twinblueprint |
| /how-it-works | Process overview |
| /faq | Frequently asked questions |

### CRM

| Route | Purpose |
| --- | --- |
| /crm/login | Admin login |
| /crm | CRM home and Demo & Lead Report form |
| /crm/dashboard | KPI, funnel, trend, and qualified-lead dashboard |
| /crm/leads | Active lead management |
| /crm/archived | Archived leads, restore, and delete |
| /crm/capture | Manual Add Lead form |
| /crm/pipeline | Pipeline workspace |
| /crm/outreach | Outreach workspace |
| /crm/emea | EMEA dashboard |
| /crm/americas | Americas dashboard |
| /crm/analytics | Analytics workspace |

## CRM lead lifecycle

~~~text
Visitor submits Demo & Lead Report
  -> POST /api/demo
  -> backend creates a new lead
  -> lead appears in /crm/leads
  -> admin qualifies and enriches the lead
  -> lead appears on Dashboard as qualified
  -> admin creates a bid or project
  -> record progresses through Pipeline
~~~

### Incoming demo requests

The CRM Home form loads options from GET /api/industries, then submits to POST /api/demo.

It captures basic contact data: name, work email, company, job title, phone, and industry. The backend creates a lead with default status new. The form always sends `confirmationEmail: true`, so the backend should email the submitted `workEmail` a confirmation and the personalised lead report.

### Qualification

An admin adds business information during review:

- Region
- Project and project size
- Phase
- Lead status
- Applications and application tools
- Score and temperature

Use PATCH /api/leads/:id to update this data. Leads with status qualified or won appear in the Dashboard Qualified Leads table.

## API integration

Protected requests use the JWT returned by login:

~~~http
Authorization: Bearer <token>
~~~

The backend is responsible for authorization. UI controls alone are not a security boundary.

### Authentication

~~~text
POST /api/auth/login
POST /api/auth/passcode
GET  /api/auth/me
POST /api/auth/logout
~~~

`POST /api/auth/passcode` accepts `{ "passcode": "..." }` and returns `{ user, token }` when the server-side admin passcode matches, `401` for a wrong passcode, `429` when rate-limited (5 attempts per 60s per IP), and `400` for an empty passcode. It is independent of username/password login and mints the same admin JWT the archive/delete endpoints already trust.

### Leads

~~~text
GET    /api/leads
GET    /api/leads/:id
POST   /api/leads
PATCH  /api/leads/:id
PATCH  /api/leads/:id/assign
DELETE /api/leads/:id
POST   /api/leads/import
GET    /api/leads/export
~~~

The Leads page uses live data, search, filters, pagination, Industry/Region options, CSV import/export, a details dialog, archive, restore, and delete actions. The Capture page sends `send_confirmation_email: true`, so creating a lead through POST /api/leads should email the lead's `email` address a confirmation.

Archive:

~~~json
{ "archived": true }
~~~

Archived leads are loaded with GET /api/leads?archived=true. Restore with archived set to false. Delete uses DELETE /api/leads/:id and should be admin-only.

### Supporting options and regions

~~~text
GET /api/industries
GET /api/regions
GET /api/regions/emea
GET /api/regions/americas
~~~

### Dashboard

~~~text
GET /api/analytics/kpis
GET /api/analytics/weekly?weeks=8
GET /api/analytics/funnel
GET /api/leads
GET /api/bids
GET /api/projects
GET /api/campaigns
~~~

### Pipeline

~~~text
GET    /api/pipeline
GET    /api/bids
POST   /api/bids
PATCH  /api/bids/:id
DELETE /api/bids/:id
GET    /api/projects
POST   /api/projects
PATCH  /api/projects/:id
DELETE /api/projects/:id
~~~

## Current integration status

Connected to the Express API:

- Authentication
- Demo request submission
- Industry and region option lists
- Leads list, filters, pagination, import, export, archive/restore, delete, and detail view
- Dashboard KPIs, analytics, qualified leads, bids, projects, and campaigns

Outreach, EMEA, Americas, and Analytics now consume live API responses with loading, retry, and empty states. Outreach supports preview/send, paginated email history, campaign create/update/delete, and campaign tracking statistics. LinkedIn messages can be previewed and copied for manual sending. Persistent four-touch sequences use `/api/outreach/sequences`, with lead history, 15-second progress refresh, admin-only creation and controls, editable unattempted steps, manual completion notes, and linked email tracking. Recording a reply explicitly pauses the sequence; reply detection is not automatic. Resume retains due dates and can dispatch overdue emails immediately.

Outreach activity cards use `GET /api/outreach/stats` with one shared reporting period. The default omits both bounds for a rolling 30-day window; custom bounds send `start` and `end` as UTC timestamps. Null metrics show “Unavailable”; zero remains zero; response rate is already a percentage. The existing email metrics endpoint does not support periods, so those cards are explicitly labeled “All time”.

Admins can record and view replies and meetings for a selected lead through `/api/outreach/replies` and `/api/outreach/meetings`. Creation generates a UUID once and retains the exact payload for retries after uncertain failures. Meetings are rescheduled and outcomes updated with PATCH using their existing ID; unchanged scheduled times retain their original precision. Saving a reply automatically pauses its applicable active sequence on the backend; a manual pause alone does not create a reply record. Successful activity changes invalidate Outreach stats, lead activity, and sequence progress.

Live scheduled-send testing remains on hold. The backend team must apply the CRM, sequence, and activity migrations in order (`scripts/outreach-sequences-migration.sql`, then `scripts/outreach-activity-migration.sql` after CRM), enable `OUTREACH_SCHEDULER_ENABLED=true`, and keep at least one backend worker process running with `RESEND_API_KEY` and `FROM_EMAIL` configured. The stats response reports schema readiness and the scheduler flag, but these do not establish worker health or provider readiness. LinkedIn and phone activities stay manual; completing them is not a prerequisite for scheduled email delivery. Archived leads cancel sequences and closed outcomes pause them on the backend. Immediate email and Deal Flow endpoints are unchanged.

Regional dashboards label in-flight counts as leads and country data as region groupings, matching the current backend semantics. Pipeline values are shown without an assumed currency. The workflow field is not displayed until its item structure is documented.

## Project structure

~~~text
src/
  components/       Public-site components and UI primitives
  crm/
    components/     CRM-specific components
    layout/         CRM navigation and footer
    pages/          CRM route pages
  hooks/            React Query API hooks and authentication
  lib/              API client, shared types, utilities
  pages/            Public-site route pages
  App.tsx           Application routes and providers
~~~

## Commands

~~~bash
npm run dev        # Start Vite on port 8080
npm run build      # Production build
npm run build:dev  # Development-mode build
npm run lint       # ESLint
npm run test       # Run Vitest once
npm run test:watch # Run Vitest in watch mode
~~~

## Backend handoff expectations

### Standalone LinkedIn activity

Admins can use **Outreach → LinkedIn CTA → Mark as sent** after manually sending the previewed message. The frontend posts `{ id, lead_id, message, sent_at }` to `/api/outreach/linkedin-sends` through the authenticated API client. Failed saves retain the exact UUID and payload for explicit retry while the Outreach page remains open, including when switching tabs. Success refreshes outreach history/statistics and analytics. This action does not send a LinkedIn message or change any sequence step. Use sequence completion instead when recording a sequence activity.

The lead history requests `GET /api/outreach/linkedin-sends?lead_id=<id>`. Its current frontend response assumption is the standard success envelope with `data.linkedin_sends` containing the records; the backend handoff has not yet confirmed the list field or pagination contract. Unexpected response shapes show an error. Confirm this shape before live acceptance. The backend endpoint requires its migration and deployment before live integration testing.

The API should:

- Return the common response envelope: success, data, and optional message.
- Enforce authentication and admin-only permissions on protected actions.
- Treat leads.archived as the source of truth for archived state.
- Return lead fields used by the CRM: industry, region, project, project_size, phase, status, lead_status, applications, score, temperature, and archived.
- Send a confirmation email to the submitted address when creating via POST /api/demo with `confirmationEmail: true` and via POST /api/leads with `send_confirmation_email: true`. Confirmations use the submitted `workEmail`/`email` field (RESEND_API_KEY and FROM_EMAIL).

## License

Proprietary software. All rights reserved.

