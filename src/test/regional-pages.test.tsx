import { render, screen, cleanup } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import Emea from "@/crm/pages/Emea";
import Americas from "@/crm/pages/Americas";
import { formatRegionalMoney } from "@/lib/regional-money";

vi.mock("@/hooks/use-regions", () => ({
  useRegionalDashboard: () => ({
    isPending: false, isError: false, refetch: vi.fn(),
    data: {
      summary: [{ name: "Test region", lead_count: 3, pipeline_value: null, currency: null }],
      workflow: [],
      regions: [{ name: "Test region", bids_count: 2, inflight_count: 1, pipeline_value: null, currency: null, countries: null, recommended_tools: null, strategy: "Early design" }],
    },
  }),
}));
afterEach(cleanup);
it.each([["EMEA", Emea], ["Americas", Americas]] as const)("renders %s with unavailable backend fields", (name, Page) => {
  render(<Page />);
  expect(screen.getByRole("heading", { name })).toBeInTheDocument();
  expect(screen.getAllByText(/Unavailable/).length).toBeGreaterThan(0);
  expect(screen.queryByText(/Recommended Tools/)).not.toBeInTheDocument();
  expect(screen.getByText("Early design")).toBeInTheDocument();
});
it("keeps mixed currencies separate and marks incomplete totals", () => {
  const result = formatRegionalMoney({ pipeline_value: null, currency: null, pipeline_totals: [{ currency: "GBP", pipeline_value: 1200000, bid_count: 1 }, { currency: "USD", pipeline_value: 2000000, bid_count: 1 }], unknown_currency_bid_count: 1 });
  expect(result).toContain("£1.2M");
  expect(result).toContain("US$2M");
  expect(result).toContain("Additional bids unavailable");
});
it("distinguishes zero activity from missing amounts", () => {
  expect(formatRegionalMoney({ pipeline_value: 0, currency: null })).toBe("0");
  expect(formatRegionalMoney({ pipeline_value: null, currency: null })).toBe("Unavailable");
});
it("formats backfilled amounts with the supplied symbol and compact notation", () => {
  expect(formatRegionalMoney({ pipeline_value: 290000000, currency: "GBP", currency_symbol: "£" })).toBe("£290M");
  expect(formatRegionalMoney({ pipeline_value: 420000000, currency: "USD", currency_symbol: "$" })).toBe("$420M");
});
it("uses the reporting symbol only for the matching amount currency", () => {
  expect(formatRegionalMoney({ pipeline_value: 890000000, currency: "EUR", reporting_currency: "EUR", reporting_currency_symbol: "€" })).toBe("€890M");
  expect(formatRegionalMoney({ pipeline_value: 10.5, currency: "USD", reporting_currency: "GBP", reporting_currency_symbol: "£" })).toBe("US$10.5");
});
it("uses each currency total's symbol", () => {
  expect(formatRegionalMoney({ pipeline_value: null, pipeline_totals: [{ currency: "USD", currency_symbol: "$", pipeline_value: 1000, bid_count: 1 }, { currency: "GBP", currency_symbol: "£", pipeline_value: 2000, bid_count: 1 }] })).toBe("$1K · £2K");
});
