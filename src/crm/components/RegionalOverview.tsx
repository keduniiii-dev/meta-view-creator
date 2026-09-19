import { formatRegionalMoney } from "@/lib/regional-money";
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { EmptyState, QueryStatus } from "@/crm/components/QueryStatus";
import { useRegionalDashboard } from "@/hooks/use-regions";

export interface RegionalWorkflowSlot {
  time: string;
  region: string;
  focus: string;
}

const colors = ["#258bfa", "#00a3e0", "#14c5b0", "#f2a900", "#a535da"];
const chartConfig = { lead_count: { label: "Leads", color: colors[0] } };
const detailClass = "rounded-lg border border-border bg-background/15 px-3 py-2.5";

export default function RegionalOverview({ region, title, description, workflow, focus, tools, strategy }: {
  region: "emea" | "americas";
  title: string;
  description: string;
  workflow: RegionalWorkflowSlot[];
  focus: Record<string, string>;
  tools?: Record<string, string[]>;
  strategy?: Record<string, string>;
}) {
  const query = useRegionalDashboard(region);
  const data = query.data;
  const order = Object.keys(focus);
  const position = (name: string) => order.includes(name) ? order.indexOf(name) : order.length;
  return <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
    <header><h1 className="text-2xl font-semibold tracking-tight">{title}</h1><p className="mt-1 text-sm text-muted-foreground">{description}</p></header>
    <QueryStatus query={query} />
    {data && <>
      {!!data.summary.length && <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {[...data.summary].sort((a, b) => position(a.name) - position(b.name)).map(item => <Card key={item.name} className="min-w-0 rounded-lg shadow-none">
          <CardContent className="flex h-full flex-col items-center justify-center gap-1 px-3 py-4 text-center">
            <p className="text-xl font-semibold tabular-nums text-primary">{item.lead_count.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{item.name}</p>
            <p className="text-xs font-semibold tabular-nums text-primary" title={`Pipeline value: ${formatRegionalMoney(item)}`}>{formatRegionalMoney(item)}</p>
          </CardContent>
        </Card>)}
      </div>}
      <Card className="rounded-lg shadow-none">
        <CardHeader className="space-y-1 px-4 pb-3 pt-5 sm:px-5">
          <CardTitle className="text-sm">Operational Time-Zone Workflow</CardTitle>
          <p className="text-xs text-muted-foreground">Suggested outreach schedule · confirm your team’s working time zone.</p>
        </CardHeader>
        <CardContent className="grid gap-3 px-4 pb-5 sm:grid-cols-3 sm:px-5">
          {workflow.map(slot => <div key={slot.time} className="rounded-lg border border-border bg-background/15 p-3">
            <p className="text-xs font-medium text-primary">{slot.time}</p><p className="mt-1.5 text-sm font-semibold">{slot.region}</p><p className="mt-1 text-xs text-muted-foreground">{slot.focus}</p>
          </div>)}
        </CardContent>
      </Card>
      {!data.regions.length && <EmptyState title="No regional data yet" description="Regional coverage and opportunities will appear as leads are added." />}
      {[...data.regions].sort((a, b) => position(a.name) - position(b.name)).map(item => {
        const regionalTotalOnly = (item.countries ?? []).length === 1 && item.countries?.[0]?.name === item.name;
        const recommended = item.recommended_tools ?? tools?.[item.name] ?? [];
        return <Card key={item.name} className="min-w-0 rounded-lg shadow-none">
          <CardHeader className="px-4 pb-4 pt-5 sm:px-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><CardTitle className="text-base">{item.name}</CardTitle><p className="mt-1 text-xs text-muted-foreground">{focus[item.name] || "Regional lead coverage"}</p></div>
              <div className="flex gap-2">
                <Badge className="border-0 bg-primary/15 text-primary hover:bg-primary/15">{item.bids_count.toLocaleString()} bids</Badge>
                <Badge className="border-0 bg-teal-500/15 text-teal-500 hover:bg-teal-500/15">{item.inflight_count.toLocaleString()} in-flight</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-5 px-4 pb-5 sm:px-5 md:grid-cols-2">
            <div className="min-w-0">
              <p className="mb-2 text-xs text-muted-foreground">{regionalTotalOnly ? "Regional lead total" : "Leads by Country"}</p>
              {(item.countries ?? []).length ? <ChartContainer config={chartConfig} className="h-44 w-full">
                <BarChart accessibilityLayer data={item.countries ?? []} margin={{ left: -12, right: 8, bottom: 8 }}>
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} interval="preserveStartEnd" tickFormatter={name => name === "Northern Ireland" ? "N. Ireland" : name.length > 18 ? `${name.slice(0, 16)}…` : name} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={40} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="lead_count" radius={[2, 2, 0, 0]} maxBarSize={70}>{(item.countries ?? []).map((country, index) => <Cell key={country.name} fill={colors[index % colors.length]} />)}</Bar>
                </BarChart>
              </ChartContainer> : <EmptyState title="No country breakdown" description="Country counts have not been provided yet." />}
            </div>
            <div className="flex flex-col gap-2.5">
              {recommended.length ? <div className={detailClass}><p className="text-xs text-muted-foreground">Recommended Tools</p><p className="mt-1 text-sm font-medium">{recommended.join(" + ")}</p></div> : null}
              <div className={detailClass}><p className="text-xs text-muted-foreground">Strategy</p><p className="mt-1 text-sm font-medium">{item.strategy || strategy?.[item.name] || "No strategy provided yet"}</p></div>
              <div className={detailClass}><p className="text-xs text-muted-foreground">Pipeline Value</p><p className="mt-1 text-base font-semibold tabular-nums text-primary" title={formatRegionalMoney(item)}>{formatRegionalMoney(item)}</p></div>
            </div>
          </CardContent>
        </Card>;
      })}
      {!!data.summary.length && <p className="text-xs text-muted-foreground">Pipeline totals are grouped by currency. Unavailable amounts are excluded.</p>}
    </>}
  </div>;
}