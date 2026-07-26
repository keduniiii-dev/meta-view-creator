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
      api.get<WeeklyResponse>("/api/analytics/weekly", { weeks }),
  });
}

export function useFunnel() {
  return useQuery({
    queryKey: ["analytics", "funnel"],
    queryFn: () => api.get<FunnelResponse>("/api/analytics/funnel"),
  });
}

export function useKpis() {
  return useQuery({
    queryKey: ["analytics", "kpis"],
    queryFn: () => api.get<Kpis>("/api/analytics/kpis"),
  });
}
