import { formatCurrency } from "@/lib/money";

export function formatSupplierMoney(value: number | null, currency: string | null): string {
  return formatCurrency(value, currency, { compact: true, fallback: "Not confirmed" });
}