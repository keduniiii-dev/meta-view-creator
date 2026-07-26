import type { IncomingMessage, ServerResponse } from "http";
import type { WeeklyData, FunnelStep, Kpis } from "../../lib/types";
import { getAllLeads } from "./leads";

const weeklyData: WeeklyData[] = [];

function getWeeklyAnalytics(weeks = 8): WeeklyData[] {
  return weeklyData.slice(-weeks);
}

const funnelStages = ["Identified", "Qualified", "Contacted", "Responded", "Meeting", "Proposal", "Closed Won"] as const;
const statusToStage: Record<string, string> = { new: "Identified", qualified: "Qualified", contacted: "Contacted", won: "Closed Won" };

function getFunnel(): FunnelStep[] {
  const allLeads = getAllLeads();
  const total = allLeads.length || 1;
  const counts: Record<string, number> = {};
  for (const stage of funnelStages) counts[stage] = 0;
  for (const lead of allLeads) {
    const stage = statusToStage[lead.status];
    if (stage && counts[stage] !== undefined) counts[stage]++;
  }
  return funnelStages.map((stage) => ({ stage, count: counts[stage], pct: Math.round((counts[stage] / total) * 100) }));
}

function getKpis(): Kpis {
  const allLeads = getAllLeads();
  const total = allLeads.length || 1;
  const qualified = allLeads.filter((l) => l.status === "qualified" || l.status === "won").length;
  return {
    lead_growth: `+${Math.round((total / Math.max(total, 5)) * 12)}%`,
    qualified_rate: Math.round((qualified / total) * 100),
    email_open_rate: 68.4,
    click_through: 29.2,
  };
}

export function handleAnalytics(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");
  if (req.url?.startsWith("/weekly")) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const weeks = Number(url.searchParams.get("weeks")) || 8;
    res.end(JSON.stringify({ success: true, data: { weekly: getWeeklyAnalytics(weeks) } }));
  } else if (req.url?.startsWith("/funnel")) {
    res.end(JSON.stringify({ success: true, data: { funnel: getFunnel() } }));
  } else if (req.url?.startsWith("/kpis")) {
    res.end(JSON.stringify({ success: true, data: getKpis() }));
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ success: false, message: "Not found" }));
  }
}
