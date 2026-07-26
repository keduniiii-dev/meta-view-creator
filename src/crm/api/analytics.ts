import { apiRequest } from "./client";

export type WeeklyAnalyticsPoint = {
  week: string;
  leads: number;
  emails: number;
  opens: number;
  clicks: number;
};

export type FunnelStage = {
  stage: string;
  count: number;
  pct: number;
};

export type KpiMetric = {
  label: string;
  value: string;
  trend: "up" | "down";
};

export const getWeeklyAnalytics = () => apiRequest<WeeklyAnalyticsPoint[]>('/analytics/weekly');

export const getFunnelAnalytics = () => apiRequest<FunnelStage[]>('/analytics/funnel');

export const getKpis = () => apiRequest<KpiMetric[]>('/analytics/kpis');
