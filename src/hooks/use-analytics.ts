import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { WeeklyData, FunnelStep, Kpis } from "@/lib/types";

interface WeeklyResponse {
  weekly: WeeklyData[];
}

interface FunnelResponse {
  funnel: FunnelStep[];
}

export function useWeeklyAnalytics(weeks = 8) {
  return useQuery({
    queryKey: ["analytics", "weekly", weeks],
    queryFn: () =>
      api.get<WeeklyResponse>("/analytics/weekly", { weeks }),
  });
}

export function useFunnel() {
  return useQuery({
    queryKey: ["analytics", "funnel"],
    queryFn: () => api.get<FunnelResponse>("/analytics/funnel"),
  });
}

export function useKpis() {
  return useQuery({
    queryKey: ["analytics", "kpis"],
    queryFn: () => api.get<Kpis>("/analytics/kpis"),
  });
}

export interface RegionalCoverage {
  region?: string;
  name?: string;
  won_deal_value: number | string | null;
  currency?: string | null;
}

export function useDashboardAnalytics() {
  return useQuery({
    queryKey: ["analytics", "dashboard"],
    queryFn: () => api.get<{ regional_coverage: RegionalCoverage[]; leads_by_application: { application: string; lead_count: number }[] }>("/analytics/dashboard"),
  });
}