import { expect, it } from "vitest";
import { formatSupplierMoney } from "@/lib/supplier-money";
import { formatProjectSize } from "@/lib/money";
it.each([[null, "USD"], [250, null], [0, null], [250, ""], [250, "invalid"]])("does not infer an amount or currency: %s %s", (value, currency) => {
  expect(formatSupplierMoney(value as number | null, currency as string | null)).toBe("Not confirmed");
});
it("preserves zero with a confirmed currency", () => {
  expect(formatSupplierMoney(0, "USD")).toBe("$0");
});
it("uses the supplied currency", () => {
  expect(formatSupplierMoney(250000000, "GBP")).toBe("£250M");
});
describe("formatProjectSize", () => {
  it("formats numeric value with its currency", () => {
    expect(formatProjectSize(800000000, "GBP", "$800M–$900M")).toBe("£800M");
  });
  it("falls back to the raw string when currency is missing", () => {
    expect(formatProjectSize(800000000, null, "$800M–$900M")).toBe("$800M–$900M");
  });
  it("falls back to the default when nothing is known", () => {
    expect(formatProjectSize(null, null, null)).toBe("—");
  });
});
