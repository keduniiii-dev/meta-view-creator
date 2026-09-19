import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import SupplierNetwork from "@/crm/components/SupplierNetwork";
const { supplier } = vi.hoisted(() => ({ supplier: { id: "s1", name: "Test supplier", role: "Engineering consultant", regions: ["UK"], active_project_count: 0, active_projects: [], related_suppliers: [], opportunities: [] } }));
vi.mock("@/hooks/use-projects", () => ({
  useProjects: () => ({ isLoading: false, data: { projects: [] } }),
  useLinkProjectSupplier: () => ({ isPending: false, isError: false, mutate: vi.fn() }),
  useUnlinkProjectSupplier: () => ({ isPending: false, isError: false, mutate: vi.fn() }),
}));
vi.mock("@/hooks/use-suppliers", () => ({
  useSuppliers: () => ({ data: { suppliers: [supplier], pagination: { pages: 1 } } }),
  useSupplierProfile: () => ({ data: { supplier } }),
  useCreateOpportunity: () => ({ isPending: false, isError: false, mutate: vi.fn() }),
  useUpdateOpportunity: () => ({ isPending: false, isError: false, mutate: vi.fn() }),
  useDeleteOpportunity: () => ({ isPending: false, isError: false, mutate: vi.fn() }),
  useLinkOpportunity: () => ({ isPending: false, isError: false, mutate: vi.fn() }),
  useUnlinkOpportunity: () => ({ isPending: false, isError: false, mutate: vi.fn() }),
}));
it("opens the supplier deep dive and displays zero counts and empty sections", () => {
  const view = render(<SupplierNetwork onManage={vi.fn()} />);
  expect(screen.getByText("0 active projects")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "View Test supplier details" }));
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  expect(screen.getByText("Test supplier — Deep Dive")).toBeInTheDocument();
  expect(screen.getByText("No active project details available.")).toBeInTheDocument();
  expect(screen.getByText("No related supplier data available.")).toBeInTheDocument();
  expect(screen.getByText("No opportunity data available.")).toBeInTheDocument();
  view.unmount();
});
