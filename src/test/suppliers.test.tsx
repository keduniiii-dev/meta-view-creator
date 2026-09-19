import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expect, it, vi } from "vitest";
import { api } from "@/lib/api";
import { useLinkSupplier, useSaveSupplier } from "@/hooks/use-suppliers";
import type { ReactNode } from "react";
vi.mock("@/lib/api", () => ({ api: { put: vi.fn(), post: vi.fn(), patch: vi.fn() } }));
it("links suppliers with PUT and refreshes pipeline data", async () => {
  vi.mocked(api.put).mockResolvedValue({});
  const client = new QueryClient();
  const invalidate = vi.spyOn(client, "invalidateQueries");
  const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  const hook = renderHook(() => useLinkSupplier(), { wrapper });
  await act(async () => { await hook.result.current.mutateAsync({ bidId: "bid1", supplierId: "supplier1" }); });
  expect(api.put).toHaveBeenCalledWith("/bids/bid1/suppliers/supplier1");
  expect(invalidate).toHaveBeenCalledWith({ queryKey: ["pipeline"] });
  hook.unmount(); client.clear();
});
it("creates supplier profiles preserving unknown values", async () => {
  vi.mocked(api.post).mockResolvedValue({ supplier: { id: "s1" } });
  const client = new QueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  const hook = renderHook(() => useSaveSupplier(), { wrapper });
  const data = { name: "Supplier", role: null, tools: [], temperature: null, contact: { name: null, job_title: null, email: null }, visualisation_tool: null, uses_3d: null, opportunity: null, pain_points: [] };
  await act(async () => { await hook.result.current.mutateAsync(data); });
  await waitFor(() => expect(api.post).toHaveBeenCalledWith("/suppliers", data));
  hook.unmount(); client.clear();
});
