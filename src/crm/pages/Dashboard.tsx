import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, HardHat, Landmark, TrendingUp, FileText, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const buckets = [
  { name: "Construction", count: 847, icon: HardHat, color: "hsl(210,100%,56%)" },
  { name: "Architecture", count: 523, icon: Building2, color: "hsl(170,80%,45%)" },
  { name: "Urban Dev", count: 312, icon: Landmark, color: "hsl(38,92%,50%)" },
  { name: "Infrastructure", count: 198, icon: TrendingUp, color: "hsl(280,70%,55%)" },
];
const pieData = buckets.map(b => ({ name: b.name, value: b.count }));
const pieColors = buckets.map(b => b.color);
const appData = [
  { name: "Revit", leads: 420 }, { name: "AutoCAD", leads: 380 }, { name: "SketchUp", leads: 290 },
  { name: "Rhino", leads: 180 }, { name: "3ds Max", leads: 150 }, { name: "Blender", leads: 120 },
  { name: "ArchiCAD", leads: 95 }, { name: "Navisworks", leads: 70 },
];
const leads = [
  { id: 1, company: "Turner Construction", category: "Construction", app: "Revit, Navisworks", score: 94, status: "Hot" },
  { id: 2, company: "Gensler Architects", category: "Architecture", app: "Revit, Rhino", score: 91, status: "Hot" },
  { id: 3, company: "AECOM", category: "Infrastructure", app: "AutoCAD, 3ds Max", score: 87, status: "Warm" },
  { id: 4, company: "Skidmore Owings", category: "Architecture", app: "Rhino, SketchUp", score: 85, status: "Warm" },
  { id: 5, company: "Bechtel Corp", category: "Construction", app: "Revit, AutoCAD", score: 82, status: "Warm" },
  { id: 6, company: "WSP Global", category: "Urban Dev", app: "AutoCAD, ArchiCAD", score: 79, status: "Cool" },
  { id: 7, company: "Jacobs Engineering", category: "Infrastructure", app: "Navisworks, Revit", score: 76, status: "Cool" },
  { id: 8, company: "HDR Inc.", category: "Architecture", app: "Revit, 3ds Max", score: 73, status: "Cool" },
];
const statusVariant: Record<string, "destructive" | "default" | "secondary"> = {
  Hot: "destructive",
  Warm: "default",
  Cool: "secondary",
};

const Dashboard = () => {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? leads : leads.filter(l => l.category === filter);
  const handleExportCsv = () => {
    const header = "Company,Category,Applications,Score,Status\n";
    const rows = filtered.map(l => `${l.company},${l.category},"${l.app}",${l.score},${l.status}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "leads-report.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lead Dashboard</h1>
          <p className="text-muted-foreground mt-1">Categorised prospects across sectors</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCsv}><FileSpreadsheet className="w-4 h-4 mr-1" /> CSV</Button>
          <Button variant="outline" size="sm"><FileText className="w-4 h-4 mr-1" /> PDF</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {buckets.map((b, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card
              className={`cursor-pointer transition-all ${filter === b.name ? "border-primary shadow-md" : "hover:border-primary/30"}`}
              onClick={() => setFilter(b.name === filter ? "All" : b.name)}
            >
              <CardContent className="p-5">
                <b.icon className="w-6 h-6 mb-3" style={{ color: b.color }} />
                <p className="text-2xl font-bold text-foreground">{b.count}</p>
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
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid hsl(220,16%,30%)", borderRadius: 8, color: "#111" }} labelStyle={{ color: "#111" }} itemStyle={{ color: "#111" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-4 justify-center mt-2">
              {buckets.map((b, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: b.color }} />{b.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Leads by Application</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={appData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,16%,18%)" />
                <XAxis type="number" tick={{ fill: "hsl(215,12%,55%)", fontSize: 12 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: "hsl(215,12%,55%)", fontSize: 12 }} width={90} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(220,18%,10%)", border: "1px solid hsl(220,16%,18%)", borderRadius: 8, color: "#fff" }} />
                <Bar dataKey="leads" fill="hsl(210,100%,56%)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Qualified Leads</CardTitle>
          <span className="text-sm text-muted-foreground">{filtered.length} leads</span>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.company}</TableCell>
                  <TableCell className="text-muted-foreground">{lead.category}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">{lead.app}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${lead.score}%` }} />
                      </div>
                      <span className="text-xs text-foreground font-mono">{lead.score}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[lead.status]}>{lead.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
