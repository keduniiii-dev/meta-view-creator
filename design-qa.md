# Outreach additions

- Source visual truth: two screenshots attached in the user request.
- Implementation: `/crm/outreach`, Email Templates tab.
- Implementation screenshot: unavailable; no browser tools exposed in this session.
- Viewport and density comparison: not captured.
- State: four suggested follow-up touches, live pipeline stages, selected contact and stage-specific composer.
- Full-view and focused-region comparisons: blocked pending browser capture.
- Intentional differences: live API values replace example totals; suggested cadence replaces unverified sent/scheduled statuses. Existing email preview and campaign selection are retained.
- Interaction verification: automated tests cover pipeline selection, stage templates, escaped personalization, stale-preview prevention, and send behavior.
- TypeScript verification: no Outreach errors; project check is blocked by existing missing `getPipelineData` exports in `src/crm/lib/store.ts` and `src/test/pipeline.test.ts`.
- Visual findings and console checks: not assessed without a browser.
- Comparison history: no rendered comparison available.

## EMEA reference implementation

- Source: user-provided EMEA screenshot with compact summary cards, three workflow slots, and full-width regional chart panels.
- Implementation: `src/crm/pages/Emea.tsx`; existing shadcn cards, badges, and Recharts components. Summary grid supports five desktop columns; workflow and chart/detail columns stack on mobile.
- Data differences: live totals replace sample metrics; currency is not invented. Backend currently returns regional totals as the country breakdown and no recommended tools. The chart identifies regional totals accurately. Workflow is the suggested schedule from the reference, not a persisted backend schedule.
- Browser capture and visual comparison: unavailable in this session. No claim of pixel-perfect or browser-verified completion.

final result: blocked
