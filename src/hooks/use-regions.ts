import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { RegionalMoney } from "@/lib/regional-money";

type RegionsResponse = { regions: string[] };

export interface RegionalDashboardData {
  summary: (RegionalMoney & { name: string; lead_count: number })[];
  workflow: unknown[];
  regions: (RegionalMoney & { name: string; bids_count: number; inflight_count: number; countries: { name: string; lead_count: number }[] | null; recommended_tools: string[] | null; strategy: string; country_counts_complete?: boolean; country_unassigned_lead_count?: number })[];
}

export function useRegionalDashboard(region: "emea" | "americas") {
  return useQuery({ queryKey: ["regions", region], queryFn: () => api.get<RegionalDashboardData>(`/regions/${region}`) });
}

export function useRegions() {
  return useQuery({
    queryKey: ["regions"],
    queryFn: () => api.get<RegionsResponse>("/regions"),
  });
}
