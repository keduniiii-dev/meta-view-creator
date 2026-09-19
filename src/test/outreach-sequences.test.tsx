import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FollowUpSequence from "@/crm/components/FollowUpSequence";
import { api } from "@/lib/api";
import type { Lead } from "@/lib/types";
import type { OutreachSequence, SequenceStep } from "@/hooks/use-outreach-sequences";

const auth = vi.hoisted(() => ({ role: "admin" }));
vi.mock("@/hooks/useAuth", () => ({ useAuth: () => ({ user: { role: auth.role } }) }));
vi.mock("@/lib/api", () => ({ api: { get: vi.fn(), post: vi.fn(), patch: vi.fn() } }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
const lead = { id: "lead-a", full_name: "Sarah", company: "Gensler", project: "Tower", status: "qualified", archived: false } as Lead;
const makeStep = (position: number, channel: SequenceStep["channel"], status: SequenceStep["status"]): SequenceStep => ({ id: `step-${position}`, position, channel, status, message: "Saved message", subject: channel === "email" ? "Saved subject" : undefined, due_at: "2026-10-01T09:00:00Z", completed_at: null, notes: null, attempt_count: 0, lease_token: null, next_attempt_at: null, last_error: null, sent_email: null });
function makeSequence(): OutreachSequence { return { id: "seq-a", lead_id: lead.id, status: "active", start_at: "2026-10-01T09:00:00Z", created_at: "2026-09-12T09:00:00Z", steps: [makeStep(1, "linkedin", "pending"), makeStep(2, "email", "scheduled"), makeStep(3, "email", "scheduled"), makeStep(4, "phone", "pending")] }; }
const clients: QueryClient[] = [];
function setup(initial: OutreachSequence | null = makeSequence()) {
  let saved = initial;
  vi.mocked(api.get).mockImplementation(async path => path === "/outreach/sequences" ? { sequences: saved ? [saved] : [], pagination: { page: 1, pages: saved ? 1 : 0, total: saved ? 1 : 0, limit: 20 } } : saved);
  vi.mocked(api.post).mockImplementation(async (path, body) => {
    if (path === "/outreach/sequences") saved = makeSequence();
    else if (saved && path.endsWith("/pause")) saved = { ...saved, status: "paused" };
    else if (saved && path.endsWith("/resume")) saved = { ...saved, status: "active" };
    else if (saved && path.endsWith("/cancel")) saved = { ...saved, status: "cancelled" };
    else if (saved && path.endsWith("/complete")) saved = { ...saved, steps: saved.steps.map(step => step.id === "step-1" ? { ...step, status: "completed", notes: (body as { notes: string }).notes } : step) };
    return saved;
  });
  vi.mocked(api.patch).mockImplementation(async () => saved);
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  clients.push(client);
  render(<QueryClientProvider client={client}><FollowUpSequence lead={lead} subject="[Qualified] Tower" message="<p>Hello Sarah</p>" /></QueryClientProvider>);
  return client;
}
afterEach(() => { cleanup(); clients.forEach(client => client.clear()); clients.length = 0; vi.resetAllMocks(); auth.role = "admin"; });

describe("persistent outreach sequences", () => {
  it("starts with reviewed stage copy and an ISO start time, then shows saved steps", async () => {
    setup(null);
    fireEvent.click(await screen.findByRole("button", { name: "Set up sequence" }));
    expect(screen.getByLabelText("Step 2 subject")).toHaveValue("[Qualified] Tower");
    expect(screen.getByLabelText("Step 2 message")).toHaveValue("Hello Sarah");
    fireEvent.change(screen.getByLabelText("Start time (optional, local time)"), { target: { value: "2026-10-01T10:30" } });
    fireEvent.click(screen.getByRole("button", { name: "Start sequence" }));
    await screen.findByText("Active");
    expect(api.post).toHaveBeenCalledWith("/outreach/sequences", { lead_id: "lead-a", start_at: new Date("2026-10-01T10:30").toISOString(), steps: [expect.objectContaining({ channel: "linkedin" }), { channel: "email", subject: "[Qualified] Tower", message: "<p>Hello Sarah</p>" }, expect.objectContaining({ channel: "email" }), expect.objectContaining({ channel: "phone" })] });
    expect(screen.getAllByText(/^Due /)).toHaveLength(4);
  });
  it("completes manual activity with notes, never offering manual email completion", async () => {
    setup();
    fireEvent.click(await screen.findByRole("button", { name: "Complete step 1" }));
    expect(screen.queryByRole("button", { name: "Complete step 2" })).toBeNull();
    fireEvent.change(screen.getByLabelText("Notes (optional)"), { target: { value: "Connected on LinkedIn" } });
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    await screen.findByText("Completed");
    expect(api.post).toHaveBeenCalledWith("/outreach/sequences/seq-a/steps/step-1/complete", { notes: "Connected on LinkedIn" });
  });
  it("pauses manually and requires confirmation before resuming", async () => {
    setup();
    fireEvent.click(await screen.findByRole("button", { name: "Pause" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    await screen.findByText("Paused");
    expect(api.post).toHaveBeenCalledWith("/outreach/sequences/seq-a/pause", { reason: "manual", notes: "" });
    fireEvent.click(screen.getByRole("button", { name: "Resume" }));
    expect(screen.getByText(/Overdue emails may send immediately/)).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalledWith("/outreach/sequences/seq-a/resume", expect.anything());
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    await screen.findByText("Active");
    expect(api.post).toHaveBeenCalledWith("/outreach/sequences/seq-a/resume", { notes: "" });
  });
  it("reschedules an unattempted email using final copy and ISO dates", async () => {
    setup();
    fireEvent.click(await screen.findByRole("button", { name: "Edit step 2" }));
    fireEvent.change(screen.getByLabelText("Due time (local time)"), { target: { value: "2026-10-08T12:00" } });
    fireEvent.change(screen.getByLabelText("Step 2 subject"), { target: { value: "Updated final subject" } });
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    await waitFor(() => expect(api.patch).toHaveBeenCalledWith("/outreach/sequences/seq-a/steps/step-2", { due_at: new Date("2026-10-08T12:00").toISOString(), subject: "Updated final subject", message: "Saved message" }));
  });
  it("locks attempted emails and exposes failure and sent-email details", async () => {
    const sequence = makeSequence();
    sequence.steps[1] = { ...sequence.steps[1], status: "failed", attempt_count: 5, last_error: "Delivery uncertain" };
    sequence.steps[2] = { ...sequence.steps[2], status: "sent", attempt_count: 1, sent_email: { id: "mail-1", recipient: "sarah@example.com", subject: "Tracked email", status: "delivered" } as SequenceStep["sent_email"] };
    setup(sequence);
    await screen.findByText("Delivery uncertain");
    expect(screen.queryByRole("button", { name: "Edit step 2" })).toBeNull();
    expect(screen.getByRole("button", { name: "Skip step 2" })).toBeInTheDocument();
    expect(screen.getByText("Sent email: delivered")).toBeInTheDocument();
  });
  it("keeps non-admin access read-only", async () => {
    auth.role = "user"; setup();
    await screen.findByText("Active");
    expect(screen.queryByRole("button", { name: "Pause" })).toBeNull();
    expect(screen.queryByRole("button", { name: /Edit step/ })).toBeNull();
    expect(screen.queryByRole("button", { name: /Complete step/ })).toBeNull();
    expect(screen.queryByRole("button", { name: "Set up sequence" })).toBeNull();
  });
  it("retains form input and displays backend conflicts", async () => {
    setup();
    vi.mocked(api.patch).mockRejectedValue(new Error("Attempted email payloads cannot be edited or rescheduled"));
    fireEvent.click(await screen.findByRole("button", { name: "Edit step 2" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Attempted email payloads");
    expect(screen.getByLabelText("Step 2 subject")).toHaveValue("Saved subject");
  });
  it("skips and cancels through the documented routes", async () => {
    setup();
    fireEvent.click(await screen.findByRole("button", { name: "Skip step 1" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(api.post).toHaveBeenCalledWith("/outreach/sequences/seq-a/steps/step-1/skip", { notes: "" });
    fireEvent.click(screen.getByRole("button", { name: "Cancel sequence" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    await screen.findByText("Cancelled");
    expect(api.post).toHaveBeenCalledWith("/outreach/sequences/seq-a/cancel", { notes: "" });
  });
});
