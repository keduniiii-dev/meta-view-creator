import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Outreach from "@/crm/pages/Outreach";
import { api } from "@/lib/api";

vi.mock("@/lib/api", () => ({ api: { get: vi.fn(), post: vi.fn(), postCreated: vi.fn() } }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("@/hooks/useAuth", () => ({ useAuth: () => ({ user: { role: "admin" } }) }));
Object.defineProperty(HTMLElement.prototype, "scrollIntoView", { configurable: true, value: vi.fn() });
Object.defineProperty(HTMLElement.prototype, "hasPointerCapture", { configurable: true, value: () => false });
Object.defineProperty(HTMLElement.prototype, "releasePointerCapture", { configurable: true, value: vi.fn() });
const clients: QueryClient[] = [];
afterEach(() => { cleanup(); clients.forEach(client => client.clear()); clients.length = 0; vi.resetAllMocks(); });
function setup() {
  vi.mocked(api.get).mockImplementation(async (path) => {
    if (path === "/campaigns/stats") return { total_sent: 0, total_opens: 0, total_clicks: 0, avg_ctr: 0 };
    if (path === "/outreach/stats") return { linkedin_sent: null, response_rate: null, meetings_booked: null };
    if (path === "/outreach/replies") return { replies: [], pagination: { page: 1, pages: 0 } };
    if (path === "/outreach/meetings") return { meetings: [], pagination: { page: 1, pages: 0 } };
    if (path === "/leads") return { leads: [{ id: "lead-1", full_name: "Alex", email: "alex@example.com", company: "Example Ltd" }], pagination: { page: 1, pages: 1 } };
    if (path === "/campaigns") return { campaigns: [], pagination: { page: 1, pages: 0 } };
    if (path === "/outreach/sequences") return { sequences: [], pagination: { page: 1, pages: 0 } };
    if (path === "/pipeline") return { stages: [{ name: "Proposal", count: 1, value: 25000, leads: [{ id: "pipeline-lead", full_name: "Sarah Chen", company: "Gensler", project: "SF Tower", email: "sarah@example.com", status: "proposal", archived: false }], bids: [] }] };
    return { messages: [], pagination: { page: 1, pages: 0 } };
  });
  vi.mocked(api.post).mockResolvedValue({ recipient: "alex@example.com", subject: "Rendered subject", html: "<p>Rendered body</p>" });
  vi.mocked(api.postCreated).mockResolvedValue({ message: { id: "message-1" } });
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  clients.push(client);
  render(<QueryClientProvider client={client}><Outreach /></QueryClientProvider>);
  return client;
}
describe("outreach integration", () => {
  it("cleans escaped preview markup and prevents sending the broken backend output", async () => {
    setup();
    vi.mocked(api.post).mockResolvedValue({ recipient: "sarah@example.com", subject: "Introduction", html: "&lt;p&gt;Hello Sarah&lt;/p&gt;" });
    fireEvent.click(await screen.findByRole("button", { name: /Gensler/ }));
    fireEvent.click(screen.getByRole("button", { name: "Preview" }));
    expect(await screen.findByRole("button", { name: "Send Email" })).toBeDisabled();
    expect(screen.getByTitle("Message preview").getAttribute("srcdoc")).toContain("<p>Hello Sarah</p>");
    expect(screen.getByRole("alert")).toHaveTextContent("server is escaping email formatting");
    expect(api.postCreated).not.toHaveBeenCalled();
  });
  it("selects a pipeline contact and previews escaped personalization for the chosen stage", async () => {
    setup();
    expect(screen.getByText("4-Touch Follow-Up Sequence")).toBeInTheDocument();
    fireEvent.click(await screen.findByRole("button", { name: /Gensler/ }));
    expect(screen.getByLabelText("Contact name")).toHaveValue("Sarah Chen");
    expect(screen.getByLabelText("Project")).toHaveValue("SF Tower");
    expect(screen.getByLabelText("Subject")).toHaveValue("[Proposal] Next steps on our proposal for {{project}}");
    fireEvent.change(screen.getByLabelText("Company"), { target: { value: "Gensler <Partners>" } });
    fireEvent.click(screen.getByRole("button", { name: "Preview" }));
    await screen.findByRole("button", { name: "Send Email" });
    expect(api.post).toHaveBeenCalledWith("/outreach/preview", expect.objectContaining({ lead_id: "pipeline-lead", subject: "[Proposal] Next steps on our proposal for SF Tower", template: expect.stringContaining("Gensler &lt;Partners&gt;") }));
    fireEvent.click(screen.getByRole("button", { name: "Negotiation" }));
    expect(screen.queryByRole("button", { name: "Send Email" })).toBeNull();
  });
  it("requires a current preview before sending and invalidates email data after success", async () => {
    const client = setup();
    const invalidate = vi.spyOn(client, "invalidateQueries");
    await waitFor(() => expect(screen.getByRole("combobox", { name: "Recipient" })).not.toBeDisabled());
    fireEvent.keyDown(screen.getByRole("combobox", { name: "Recipient" }), { key: "ArrowDown" });
    fireEvent.click(await screen.findByRole("option", { name: /Alex/ }));
    expect(screen.queryByRole("button", { name: "Send Email" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Preview" }));
    await screen.findByRole("button", { name: "Send Email" });
    fireEvent.change(screen.getByLabelText("Subject"), { target: { value: "Updated subject" } });
    expect(screen.queryByRole("button", { name: "Send Email" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Preview" }));
    fireEvent.click(await screen.findByRole("button", { name: "Send Email" }));
    await waitFor(() => expect(api.postCreated).toHaveBeenCalledWith("/outreach/send", expect.objectContaining({ lead_id: "lead-1", subject: "Updated subject", campaign_id: null })));
    await waitFor(() => expect(invalidate).toHaveBeenCalledWith({ queryKey: ["outreach"] }));
    expect((await screen.findByRole("button", { name: "Email sent" })).hasAttribute("disabled")).toBe(true);
  });
  it("does not expose a send action when preview fails", async () => {
    setup();
    vi.mocked(api.post).mockRejectedValue(new Error("Preview unavailable"));
    await waitFor(() => expect(screen.getByRole("combobox", { name: "Recipient" })).not.toBeDisabled());
    fireEvent.keyDown(screen.getByRole("combobox", { name: "Recipient" }), { key: "ArrowDown" });
    fireEvent.click(await screen.findByRole("option", { name: /Alex/ }));
    fireEvent.click(screen.getByRole("button", { name: "Preview" }));
    await screen.findByText("Preview unavailable");
    expect(screen.queryByRole("button", { name: "Send Email" })).toBeNull();
    expect(api.postCreated).not.toHaveBeenCalled();
  });
});
