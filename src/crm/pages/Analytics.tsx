import { motion } from "framer-motion";
import { TrendingUp, Users, MousePointerClick, Eye, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from "recharts";

const weeklyData = [
  { week: "W1", leads: 42, emails: 120, opens: 78, clicks: 24 },
  { week: "W2", leads: 56, emails: 150, opens: 98, clicks: 31 },
  { week: "W3", leads: 68, emails: 180, opens: 124, clicks: 42 },
  { week: "W4", leads: 81, emails: 210, opens: 148, clicks: 55 },
  { week: "W5", leads: 94, emails: 245, opens: 167, clicks: 63 },
  { week: "W6", leads: 112, emails: 280, opens: 198, clicks: 78 },
  { week: "W7", leads: 128, emails: 320, opens: 228, clicks: 89 },
  { week: "W8", leads: 147, emails: 350, opens: 252, clicks: 102 },
];

const conversionFunnel = [
  { stage: "Identified", count: 2400, pct: 100 },
  { stage: "Qualified", count: 1880, pct: 78 },
  { stage: "Contacted", count: 1345, pct: 56 },
  { stage: "Responded", count: 642, pct: 27 },
  { stage: "Meeting", count: 284, pct: 12 },
  { stage: "Proposal", count: 148, pct: 6 },
  { stage: "Closed Won", count: 67, pct: 3 },
];

const kpis = [
  { label: "Lead Growth", value: "+147%", icon: TrendingUp, trend: "up" },
  { label: "Qualified Rate", value: "78.3%", icon: Users, trend: "up" },
  { label: "Email Open Rate", value: "67.6%", icon: Eye, trend: "up" },
  { label: "Click-Through", value: "20.6%", icon: MousePointerClick, trend: "down" },
];

const tooltipStyle = { backgroundColor: "hsl(220,18%,10%)", border: "1px solid hsl(220,16%,18%)", borderRadius: 8, color: "#fff" };

const Analytics = () => (
  <div className="p-6 lg:p-8 space-y-8">
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
      <p className="text-muted-foreground">Performance metrics, engagement funnels, and campaign ROI</p>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <kpi.icon className="w-5 h-5 text-primary" />
                {kpi.trend === "up" ? <ArrowUpRight className="w-4 h-4 text-green-500" /> : <ArrowDownRight className="w-4 h-4 text-destructive" />}
              </div>
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lead Acquisition Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(210,100%,56%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(210,100%,56%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,16%,18%)" />
              <XAxis dataKey="week" tick={{ fill: "hsl(215,12%,55%)", fontSize: 12 }} />
              <YAxis tick={{ fill: "hsl(215,12%,55%)", fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="leads" stroke="hsl(210,100%,56%)" fill="url(#leadGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Email Engagement</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,16%,18%)" />
              <XAxis dataKey="week" tick={{ fill: "hsl(215,12%,55%)", fontSize: 12 }} />
              <YAxis tick={{ fill: "hsl(215,12%,55%)", fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="opens" stroke="hsl(170,80%,45%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="clicks" stroke="hsl(38,92%,50%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-6 justify-center mt-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(170,80%,45%)" }} /> Opens</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(38,92%,50%)" }} /> Clicks</div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Conversion Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {conversionFunnel.map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground w-24 text-right">{step.stage}</span>
              <div className="flex-1 h-8 bg-secondary rounded-md overflow-hidden relative">
                <div className="h-full rounded-md bg-primary transition-all duration-700" style={{ width: `${step.pct}%` }} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-foreground">{step.count.toLocaleString()} ({step.pct}%)</span>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default Analytics;
