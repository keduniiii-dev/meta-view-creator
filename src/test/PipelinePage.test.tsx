vi.mock("@/crm/components/SupplierNetwork", () => ({ default: () => null }));
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Pipeline from "@/crm/pages/Pipeline";
import { usePipeline } from "@/hooks/use-demo";

vi.mock("@/hooks/use-demo", () => ({
  usePipeline: vi.fn(),
}));

vi.mock("@/hooks/use-bids", () => ({ useDeleteBid: () => ({ mutate: vi.fn(), isPending: false }), useBids: () => ({ data: undefined, isError: false }) }));
vi.mock("@/hooks/use-projects", () => ({ useDeleteProject: () => ({ mutate: vi.fn(), isPending: false }), useProjects: () => ({ data: undefined, isError: false }) }));

describe("Pipeline page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows an error state when the pipeline request fails", () => {
    vi.mocked(usePipeline).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { message: "Request failed" },
    } as never);

    render(<Pipeline />);

    expect(screen.getByText(/unable to load pipeline data/i)).toBeInTheDocument();
  });
});

describe("Pipeline lead amounts", () => {
  it.each([
    ["missing bid", [] as object[], "Not confirmed", "Not assigned"],
    ["null amount", [{ lead_id: "vibely", value: null, suppliers: [] }], "Not confirmed", "Not assigned"],
    ["zero amount", [{ lead_id: "vibely", value: 0, currency: "USD", suppliers: ["Supplier A"] }], "$0", "Supplier A"],
    ["unrelated bid", [{ lead_id: "other", value: 900, suppliers: ["Other supplier"] }], "Not confirmed", "Not assigned"],
  ])("shows project size separately with %s", (_name, bids, amount, suppliers) => {
    vi.mocked(usePipeline).mockReturnValue({
      data: {
        stages: [{ name: "Closed Won", count: 1, value: null, leads: [{ id: "vibely", company: "Vibely", full_name: "Oluwatobi Odus", project_size: "$800M–$900M" }], bids }],
        active_bids: [], inflight_projects: [],
      },
      isLoading: false, isError: false,
    } as never);
    const view = render(<Pipeline />);
    expect(screen.getByText("Project size: $800M–$900M")).toBeInTheDocument();
    expect(screen.getByText("Bid amount: " + amount)).toBeInTheDocument();
    expect(screen.getByText("Suppliers: " + suppliers)).toBeInTheDocument();
    view.unmount();
  });
});