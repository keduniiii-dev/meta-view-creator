export interface RegionalMoney {
  pipeline_value: number | null;
  currency?: string | null;
  currency_symbol?: string | null;
  reporting_currency?: string | null;
  reporting_currency_symbol?: string | null;
  pipeline_totals?: { currency: string; currency_symbol?: string | null; pipeline_value: number; bid_count: number }[];
  unknown_currency_bid_count?: number;
  unknown_value_bid_count?: number;
}

export function formatRegionalMoney(item: RegionalMoney): string {
  const format = (value: number, currency?: string | null, symbol?: string | null) => {
    if (!currency) return `${value.toLocaleString("en-GB", { notation: "compact", maximumFractionDigits: 1 })} (currency unspecified)`;
    try {
      const formatter = new Intl.NumberFormat("en-GB", { style: "currency", currency, notation: "compact", minimumFractionDigits: 0, maximumFractionDigits: 1 });
      const displaySymbol = symbol || (currency === item.reporting_currency ? item.reporting_currency_symbol : null);
      return formatter.formatToParts(value).map(part => part.type === "currency" && displaySymbol ? displaySymbol : part.value).join("");
    } catch { return `${value.toLocaleString("en-GB", { notation: "compact", maximumFractionDigits: 1 })} (currency unspecified)`; }
  };
  const totals = item.pipeline_totals?.filter(total => Number.isFinite(total.pipeline_value)) ?? [];
  const incomplete = (item.unknown_currency_bid_count ?? 0) > 0 || (item.unknown_value_bid_count ?? 0) > 0;
  if (totals.length) return totals.map(total => format(total.pipeline_value, total.currency, total.currency_symbol || (total.currency === item.currency ? item.currency_symbol : null))).join(" · ") + (incomplete ? " · Additional bids unavailable" : "");
  if (item.pipeline_value == null || !Number.isFinite(item.pipeline_value)) return "Unavailable";
  if (item.pipeline_value === 0 && !item.currency) return "0";
  return format(item.pipeline_value, item.currency, item.currency_symbol);
}
