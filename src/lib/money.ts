export interface FormatCurrencyOptions {
  compact?: boolean;
  fallback?: string;
}

export function formatCurrency(value: number | null | undefined, currency: string | null | undefined, options: FormatCurrencyOptions = {}): string {
  const { compact = false, fallback = "—" } = options;
  if (value == null || !Number.isFinite(value) || !currency?.trim()) return fallback;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.trim(),
      notation: compact ? "compact" : "standard",
      minimumFractionDigits: 0,
      maximumFractionDigits: compact ? 1 : 2,
    }).format(value);
  } catch {
    return fallback;
  }
}

export function formatProjectSize(value: number | null | undefined, currency: string | null | undefined, raw: string | null | undefined, fallback = "—"): string {
  if (value != null && Number.isFinite(value) && currency?.trim()) return formatCurrency(value, currency, { compact: true });
  return raw?.trim() || fallback;
}