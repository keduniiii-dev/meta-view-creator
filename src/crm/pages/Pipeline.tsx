import { motion } from "framer-motion";
import { Calendar, MapPin, Users, AlertTriangle, CheckCircle, Clock, ArrowRight } from "lucide-react";

const bids = [
  { project: "Hudson Yards Phase 4", client: "Related Companies", phase: "RFP Review", deadline: "2026-05-15", suppliers: ["Turner", "Skanska", "PCL"], value: "$420M" },
  { project: "LAX Terminal Modernization", client: "LAWA", phase: "Technical Eval", deadline: "2026-04-28", suppliers: ["Bechtel", "AECOM", "Fluor"], value: "$2.1B" },
  { project: "Chicago Riverfront Tower", client: "Sterling Bay", phase: "Shortlist", deadline: "2026-06-01", suppliers: ["Clark Construction", "Lendlease"], value: "$310M" },
];
const inflightProjects = [
  { project: "Miami Worldcenter", client: "MDM Group", start: "2024-03", end: "2027-08", progress: 42, suppliers: ["Suffolk", "Moss", "Coastal"], uses3D: true, competitor: "Enscape", issue: "Clash detection delays" },
  { project: "Austin Tech Campus", client: "Apple Inc.", start: "2025-01", end: "2027-12", progress: 18, suppliers: ["DPR", "Hensel Phelps"], uses3D: false, competitor: null, issue: "No visualisation in stakeholder reviews" },
  { project: "Denver Transit Hub", client: "RTD Denver", start: "2024-06", end: "2026-11", progress: 67, suppliers: ["Kiewit", "Granite"], uses3D: true, competitor: "Lumion", issue: "Rendering bottlenecks at scale" },
];
const phaseColors: Record<string, string> = {
  "RFP Review": "bg-primary/20 text-primary",
  "Technical Eval": "bg-warning/20 text-warning",
  "Shortlist": "bg-success/20 text-success",
};

const Pipeline = () => (
  <div className="p-6 lg:p-8">
    <h1 className="text-3xl font-bold text-foreground mb-2">Project Pipeline</h1>
    <p className="text-muted-foreground mb-10">Active bids, inflight projects, supplier networks & competitive analysis</p>

    <div className="mb-12">
      <h2 className="text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary" /> Active Bids
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {bids.map((bid, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="gradient-card rounded-xl border border-border p-6 shadow-card hover:border-primary/30 transition-all">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-base font-semibold text-foreground">{bid.project}</h3>
              <span className={`px-2 py-1 rounded-md text-xs font-medium ${phaseColors[bid.phase]}`}>{bid.phase}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{bid.client}</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-4 h-4 text-primary/60" /><span>Closes: {bid.deadline}</span></div>
              <div className="flex items-center gap-2 text-muted-foreground"><Users className="w-4 h-4 text-primary/60" /><span>{bid.suppliers.join(", ")}</span></div>
              <div className="text-xl font-bold text-foreground mt-3">{bid.value}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>

    <div className="mb-12">
      <h2 className="text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-accent" /> Inflight Projects
      </h2>
      <div className="space-y-4">
        {inflightProjects.map((proj, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="gradient-card rounded-xl border border-border p-6 shadow-card">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">{proj.project}</h3>
                <p className="text-sm text-muted-foreground mt-1">{proj.client} · {proj.start} → {proj.end}</p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden max-w-xs">
                    <div className="h-full rounded-full gradient-primary" style={{ width: `${proj.progress}%` }} />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">{proj.progress}%</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 lg:min-w-[280px]">
                <div className="flex items-center gap-2 text-sm"><Users className="w-4 h-4 text-primary/60" /><span className="text-muted-foreground">{proj.suppliers.join(", ")}</span></div>
                <div className="flex items-center gap-2 text-sm"><AlertTriangle className="w-4 h-4 text-warning" /><span className="text-warning">{proj.issue}</span></div>
                {proj.uses3D ? (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Using: <strong className="text-destructive">{proj.competitor}</strong></span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    <span className="text-success font-semibold">Twinblueprint advantage</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-success" /><span className="text-success">No visualisation — greenfield opportunity</span></div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default Pipeline;
