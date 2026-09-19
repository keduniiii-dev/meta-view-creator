import { useState } from "react";
import { Area, AreaChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Eye, MousePointer2, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useFunnel, useKpis, useWeeklyAnalytics } from "@/hooks/use-analytics";
import { QueryStatus, EmptyState } from "@/crm/components/QueryStatus";
import { MetricCard, SelectField } from "@/crm/components/CrmPageUi";

const chartConfig = { leads: { label: "Leads", color: "hsl(var(--primary))" }, opens: { label: "Opens", color: "#22c7b5" }, clicks: { label: "Clicks", color: "#f5a20a" } };
const percent = (value: string | number) => `${String(value).replace(/%$/, "")}%`;

export default function Analytics() {
  const [weeks, setWeeks] = useState("8");
  const kpis = useKpis();
  const weekly = useWeeklyAnalytics(Number(weeks));
  const funnel = useFunnel();
  const trend = weekly.data?.weekly ?? [];
  return <div className="mx-auto max-w-7xl space-y-8 px-5 py-7 sm:px-8">
    <header className="flex flex-wrap items-end justify-between gap-5"><div><p className="mb-2 text-xs font-medium uppercase tracking-widest text-primary">Performance</p><h1 className="text-3xl font-semibold tracking-tight">Analytics</h1><p className="mt-2 text-sm text-muted-foreground">Understand lead growth, engagement, and pipeline conversion.</p></div><div className="w-44"><SelectField label="Trend period" value={weeks} onChange={setWeeks} options={[4, 8, 12, 26, 52].map(value => ({ value: String(value), label: `Last ${value} weeks` }))} /></div></header>
    <QueryStatus query={kpis} />
    {kpis.data && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><MetricCard icon={TrendingUp} label="Lead growth" value={percent(kpis.data.lead_growth)} /><MetricCard icon={Users} label="Qualified rate" value={percent(kpis.data.qualified_rate)} /><MetricCard icon={Eye} label="Email open rate" value={percent(kpis.data.email_open_rate)} /><MetricCard icon={MousePointer2} label="Click through" value={percent(kpis.data.click_through)} /></div>}
    <div className="grid gap-5 lg:grid-cols-2">
      <Card className="min-w-0"><CardHeader><CardTitle className="text-base">Lead acquisition</CardTitle><CardDescription>New leads over the last {weeks} weeks</CardDescription></CardHeader><CardContent><QueryStatus query={weekly} />{weekly.isSuccess && (trend.length ? <ChartContainer config={chartConfig} className="h-72 w-full"><AreaChart accessibilityLayer data={trend} margin={{ left: -20, right: 12 }}><defs><linearGradient id="analytics-leads" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-leads)" stopOpacity={0.35} /><stop offset="100%" stopColor="var(--color-leads)" stopOpacity={0.02} /></linearGradient></defs><CartesianGrid vertical={false} /><XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={10} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} /><ChartTooltip content={<ChartTooltipContent />} /><Area type="monotone" dataKey="leads" stroke="var(--color-leads)" strokeWidth={2} fill="url(#analytics-leads)" /></AreaChart></ChartContainer> : <EmptyState title="No lead activity" description="New leads will appear in this trend as your pipeline grows." />)}</CardContent></Card>
      <Card className="min-w-0"><CardHeader><CardTitle className="text-base">Email engagement</CardTitle><CardDescription>Opens and clicks grouped by email send week</CardDescription></CardHeader><CardContent><QueryStatus query={weekly} />{weekly.isSuccess && (trend.length ? <ChartContainer config={chartConfig} className="h-72 w-full"><LineChart accessibilityLayer data={trend} margin={{ left: -20, right: 12 }}><CartesianGrid vertical={false} /><XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={10} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} /><ChartTooltip content={<ChartTooltipContent />} /><ChartLegend content={<ChartLegendContent />} /><Line type="monotone" dataKey="opens" stroke="var(--color-opens)" strokeWidth={2} dot={false} /><Line type="monotone" dataKey="clicks" stroke="var(--color-clicks)" strokeWidth={2} dot={false} /></LineChart></ChartContainer> : <EmptyState title="No email activity" description="Send your first outreach email to start tracking engagement." />)}</CardContent></Card>
    </div>
    <Card><CardHeader><CardTitle className="text-base">Conversion funnel</CardTitle><CardDescription>How leads are distributed across pipeline stages</CardDescription></CardHeader><CardContent className="space-y-6"><QueryStatus query={funnel} />{funnel.isSuccess && !funnel.data.funnel.length && <EmptyState title="No pipeline activity" description="Your lead stages will appear here once data is available." />}{funnel.data?.funnel.map((item, index) => <div key={item.stage} className="grid items-center gap-3 sm:grid-cols-[160px_1fr_100px]"><div className="flex items-center gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">{index + 1}</span><span className="text-sm font-medium">{item.stage}</span></div><Progress aria-label={`${item.stage}: ${item.pct}%`} value={Math.min(100, Math.max(0, item.pct))} className="h-2.5" /><div className="flex items-center justify-end gap-3 text-sm tabular-nums"><span>{item.count.toLocaleString()}</span><Badge variant="secondary">{item.pct}%</Badge></div></div>)}</CardContent></Card>
  </div>;
}
