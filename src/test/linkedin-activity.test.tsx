import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import LinkedInActivity from "@/crm/components/LinkedInActivity";

const auth = vi.hoisted(() => ({ role: "admin" }));
vi.mock("@/hooks/useAuth", () => ({ useAuth: () => ({ user: { role: auth.role } }) }));
vi.mock("@/lib/api", () => ({ api: { get: vi.fn(), post: vi.fn() } }));
vi.mock("sonner", () => ({ toast: { success: vi.fn() } }));
const clients: QueryClient[] = [];
afterEach(() => { cleanup(); clients.forEach(client => client.clear()); clients.length = 0; vi.resetAllMocks(); auth.role = "admin"; });
function setup(message = "Hi Sarah, can we discuss your project?", history: unknown = { linkedin_sends: [] }) {
  if (history instanceof Error) vi.mocked(api.get).mockRejectedValue(history);
  else vi.mocked(api.get).mockResolvedValue(history);
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  clients.push(client);
  const view = (leadId: string, text: string) => <QueryClientProvider client={client}><LinkedInActivity leadId={leadId} message={text} /></QueryClientProvider>;
  const result = render(view("lead-a", message));
  return { client, change: (leadId: string, text: string) => result.rerender(view(leadId, text)) };
}
it("records the exact message only once while saving and refreshes history and statistics", async () => {
  const { client } = setup();
  const invalidate = vi.spyOn(client, "invalidateQueries");
  let finish!: (value: unknown) => void;
  vi.mocked(api.post).mockImplementation(() => new Promise(resolve => { finish = resolve; }));
  fireEvent.click(screen.getByRole("button", { name: "Mark as sent" }));
  expect(await screen.findByRole("button", { name: "Saving..." })).toBeDisabled();
  expect(toast.success).not.toHaveBeenCalled();
  await waitFor(() => expect(api.post).toHaveBeenCalledTimes(1));
  expect(api.post).toHaveBeenCalledWith("/outreach/linkedin-sends", {
    id: expect.any(String), lead_id: "lead-a", message: "Hi Sarah, can we discuss your project?", sent_at: expect.any(String),
  });
  finish({ id: "saved" });
  await waitFor(() => expect(toast.success).toHaveBeenCalledWith("LinkedIn activity saved"));
  expect(await screen.findByRole("button", { name: "Activity saved" })).toBeDisabled();
  expect(invalidate).toHaveBeenCalledWith({ queryKey: ["outreach"] });
  expect(api.get).toHaveBeenCalledWith("/outreach/linkedin-sends", { lead_id: "lead-a" });
});
it("retries the same UUID, lead, exact text and timestamp even when the selection changes", async () => {
  const { change } = setup("Exact message\nwith a second line");
  vi.mocked(api.post).mockRejectedValueOnce(new Error("Connection lost")).mockResolvedValueOnce({});
  fireEvent.click(screen.getByRole("button", { name: "Mark as sent" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Connection lost");
  expect(toast.success).not.toHaveBeenCalled();
  const original = vi.mocked(api.post).mock.calls[0][1];
  change("lead-b", "Different message");
  fireEvent.click(screen.getByRole("button", { name: "Retry save" }));
  await waitFor(() => expect(toast.success).toHaveBeenCalled());
  expect(vi.mocked(api.post).mock.calls[1][1]).toEqual(original);
  expect(api.post).toHaveBeenCalledTimes(2);
});
it("shows saved history and no recording button for non-admins", async () => {
  auth.role = "user";
  setup(undefined, { linkedin_sends: [{ id: "one", lead_id: "lead-a", message: "Previously sent", sent_at: "2026-09-21T09:00:00Z" }] });
  expect(await screen.findByText("Previously sent")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Mark as sent" })).toBeNull();
  expect(api.post).not.toHaveBeenCalled();
});
it("requires a preview message and shows API failures instead of local history", async () => {
  setup("", new Error("Not deployed"));
  expect(screen.getByRole("button", { name: "Mark as sent" })).toBeDisabled();
  expect(await screen.findByRole("alert")).toHaveTextContent("Could not load LinkedIn activity");
  expect(screen.queryByText("No LinkedIn messages recorded.")).toBeNull();
});
