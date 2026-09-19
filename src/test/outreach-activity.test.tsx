import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import OutreachActivity from "@/crm/components/OutreachActivity";
import OutreachMetrics from "@/crm/components/OutreachMetrics";
import { api } from "@/lib/api";
import type { Lead } from "@/lib/types";
import type { Meeting, OutreachStats } from "@/hooks/use-outreach-activity";
const auth = vi.hoisted(() => ({ role: "admin" }));
vi.mock("@/hooks/useAuth", () => ({ useAuth: () => ({ user: { role: auth.role } }) }));
vi.mock("@/lib/api", () => ({ api: { get: vi.fn(), post: vi.fn(), patch: vi.fn() }, ApiError: class extends Error { constructor(message: string, public status: number) { super(message); } } }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
Object.defineProperty(crypto, "randomUUID", { configurable: true, value: () => "13e95b5a-7ba9-4faa-8fc3-0b50fbed8bca" });
const lead = { id: "lead-a", full_name: "Sarah" } as Lead;
const meeting = { id: "meeting-a", lead_id: lead.id, scheduled_at: "2026-10-01T09:00:00Z", booked_at: "2026-08-01T09:00:00Z", status: "booked", notes: "Demo", outcome: "Old outcome", created_at: "2026-08-01T09:00:00Z" } as Meeting;
const clients: QueryClient[] = [];
function setup({ metrics = false, values = {}, meetings = [] }: { metrics?: boolean; values?: Partial<OutreachStats>; meetings?: Meeting[] } = {}) {
  vi.mocked(api.get).mockImplementation(async path => {
    if (path === "/campaigns/stats") return { total_sent: 4, total_opens: 2, avg_ctr: 25 };
    if (path === "/outreach/stats") return { linkedin_sent: 0, response_rate: 12.5, meetings_booked: null, ...values };
    if (path === "/outreach/replies") return { replies: [], pagination: { page: 1, pages: 0 } };
    if (path === "/outreach/meetings") return { meetings, pagination: { page: 1, pages: meetings.length ? 1 : 0 } };
  });
  vi.mocked(api.post).mockResolvedValue({ id: "saved" });
  vi.mocked(api.patch).mockResolvedValue(meeting);
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  clients.push(client);
  render(<QueryClientProvider client={client}>{metrics ? <OutreachMetrics /> : <OutreachActivity lead={lead} />}</QueryClientProvider>);
  return client;
}
afterEach(() => { cleanup(); clients.forEach(client => client.clear()); clients.length = 0; vi.resetAllMocks(); auth.role = "admin"; });
describe("outreach activity integration", () => {
  it("shows zero activity, percentages without multiplying, and unavailable metrics distinctly", async () => {
    setup({ metrics: true });
    expect(await screen.findByText("12.5%")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("Unavailable")).toBeInTheDocument();
    expect(api.get).toHaveBeenCalledWith("/outreach/stats", {});
  });
  it("uses one period request for all three metrics and rejects reversed bounds", async () => {
    setup({ metrics: true });
    await screen.findByText("12.5%");
    fireEvent.change(screen.getByLabelText("Activity period start (local time)"), { target: { value: "2026-08-01T00:00" } });
    fireEvent.change(screen.getByLabelText("Activity period end (exclusive, local time)"), { target: { value: "2026-09-01T00:00" } });
    fireEvent.click(screen.getByRole("button", { name: "Apply period" }));
    await waitFor(() => expect(api.get).toHaveBeenCalledWith("/outreach/stats", { start: new Date("2026-08-01T00:00").toISOString(), end: new Date("2026-09-01T00:00").toISOString() }));
    const count = vi.mocked(api.get).mock.calls.length;
    fireEvent.change(screen.getByLabelText("Activity period end (exclusive, local time)"), { target: { value: "2026-07-01T00:00" } });
    fireEvent.click(screen.getByRole("button", { name: "Apply period" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("end time after");
    expect(api.get).toHaveBeenCalledTimes(count);
  });
  it("retries a reply with the identical ID and payload and refreshes stats, activity, and sequences", async () => {
    const client = setup();
    const invalidate = vi.spyOn(client, "invalidateQueries");
    vi.mocked(api.post).mockRejectedValueOnce(new Error("Connection interrupted"));
    fireEvent.click(screen.getByRole("button", { name: "Record reply" }));
    fireEvent.change(screen.getByLabelText("Reply time (local time)"), { target: { value: "2026-08-01T10:00" } });
    fireEvent.change(screen.getByLabelText("Activity notes"), { target: { value: "Interested in a demo" } });
    fireEvent.click(screen.getByRole("button", { name: "Save activity" }));
    await screen.findByText("Connection interrupted");
    const original = vi.mocked(api.post).mock.calls[0];
    expect(original).toEqual(["/outreach/replies", { id: "13e95b5a-7ba9-4faa-8fc3-0b50fbed8bca", lead_id: "lead-a", channel: "email", replied_at: new Date("2026-08-01T10:00").toISOString(), notes: "Interested in a demo" }]);
    expect(screen.getByLabelText("Activity notes")).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Retry save" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(vi.mocked(api.post).mock.calls[1]).toEqual(original);
    expect(vi.mocked(api.post).mock.calls.some(([path]) => path.endsWith("/pause"))).toBe(false);
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["outreach"] });
  });
  it("records a meeting and preserves its booking ID on retry", async () => {
    setup();
    vi.mocked(api.post).mockRejectedValueOnce(new Error("Try again"));
    fireEvent.click(screen.getByRole("button", { name: "Record meeting" }));
    fireEvent.change(screen.getByLabelText("Scheduled time (local time)"), { target: { value: "2026-10-01T12:00" } });
    fireEvent.click(screen.getByRole("button", { name: "Save activity" }));
    await screen.findByText("Try again");
    const original = vi.mocked(api.post).mock.calls[0];
    expect(original[0]).toBe("/outreach/meetings");
    fireEvent.click(screen.getByRole("button", { name: "Retry save" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(vi.mocked(api.post).mock.calls[1]).toEqual(original);
  });
  it("reschedules with PATCH, preserves booking identity, and clears outcome with null", async () => {
    setup({ meetings: [meeting] });
    fireEvent.click(await screen.findByRole("button", { name: /Update meeting/ }));
    fireEvent.change(screen.getByLabelText("Scheduled time (local time)"), { target: { value: "2026-10-02T14:00" } });
    fireEvent.change(screen.getByLabelText("Outcome"), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: "Save activity" }));
    await waitFor(() => expect(api.patch).toHaveBeenCalledWith("/outreach/meetings/meeting-a", { scheduled_at: new Date("2026-10-02T14:00").toISOString(), status: "booked", notes: "Demo", outcome: null }));
    expect(api.post).not.toHaveBeenCalled();
  });
  it("does not offer activity writes to non-admins", async () => {
    auth.role = "user"; setup({ meetings: [meeting] });
    await screen.findByText("Demo");
    expect(screen.queryByRole("button", { name: "Record reply" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Record meeting" })).toBeNull();
    expect(screen.queryByRole("button", { name: /Update meeting/ })).toBeNull();
  });
  it("preserves a meeting's exact scheduled time when only its outcome changes", async () => {
    setup({ meetings: [{ ...meeting, scheduled_at: "2026-10-01T09:00:43.123Z" }] });
    fireEvent.click(await screen.findByRole("button", { name: /Update meeting/ }));
    fireEvent.change(screen.getByLabelText("Outcome"), { target: { value: "Proposal requested" } });
    fireEvent.click(screen.getByRole("button", { name: "Save activity" }));
    await waitFor(() => expect(api.patch).toHaveBeenCalledWith("/outreach/meetings/meeting-a", { status: "booked", notes: "Demo", outcome: "Proposal requested" }));
  });
  it("rejects future reply timestamps without sending a request", async () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: "Record reply" }));
    fireEvent.change(screen.getByLabelText("Reply time (local time)"), { target: { value: "2099-08-01T10:00" } });
    fireEvent.click(screen.getByRole("button", { name: "Save activity" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("cannot be in the future");
    expect(api.post).not.toHaveBeenCalled();
  });
});
