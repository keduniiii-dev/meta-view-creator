import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { expect, it, vi } from "vitest";
import Leads from "@/crm/pages/Leads";
import { api } from "@/lib/api";

vi.mock("@/lib/api", () => ({ api: { get: vi.fn(), patch: vi.fn(), download: vi.fn() } }));

it("saves status and project size and invalidates leads and pipeline", async () => {
  const lead = { id: "vibely", full_name: "Oluwatobi Odus", email: "test@example.com", company: "Vibely", status: "new", project_size: null };
  vi.mocked(api.get).mockImplementation(async (path) => {
    if (path === "/leads/options") return { statuses: ["new", "won"], industries: [], regions: [], phases: [] };
    if (path === "/industries") return { industries: [] };
    if (path === "/regions") return { regions: [] };
    return { leads: [lead], pagination: { page: 1, pages: 1, total: 1, limit: 20 } };
  });
  vi.mocked(api.patch).mockResolvedValue({ lead });
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  const invalidate = vi.spyOn(client, "invalidateQueries");
  const view = render(<QueryClientProvider client={client}><MemoryRouter><Leads /></MemoryRouter></QueryClientProvider>);
  fireEvent.click(await screen.findByRole("button", { name: "Edit Oluwatobi Odus" }, { timeout: 10000 }));
  fireEvent.keyDown(screen.getByLabelText("Status"), { key: "Enter" });
  fireEvent.click(await screen.findByRole("option", { name: "Closed Won" }));
  fireEvent.change(screen.getByLabelText("Project size"), { target: { value: "$800M–$900M" } });
  fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
  await waitFor(() => expect(api.patch).toHaveBeenCalledWith("/leads/vibely", expect.objectContaining({ status: "won", project_size: "$800M–$900M" })));
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  expect(invalidate).toHaveBeenCalledWith({ queryKey: ["leads"] });
  expect(invalidate).toHaveBeenCalledWith({ queryKey: ["pipeline"] });
  view.unmount();
  client.clear();
});

it("shows export failures and allows retry", async () => {
  vi.mocked(api.get).mockImplementation(async (path) => {
    if (path === "/leads/options") return { statuses: ["new", "won"], industries: [], regions: [], phases: [] };
    if (path === "/industries") return { industries: [] };
    if (path === "/regions") return { regions: [] };
    return { leads: [], pagination: { page: 1, pages: 1, total: 0, limit: 20 } };
  });
  vi.mocked(api.download).mockRejectedValue(new Error("Export endpoint unavailable"));
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const view = render(<QueryClientProvider client={client}><MemoryRouter><Leads /></MemoryRouter></QueryClientProvider>);
  fireEvent.click(screen.getByRole("button", { name: "Export CSV" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Export endpoint unavailable");
  expect(screen.getByRole("button", { name: "Export CSV" })).toBeEnabled();
  expect(api.download).toHaveBeenCalledWith("/leads/export", expect.objectContaining({ archived: false }));
  view.unmount();
  client.clear();
});

it("downloads the CSV using an attached link", async () => {
  const csvBlob = new Blob(["name\nExample"], { type: "text/csv" });
  Object.defineProperty(csvBlob, "text", { value: async () => "name\nExample" });
  vi.mocked(api.download).mockResolvedValue({ data: csvBlob, headers: { "content-type": "text/csv" } } as never);
  const create = vi.fn(() => "blob:export");
  Object.defineProperty(URL, "createObjectURL", { configurable: true, value: create });
  Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: vi.fn() });
  const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function () {
    expect(document.body.contains(this)).toBe(true);
    expect(this.download).toBe("twinblueprint-leads.csv");
  });
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const view = render(<QueryClientProvider client={client}><MemoryRouter><Leads /></MemoryRouter></QueryClientProvider>);
  fireEvent.click(screen.getByRole("button", { name: "Export CSV" }));
  await waitFor(() => expect(click).toHaveBeenCalledOnce());
  expect(create).toHaveBeenCalledOnce();
  view.unmount();
  client.clear();
  click.mockRestore();
});