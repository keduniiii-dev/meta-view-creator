import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  HardHat,
  Landmark,
  TrendingUp,
  FileText,
  FileSpreadsheet,
  Loader2,
  Factory,
  Hammer,
  TreePine,
  Warehouse,
  Shovel,
  Pickaxe,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useLeads } from "@/hooks/use-leads";
import type { Lead } from "@/lib/types";

const colorPalette = [
  "hsl(210,100%,56%)",
  "hsl(170,80%,45%)",
  "hsl(38,92%,50%)",
  "hsl(280,70%,55%)",
  "hsl(340,82%,52%)",
  "hsl(160,60%,40%)",
  "hsl(25,95%,53%)",
  "hsl(190,70%,45%)",
  "hsl(320,65%,50%)",
  "hsl(85,60%,42%)",
  "hsl(240,60%,60%)",
  "hsl(15,85%,55%)",
];

const iconPalette = [
  HardHat,
  Building2,
  Landmark,
  TrendingUp,
  Factory,
  Hammer,
  TreePine,
  Warehouse,
  Shovel,
  Pickaxe,
  Wrench,
];

const statusVariant: Record<string, "destructive" | "default" | "secondary"> = {
  won: "default",
  qualified: "default",
  contacted: "secondary",
  new: "outline",
  lost: "destructive",
};

const Dashboard = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useLeads(page, 20);

  const leads = useMemo(
    () => data?.leads ?? [],
    [data?.leads],
  );
  const pagination = data?.pagination;

  const [filter, setFilter] = useState("All");

  const industryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
      leads.forEach((l) => {
        const ind = l.category;
        if (!ind) return;
        counts[ind] = (counts[ind] || 0) + 1;
    });
    return counts;
  }, [leads]);

  const buckets = useMemo(() => {
    const entries = Object.entries(industryCounts);
    const sorted = entries.sort((a, b) => b[1] - a[1]);
    return sorted.map(([name, count], idx) => ({
      name,
      count,
      icon: iconPalette[idx % iconPalette.length],
      color: colorPalette[idx % colorPalette.length],
    }));
  }, [industryCounts]);

  const pieData = buckets.map((b) => ({ name: b.name, value: b.count }));
  const pieColors = buckets.map((b) => b.color);

  const companyCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach((l) => {
      const co = l.company || "Unknown";
      counts[co] = (counts[co] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, leads: count }));
  }, [leads]);

  const filtered = useMemo(
    () =>
      filter === "All"
        ? leads
        : leads.filter((l) => l.category === filter),
    [leads, filter],
  );

  const handleExportCsv = () => {
    const header = "Name,Email,Company,Job Title,Industry,Status\n";
    const rows = filtered
      .map(
        (l) =>
          `"${l.full_name}","${l.email}","${l.company}","${l.job_title}","${l.category}","${l.status}"`,
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lead Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Categorised prospects across sectors
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCsv}>
            <FileSpreadsheet className="w-4 h-4 mr-1" /> CSV
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-1" /> PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card
            className={`cursor-pointer transition-all ${
              filter === "All"
                ? "border-primary shadow-md"
                : "hover:border-primary/30"
            }`}
            onClick={() => setFilter("All")}
          >
            <CardContent className="p-5">
              <TrendingUp className="w-6 h-6 mb-3 text-primary" />
              <p className="text-2xl font-bold text-foreground">
                {leads.length}
              </p>
              <p className="text-sm text-muted-foreground">All Leads</p>
            </CardContent>
          </Card>
        </motion.div>
        {buckets.map((b, i) => (
          <motion.div
            key={b.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card
              className={`cursor-pointer transition-all ${
                filter === b.name
                  ? "border-primary shadow-md"
                  : "hover:border-primary/30"
              }`}
              onClick={() =>
                setFilter(b.name === filter ? "All" : b.name)
              }
            >
              <CardContent className="p-5">
                <b.icon
                  className="w-6 h-6 mb-3"
                  style={{ color: b.color }}
                />
                <p className="text-2xl font-bold text-foreground">
                  {b.count}
                </p>
                <p className="text-sm text-muted-foreground">{b.name}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lead Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={pieColors[i]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid hsl(220,16%,30%)",
                        borderRadius: 8,
                        color: "#111",
                      }}
                      labelStyle={{ color: "#111" }}
                      itemStyle={{ color: "#111" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-4 justify-center mt-2">
                  {buckets.map((b) => (
                    <div
                      key={b.name}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: b.color }}
                      />
                      {b.name}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-10">
                No leads yet
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Leads by Company</CardTitle>
          </CardHeader>
          <CardContent>
            {companyCounts.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={companyCounts} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(220,16%,18%)"
                  />
                  <XAxis
                    type="number"
                    tick={{ fill: "hsl(215,12%,55%)", fontSize: 12 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: "hsl(215,12%,55%)", fontSize: 12 }}
                    width={120}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(220,18%,10%)",
                      border: "1px solid hsl(220,16%,18%)",
                      borderRadius: 8,
                      color: "#fff",
                    }}
                  />
                  <Bar
                    dataKey="leads"
                    fill="hsl(210,100%,56%)"
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-10">
                No leads yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Qualified Leads</CardTitle>
          <span className="text-sm text-muted-foreground">
            {pagination?.total ?? filtered.length} leads
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((lead: Lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">
                    {lead.full_name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {lead.company}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {lead.category}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {lead.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[lead.status] || "secondary"}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-8"
                  >
                    No leads found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= pagination.pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
