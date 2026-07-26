import { motion } from "framer-motion";
import { Calendar, MapPin, Users, AlertTriangle, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { usePipeline } from "@/hooks/use-demo";

const phaseVariant: Record<string, "default" | "secondary" | "outline"> = {
  "RFP Review": "default",
  "Technical Eval": "secondary",
  "Shortlist": "outline",
};

const Pipeline = () => {
  const { data, isLoading, isError } = usePipeline();

  const bids = data?.bids ?? [];
  const projects = data?.projects ?? [];

  const loading = isLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertTriangle className="w-10 h-10 text-destructive" />
        <p className="text-muted-foreground">Unable to load pipeline data</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Project Pipeline</h1>
        <p className="text-muted-foreground">Active bids, inflight projects, supplier networks & competitive analysis</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
          Active Bids
        </h2>
        {bids.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {bids.map((bid, i) => (
              <motion.div key={bid.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="hover:border-primary/30 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-base font-semibold text-foreground">{bid.project}</h3>
                      <Badge variant={phaseVariant[bid.phase] || "outline"}>{bid.phase}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{bid.client}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-4 h-4 text-primary/60" /><span>Closes: {bid.deadline}</span></div>
                      <div className="flex items-center gap-2 text-muted-foreground"><Users className="w-4 h-4 text-primary/60" /><span>{(bid.suppliers ?? []).join(", ")}</span></div>
                      {bid.value != null && <div className="text-xl font-bold text-foreground mt-3">${bid.value.toLocaleString()}</div>}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No active bids</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
          Inflight Projects
        </h2>
        {projects.length > 0 ? (
          <div className="space-y-4">
            {projects.map((proj, i) => (
              <motion.div key={proj.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">{proj.project}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{proj.client} · {proj.start_date} → {proj.end_date}</p>
                        <div className="flex items-center gap-2 mt-3 max-w-xs">
                          <Progress value={proj.progress} className="h-2" />
                          <span className="text-xs font-mono text-muted-foreground">{proj.progress}%</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 lg:min-w-[280px]">
                        <div className="flex items-center gap-2 text-sm"><Users className="w-4 h-4 text-primary/60" /><span className="text-muted-foreground">{(proj.suppliers ?? []).join(", ")}</span></div>
                        {proj.issue && (
                          <div className="flex items-center gap-2 text-sm"><AlertTriangle className="w-4 h-4 text-yellow-500" /><span className="text-yellow-500">{proj.issue}</span></div>
                        )}
                        {proj.uses_3d ? (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Using: <strong className="text-destructive">{proj.competitor}</strong></span>
                            <ArrowRight className="w-3 h-3 text-muted-foreground" />
                            <span className="text-green-500 font-semibold">Twinblueprint advantage</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-green-500">No visualisation — greenfield opportunity</span></div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No projects yet</p>
        )}
      </div>
    </div>
  );
};

export default Pipeline;
