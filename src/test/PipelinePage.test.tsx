import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Pipeline from "@/crm/pages/Pipeline";
import { usePipeline } from "@/hooks/use-demo";

vi.mock("@/hooks/use-demo", () => ({
  usePipeline: vi.fn(),
}));

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
