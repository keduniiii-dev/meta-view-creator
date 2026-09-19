import { useMemo } from "react";
import { Building2, Globe2, Layers3, Mail, MapPin, Target, TrendingUp, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLeads } from "@/hooks/use-leads";
import { useBids } from "@/hooks/use-bids";
import { useProjects } from "@/hooks/use-projects";
import { useCampaignStats } from "@/hooks/use-campaigns";
import { useDashboardAnalytics, useFunnel, useKpis, useWeeklyAnalytics } from "@/hooks/use-analytics";
import { formatCurrency } from "@/lib/money";

const colors = ["#218bf5", "#22c7b5", "#f5a20a", "#a543d6", "#28bd5a", "#0798d6"];
const emptyLeads: never[] = [];
const emptyBids: never[] = [];
const emptyProjects: never[] = [];
const tooltip = { backgroundColor: "hsl(220, 50%, 14%)", border: "1px solid hsl(220, 35%, 22%)", borderRadius: 8 };
const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);
const formatMoney = (value: number, currency: string | null | undefined) => formatCurrency(value, currency, { compact: true });
const EmptyChart = () => <p className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">No live data available yet.</p>;
const StatusBadge = ({ value }: { value: "hot" | "warm" | "cool" | null }) => {
  const styles = { hot: "bg-red-500/15 text-red-300", warm: "bg-amber-500/15 text-amber-300", cool: "bg-sky-500/15 text-sky-300" };
  return <Badge className={value ? styles[value] : "bg-muted text-muted-foreground"}>{value ? value[0].toUpperCase() + value.slice(1) : "—"}</Badge>;
};

const Dashboard = () => {
  const leadsQuery = useLeads(1, 100);
  const bidsQuery = useBids(1, 100);
  const projectsQuery = useProjects(1, 100);
  const campaignStatsQuery = useCampaignStats();
  const kpisQuery = useKpis();
  const weeklyQuery = useWeeklyAnalytics(8);
  const funnelQuery = useFunnel();
  const dashboardQuery = useDashboardAnalytics();
  const regionalCoverage = dashboardQuery.data?.regional_coverage ?? [];
  const largestRegionalValue = Math.max(0, ...regionalCoverage.map(region => Number(region.won_deal_value) || 0));

  const leads = leadsQuery.data?.leads ?? emptyLeads;
  const bids = bidsQuery.data?.bids ?? emptyBids;
  const projects = projectsQuery.data?.projects ?? emptyProjects;
  const kpis = kpisQuery.data;
  const weekly = weeklyQuery.data?.weekly ?? [];
  const funnel = funnelQuery.data?.funnel ?? [];

  const liveData = useMemo(() => {
    const group = (values: Array<string | null | undefined>) => Object.entries(values.reduce<Record<string, number>>((acc, value) => {
      const key = value?.trim() || "Unspecified";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {})).map(([name, value], index) => ({ name, value, color: colors[index % colors.length] })).sort((a, b) => b.value - a.value);
    const categoryData = group(leads.map((lead) => lead.industry));
    const regionData = group(leads.map((lead) => lead.region));
    const sectorData = categoryData.slice(0, 4);
const pipelineValue = bids.reduce((sum, bid) => sum + (Number(bid.value) || 0), 0);
    const pipelineCurrencies = [...new Set(bids.map((bid) => bid.currency).filter(Boolean))];
    const pipelineCurrency = pipelineCurrencies.length === 1 ? pipelineCurrencies[0] : null;
    const outreachSent = campaignStatsQuery.data?.total_sent ?? 0;
    const qualified = leads.filter((lead) => lead.status === "qualified" || lead.status === "won");
    const totalLeads = leadsQuery.data?.pagination.total ?? leads.length;
    const qualifiedRate = leads.length ? (qualified.length / leads.length) * 100 : 0;
    return { categoryData, pipelineValue, pipelineCurrency, outreachSent, qualified, qualifiedRate, regionData, sectorData, totalLeads };
  }, [bids, campaignStatsQuery.data?.total_sent, leads, leadsQuery.data?.pagination.total]);

  const applicationData = dashboardQuery.data?.leads_by_application ?? [];
  const cards = [
    [Users, formatNumber(liveData.totalLeads), "Total Leads", kpis ? `${String(kpis.lead_growth).replace(/%$/, "")}%` : "—"],
    [Target, formatMoney(liveData.pipelineValue, liveData.pipelineCurrency), "Pipeline Value", `${bids.length} bids`],
    [Mail, formatNumber(liveData.outreachSent), "Outreach Sent", "From email logs"],
    [TrendingUp, `${(kpis?.qualified_rate ?? liveData.qualifiedRate).toFixed(1)}%`, "Qualified Rate", "Live"],
    [Globe2, formatNumber(liveData.regionData.filter((region) => region.name !== "Unspecified").length), "Active Regions", "Live"],
    [Layers3, formatNumber(projectsQuery.data?.pagination.total ?? projects.length), "Active Projects", "Live"],
  ];
  const hasError = [leadsQuery, bidsQuery, projectsQuery, campaignStatsQuery, kpisQuery, weeklyQuery, funnelQuery, dashboardQuery].some((query) => query.isError);

  return <div className="mx-auto max-w-7xl space-y-6 px-5 py-7 sm:px-8">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-3xl font-bold">Lead Dashboard</h1><p className="mt-1 text-sm text-muted-foreground">Live performance data from your CRM</p></div></div>
    {hasError && <p className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">Some dashboard data could not be loaded. Confirm the API is running and that you are signed in.</p>}
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">{cards.map(([Icon, value, label, detail]) => <Card key={label as string}><CardContent className="p-4"><Icon className="h-4 w-4 text-primary" /><p className="mt-3 text-2xl font-bold">{leadsQuery.isLoading ? "…" : value as string}</p><p className="text-xs text-muted-foreground">{label as string}</p><p className="mt-2 text-[10px] text-success">{detail as string}</p></CardContent></Card>)}</div>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{liveData.sectorData.map((sector, index) => <Card key={sector.name}><CardContent className="p-4"><Building2 className="h-5 w-5" style={{ color: colors[index] }} /><p className="mt-3 text-xl font-bold">{formatNumber(sector.value)}</p><p className="text-xs text-muted-foreground">{sector.name}</p></CardContent></Card>)}</div>
    <div className="grid gap-5 lg:grid-cols-2">
      <Card><CardHeader><CardTitle className="text-base">Lead Distribution by Industry</CardTitle></CardHeader><CardContent>{liveData.categoryData.length ? <><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={liveData.categoryData} dataKey="value" innerRadius={58} outerRadius={92} paddingAngle={3}>{liveData.categoryData.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip contentStyle={tooltip} /></PieChart></ResponsiveContainer><div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">{liveData.categoryData.map((item) => <span key={item.name} className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />{item.name}</span>)}</div></> : <EmptyChart />}</CardContent></Card>
      <Card><CardHeader><CardTitle className="text-base">Leads by Application</CardTitle></CardHeader><CardContent>{dashboardQuery.isLoading ? <p className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">Loading application data...</p> : dashboardQuery.isError ? <p className="flex h-[280px] items-center justify-center text-sm text-destructive">Could not load application data.</p> : applicationData.length ? <ResponsiveContainer width="100%" height={Math.max(280, applicationData.length * 30 + 32)}><BarChart data={applicationData} layout="vertical" margin={{ left: 20 }}><CartesianGrid horizontal={false} stroke="hsl(220, 35%, 22%)" /><XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(215, 20%, 65%)" }} /><YAxis dataKey="application" type="category" tick={{ fontSize: 11, fill: "hsl(215, 20%, 65%)" }} width={90} /><Tooltip contentStyle={tooltip} /><Bar dataKey="lead_count" name="Leads" fill="#218bf5" maxBarSize={24} radius={[0, 5, 5, 0]} /></BarChart></ResponsiveContainer> : <p className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">No application data yet</p>}</CardContent></Card>
      <Card><CardHeader><CardTitle className="text-base">Pipeline Stages</CardTitle></CardHeader><CardContent>{funnel.length ? <ResponsiveContainer width="100%" height={250}><BarChart data={funnel}><CartesianGrid vertical={false} stroke="hsl(220, 35%, 22%)" /><XAxis dataKey="stage" tick={{ fontSize: 10, fill: "hsl(215, 20%, 65%)" }} /><YAxis tick={{ fontSize: 11, fill: "hsl(215, 20%, 65%)" }} /><Tooltip contentStyle={tooltip} /><Bar dataKey="count" radius={[4, 4, 0, 0]}>{funnel.map((item, index) => <Cell key={item.stage} fill={colors[index % colors.length]} />)}</Bar></BarChart></ResponsiveContainer> : <EmptyChart />}</CardContent></Card>
      <Card><CardHeader><CardTitle className="text-base">Lead & Outreach Trend</CardTitle></CardHeader><CardContent>{weekly.length ? <ResponsiveContainer width="100%" height={250}><LineChart data={weekly}><CartesianGrid stroke="hsl(220, 35%, 22%)" /><XAxis dataKey="week" tick={{ fontSize: 11, fill: "hsl(215, 20%, 65%)" }} /><YAxis tick={{ fontSize: 11, fill: "hsl(215, 20%, 65%)" }} /><Tooltip contentStyle={tooltip} /><Line type="monotone" dataKey="leads" name="Leads" stroke="#218bf5" strokeWidth={2} /><Line type="monotone" dataKey="emails" name="Emails sent" stroke="#f5a20a" strokeWidth={2} /></LineChart></ResponsiveContainer> : <EmptyChart />}</CardContent></Card>
    </div>
    <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><MapPin className="h-4 w-4 text-primary" />Regional Coverage</CardTitle></CardHeader><CardContent className="space-y-3">
      {dashboardQuery.isLoading ? <p className="text-sm text-muted-foreground">Loading regional coverage...</p> : dashboardQuery.isError ? <p className="text-sm text-destructive">Could not load regional coverage.</p> : regionalCoverage.length ? regionalCoverage.map((region, index) => {
        const amount = region.won_deal_value == null || region.won_deal_value === "" ? null : Number(region.won_deal_value);
        return <div key={region.region ?? region.name ?? index} className="grid grid-cols-[1fr_auto] items-center gap-4">
          <p className="text-sm font-medium">{region.region || region.name || "Unspecified"}</p>
          <div className="w-32 sm:w-40"><p className="text-right text-sm font-medium tabular-nums text-primary">{amount !== null && Number.isFinite(amount) ? formatMoney(amount, region.currency) : "—"}</p><div aria-hidden="true" className="mt-1 h-1.5 overflow-hidden rounded bg-muted"><div className="h-full rounded bg-primary" style={{ width: `${amount !== null && Number.isFinite(amount) && largestRegionalValue > 0 ? Math.min(100, Math.max(0, amount / largestRegionalValue * 100)) : 0}%` }} /></div></div>
        </div>;
      }) : <p className="text-sm text-muted-foreground">No regional coverage data available yet.</p>}
    </CardContent></Card>
    <Card><CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2"><CardTitle className="text-base">Qualified Leads</CardTitle><span className="text-xs text-muted-foreground">{liveData.qualified.length} leads</span></CardHeader><CardContent className="p-0"><div className="overflow-x-auto"><Table className="mobile-records" aria-label="Qualified leads"><TableHeader><TableRow><TableHead>Company</TableHead><TableHead>Industry</TableHead><TableHead>Region</TableHead><TableHead>Project</TableHead><TableHead>Applications</TableHead><TableHead>Score</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{liveData.qualified.length ? liveData.qualified.map((lead) => { const score = Math.min(100, Math.max(0, Number(lead.score) || 0)); return <TableRow key={lead.id}><TableCell data-label="Company" className="font-medium">{lead.company || lead.full_name}</TableCell><TableCell data-label="Industry">{lead.industry || "—"}</TableCell><TableCell data-label="Region" className="text-muted-foreground">{lead.region || "—"}</TableCell><TableCell data-label="Project" className="text-muted-foreground">{lead.project || "—"}</TableCell><TableCell data-label="Applications" className="text-xs">{lead.application_tools?.length ? lead.application_tools.join(", ") : "-"}</TableCell><TableCell data-label="Score"><div className="flex min-w-24 items-center gap-2"><div className="h-1.5 w-14 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${score}%` }} /></div><span className="text-primary">{score}</span></div></TableCell><TableCell data-label="Status"><StatusBadge value={lead.temperature} /></TableCell></TableRow>; }) : <TableRow><TableCell colSpan={7} className="py-10 text-center text-muted-foreground">No qualified leads in the CRM yet.</TableCell></TableRow>}</TableBody></Table></div></CardContent></Card>
  </div>;
};

export default Dashboard;

