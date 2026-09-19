import SupplierNetwork from "@/crm/components/SupplierNetwork";
import { Progress } from "@/components/ui/progress";
import { useConfirmation } from "@/hooks/use-confirmation";
import SupplierManager, { SupplierDetails } from "@/crm/components/SupplierManager";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProjectEditor from "@/crm/components/ProjectEditor";
import BidEditor from "@/crm/components/BidEditor";
import type { Bid, Project } from "@/lib/types";
import { CalendarDays, Clock3, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePipeline } from "@/hooks/use-demo";
import { useBids, useDeleteBid } from "@/hooks/use-bids";
import { useProjects, useDeleteProject } from "@/hooks/use-projects";
import { formatCurrency, formatProjectSize } from "@/lib/money";

const money = (value: number | null | undefined, currency: string | null | undefined) => formatCurrency(value, currency, { compact: true });
const date = (value: string) => new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "short", day: "numeric" }).format(new Date(value));

const Pipeline = () => {
  const { confirm, confirmation } = useConfirmation();
  const [supplierManagerOpen, setSupplierManagerOpen] = useState(false);
  const [editor, setEditor] = useState<{ project: Project | null } | null>(null);
  const [bidEditor, setBidEditor] = useState<{ bid: Bid | null } | null>(null);
  const deleteProject = useDeleteProject();
  const deleteBid = useDeleteBid();
  const pipelineQuery = usePipeline();
  const bidsQuery = useBids(1, 100);
  const projectsQuery = useProjects(1, 100);
  const pipeline = pipelineQuery.data;
  const stages = pipeline?.stages ?? [];
  const activeBids = pipeline?.active_bids ?? [];
  const inflightProjects = pipeline?.inflight_projects ?? [];
  const bids = bidsQuery.data?.bids ?? [];
  const totalBids = bidsQuery.data?.pagination.total ?? activeBids.length;
  const pipelineValue = bids.reduce((sum, bid) => sum + (Number(bid.value) || 0), 0);
  const pipelineCurrencies = [...new Set(bids.map((bid) => bid.currency).filter(Boolean))];
  const pipelineCurrency = pipelineCurrencies.length === 1 ? pipelineCurrencies[0] : null;
  const error = pipelineQuery.isError || bidsQuery.isError || projectsQuery.isError;

  const linkedBids = [...activeBids, ...stages.flatMap(stage => stage.bids)];

  return <div className="mx-auto max-w-[1600px] space-y-8 px-5 py-7 sm:px-8">
    <header><h1 className="text-3xl font-bold">Project Pipeline</h1><p className="mt-1 text-sm text-muted-foreground">Live deal flow, active bids, and in-flight projects.</p></header>
    {!error && <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl border border-border bg-card p-4"><p className="text-xs text-muted-foreground">Pipeline Value</p><p className="mt-1 text-2xl font-bold tabular-nums text-primary">{money(pipelineValue, pipelineCurrency)}</p><p className="mt-1 text-xs text-muted-foreground">{Number(pipelineValue) ? (pipelineCurrency ? `Totaled in ${pipelineCurrency}` : "Mixed currencies") : "No bid values yet"}</p></div><div className="rounded-xl border border-border bg-card p-4"><p className="text-xs text-muted-foreground">Active Bids</p><p className="mt-1 text-2xl font-bold tabular-nums">{activeBids.length}</p><p className="mt-1 text-xs text-muted-foreground">{totalBids} total</p></div><div className="rounded-xl border border-border bg-card p-4"><p className="text-xs text-muted-foreground">Inflight Projects</p><p className="mt-1 text-2xl font-bold tabular-nums">{inflightProjects.length}</p></div></div>}
    {error && <p className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">Unable to load pipeline data. Confirm the API is running and you are signed in.</p>}
    <section><h2 className="mb-4 text-lg font-semibold">Deal Flow</h2><div className="grid items-start gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">{pipelineQuery.isLoading ? <p className="text-sm text-muted-foreground">Loading deal flow…</p> : stages.map((stage) => <Card key={stage.name} className="min-w-0 overflow-hidden border-border bg-muted/20 shadow-none"><CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border p-4"><CardTitle className="text-sm">{stage.name}</CardTitle><Badge variant="secondary" className="text-[10px]">{stage.count}</Badge></CardHeader><CardContent className="space-y-3 p-3"><p className="text-xs font-semibold text-primary">{money(stage.value, stage.currency)}</p>{stage.leads.map((lead) => { const bid = stage.bids.find((item) => item.lead_id === lead.id); return <div key={lead.id} className="min-w-0 rounded-lg border border-border bg-card p-4 shadow-sm"><p className="break-words text-sm font-semibold leading-snug">{lead.company || lead.full_name}</p><p className="mt-1 break-words text-xs leading-relaxed text-muted-foreground">{lead.project || "No project specified"}</p><div className="mt-3 flex flex-col items-start gap-3"><div className="w-full min-w-0 space-y-2 rounded-md bg-muted/40 p-3 text-xs leading-relaxed"><p className="break-words">Project size: {formatProjectSize(lead.project_value, lead.currency, lead.project_size, "Not specified")}</p><p className="break-words font-medium text-primary">Bid amount: {bid?.value == null ? "Not confirmed" : money(bid.value, bid?.currency)}</p></div><Badge variant="secondary" className="max-w-full whitespace-normal break-words text-[11px]">{lead.region || "—"}</Badge></div>{bid?.suppliers?.length ? <p className="mt-3 break-words border-t border-border pt-3 text-xs leading-relaxed text-primary">Suppliers: {bid.suppliers.join(" · ")}</p> : <p className="mt-3 break-words border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">Suppliers: Not assigned</p>}</div>; })}{!stage.leads.length && <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-xs text-muted-foreground">No leads in this stage.</p>}</CardContent></Card>)}</div></section>
    <section><h2 className="mb-4 flex flex-wrap items-center gap-2 text-lg font-semibold"><Clock3 className="h-5 w-5 text-primary" />Active Bids <span className="text-sm font-normal text-muted-foreground">({activeBids.length} active / {totalBids} total)</span><Button className="ml-auto" onClick={() => setBidEditor({ bid: null })}>Create bid</Button></h2><div className="grid gap-4 lg:grid-cols-2">{activeBids.map((bid) => <Card key={bid.id} className="min-w-0 border-border shadow-none"><CardContent className="p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0 flex-1 basis-40"><h3 className="break-words font-semibold">{bid.project}</h3><p className="mt-1 text-sm text-muted-foreground">{bid.client}</p></div><div className="flex flex-wrap gap-2"><Badge>{bid.status || "—"}</Badge><Badge variant="secondary">{bid.phase}</Badge><Button variant="outline" size="sm" onClick={() => setBidEditor({ bid })}>Edit bid</Button><Button variant="ghost" size="sm" disabled={deleteBid.isPending} onClick={async () => { if (await confirm("Permanently delete bid " + bid.project + "?")) deleteBid.mutate(bid.id); }}>Delete bid</Button></div></div><div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4 text-sm text-muted-foreground"><span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" />Closes: {date(bid.deadline)}</span><strong className="text-lg text-foreground">{money(bid.value, bid.currency)}</strong></div>{bid.supplier_details?.length ? <div className="mt-3 space-y-3">{bid.supplier_details.map(supplier => <SupplierDetails key={supplier.id} supplier={supplier} />)}</div> : bid.suppliers?.length ? <div className="mt-3 flex flex-wrap gap-2">{bid.suppliers.map((supplier) => <Badge key={supplier} variant="secondary">{supplier}</Badge>)}</div> : <p className="mt-3 text-sm text-muted-foreground">No suppliers assigned.</p>}</CardContent></Card>)}{!pipelineQuery.isLoading && !activeBids.length && <Card><CardContent className="p-6 text-sm text-muted-foreground">No active bids yet.</CardContent></Card>}</div></section>
    <section><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="flex flex-wrap items-center gap-2 text-lg font-semibold"><MapPin className="h-5 w-5 text-accent" />Inflight Projects <span className="text-sm font-normal text-muted-foreground">({inflightProjects.length})</span></h2><Button onClick={() => setEditor({ project: null })}>Create project</Button></div><div className="space-y-3">{inflightProjects.map((project) => <Card key={project.id}><CardContent className="grid gap-5 p-5 lg:grid-cols-2"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="break-words font-semibold">{project.project}</h3><Badge variant={project.status === "At Risk" ? "destructive" : "secondary"}>{project.status || "—"}</Badge><Button type="button" variant="outline" size="sm" aria-label={"Edit project " + project.project} onClick={() => setEditor({ project })}>Edit</Button><Button variant="ghost" size="sm" disabled={deleteProject.isPending} onClick={async () => { if (await confirm("Permanently delete project " + project.project + "?")) deleteProject.mutate(project.id); }}>Delete</Button></div><p className="mt-2 text-sm text-muted-foreground">{project.client} · {date(project.start_date)} to {date(project.end_date)}</p><Progress className="mt-4 h-2" value={Math.min(100, Math.max(0, project.progress))} aria-label={project.project + " progress"} /><p className="mt-1 text-right text-xs text-muted-foreground">{project.progress}%</p></div><div className="min-w-0 break-words text-sm lg:border-l lg:border-border lg:pl-5"><p className="text-muted-foreground"><Users className="mr-2 inline h-4 w-4 text-primary" />{project.suppliers?.length ? project.suppliers.join(" · ") : "No suppliers assigned"}</p><p className="mt-3">{project.uses_3d ? "Using 3D visualisation" : "3D visualisation not specified"}</p>{project.competitor && <p className="mt-2 text-muted-foreground">Competitor: {project.competitor}</p>}{project.issue && <p className="mt-2 text-warning">Issue: {project.issue}</p>}</div></CardContent></Card>)}{!pipelineQuery.isLoading && !inflightProjects.length && <Card><CardContent className="p-6 text-sm text-muted-foreground">No in-flight projects yet.</CardContent></Card>}</div></section>
    <SupplierNetwork onManage={() => setSupplierManagerOpen(true)} />
    {supplierManagerOpen && <SupplierManager bids={[...new Map(linkedBids.map(bid => [bid.id, bid])).values()]} onClose={() => setSupplierManagerOpen(false)} />}
    {bidEditor && <BidEditor key={bidEditor.bid?.id ?? "new"} bid={bidEditor.bid} onClose={() => setBidEditor(null)} />}
    {editor && <ProjectEditor key={editor.project?.id ?? "new"} project={editor.project} onClose={() => setEditor(null)} />}
    {confirmation}
  </div>;
};

export default Pipeline;
