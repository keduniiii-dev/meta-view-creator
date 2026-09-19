import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/useAuth";
import { api, setToken } from "@/lib/api";
import Leads from "@/crm/pages/Leads";
import ArchivedLeads from "@/crm/pages/ArchivedLeads";
import CrmLayout from "@/crm/layout/CrmLayout";

vi.mock("@/lib/api", () => ({ api: { get: vi.fn(), post: vi.fn() }, setToken: vi.fn(), clearToken: vi.fn() }));
const clients: QueryClient[] = [];
let meUser: { user: { id: number; username: string; role: string } } = { user: { id: 1, username: "member", role: "user" } };
function setup(path = "/crm/leads") {
  localStorage.setItem("crm_token", "existing-session");
  vi.mocked(api.get).mockImplementation(async url => {
    if (url === "/auth/me") return meUser;
    if (url === "/leads/options") return { statuses: [], industries: [], regions: [], phases: [] };
    if (url === "/industries") return { industries: [] };
    if (url === "/regions") return { regions: [] };
    return { leads: [], pagination: { page: 1, pages: 0, total: 0 } };
  });
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  clients.push(client);
  render(<QueryClientProvider client={client}><AuthProvider><MemoryRouter initialEntries={[path]}><Routes><Route element={<CrmLayout />}><Route path="/crm/leads" element={<Leads />} /><Route path="/crm/archived" element={<ArchivedLeads />} /></Route></Routes></MemoryRouter></AuthProvider></QueryClientProvider>);
}
afterEach(() => { cleanup(); clients.forEach(client => client.clear()); clients.length = 0; localStorage.clear(); vi.resetAllMocks(); meUser = { user: { id: 1, username: "member", role: "user" } }; });
async function submitLogin() {
  fireEvent.click(await screen.findByRole("button", { name: "Admin" }));
  fireEvent.change(screen.getByLabelText("Admin passcode"), { target: { value: "test-passcode" } });
  fireEvent.click(screen.getByRole("button", { name: "Unlock" }));
}
it("opens admin login from Leads and unlocks the archive with a valid passcode", async () => {
  setup();
  meUser = { user: { id: 2, username: "admin", role: "admin" } };
  vi.mocked(api.post).mockResolvedValue({ user: { id: 2, username: "admin", role: "admin" }, token: "admin-session" });
  expect(screen.queryAllByRole("link", { name: "Archived" })).toHaveLength(0);
  await submitLogin();
  expect(await screen.findByRole("heading", { name: "Archived Leads" })).toBeInTheDocument();
  expect(api.post).toHaveBeenCalledWith("/auth/passcode", { passcode: "test-passcode" });
  expect(setToken).toHaveBeenCalledWith("admin-session");
  expect(screen.queryByRole("dialog")).toBeNull();
});
it("rejects a passcode mapped to a non-admin account without entering the archive", async () => {
  setup();
  vi.mocked(api.post).mockResolvedValue({ user: { id: 3, role: "user" }, token: "not-admin" });
  await submitLogin();
  expect(await screen.findByRole("alert")).toHaveTextContent("administrator account is required");
  expect(screen.getByLabelText("Admin passcode")).toHaveValue("");
  expect(screen.queryByRole("heading", { name: "Archived Leads" })).toBeNull();
});
it("shows invalid passcode errors and supports cancelling without navigation", async () => {
  setup();
  vi.mocked(api.post).mockRejectedValue(Object.assign(new Error("Invalid admin passcode"), { status: 401 }));
  await submitLogin();
  expect(await screen.findByRole("alert")).toHaveTextContent("Invalid admin passcode");
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(screen.getByRole("heading", { name: "Leads", level: 1 })).toBeInTheDocument();
});
it("disables the unlock button after too many attempts", async () => {
  setup();
  vi.mocked(api.post).mockRejectedValue(Object.assign(new Error("Too many attempts"), { status: 429 }));
  await submitLogin();
  expect(await screen.findByRole("alert")).toHaveTextContent("Too many attempts, try again in a minute");
  expect(screen.getByRole("button", { name: "Unlock" })).toBeDisabled();
});
it("redirects non-admin direct archive visits before loading archived records", async () => {
  setup("/crm/archived");
  await waitFor(() => expect(screen.getByRole("heading", { name: "Leads", level: 1 })).toBeInTheDocument());
  expect(vi.mocked(api.get).mock.calls.some(([url, params]) => url === "/leads" && params?.archived === true)).toBe(false);
});