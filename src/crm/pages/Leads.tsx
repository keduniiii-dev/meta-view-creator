import AdminLoginDialog from "@/crm/components/AdminLoginDialog";
import { useConfirmation } from "@/hooks/use-confirmation";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { renameLeadCsvHeaders } from "@/lib/lead-csv";
import MoveToPipeline from "@/crm/components/MoveToPipeline";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { Archive, ChevronLeft, ChevronRight, Download, Eye, GitBranch, Pencil, Plus, Search, ShieldCheck, Trash2, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Lead } from "@/lib/types";
import { useArchiveLead, useDeleteLead, useImportLeads, useLeads, useLeadOptions, useUpdateLead } from "@/hooks/use-leads";
import { useIndustries } from "@/hooks/use-industries";
import { useServerErrors } from "@/hooks/use-server-errors";
import { ServerErrorBanner, ServerFieldError } from "@/crm/components/ServerErrorBanner";
import { useRegions } from "@/hooks/use-regions";
import { formatProjectSize } from "@/lib/money";
import { crmPath } from "@/lib/crm-base";

const badgeClass = (value: string | null) => value === "qualified" || value === "won" ? "bg-emerald-500/15 text-emerald-300" : value === "proposal" ? "bg-amber-500/15 text-amber-300" : "bg-primary/10 text-primary";
const leadActionClass = "h-11 w-11 shrink-0 md:h-8 md:w-8 rounded-md border border-border/70 bg-muted/40 text-muted-foreground shadow-none hover:border-primary/40 hover:bg-primary/10 hover:text-primary";
const phaseBadgeClass = (value: string) => {
  const phase = value.toLowerCase();
  if (phase.includes("rfp") || phase.includes("discovery")) return "border-0 bg-sky-500/15 text-sky-300";
  if (phase.includes("technical") || phase.includes("eval")) return "border-0 bg-amber-500/15 text-amber-300";
  if (phase.includes("shortlist") || phase.includes("proposal")) return "border-0 bg-emerald-500/15 text-emerald-300";
  return "border-0 bg-slate-500/15 text-slate-300";
};

const EditLead = ({ lead, onClose }: { lead: Lead; onClose: () => void }) => {
  const update = useUpdateLead();
  const leadOptions = useLeadOptions();
  const server = useServerErrors(["full_name", "email", "company", "job_title", "phone", "project", "industry", "phase", "temperature", "application_tools", "status", "project_size", "project_value", "currency"]);
  const [status, setStatus] = useState<Lead["status"]>(lead.status);
  const [extra, setExtra] = useState({ full_name: lead.full_name, email: lead.email, company: lead.company ?? "", job_title: lead.job_title ?? "", phone: lead.phone ?? "", project: lead.project ?? "", industry: lead.industry ?? "", phase: lead.phase ?? "", temperature: lead.temperature ?? "", application_tools: lead.application_tools?.join("\n") ?? "" });
  const [projectSize, setProjectSize] = useState(lead.project_size ?? "");
  const [projectValue, setProjectValue] = useState(lead.project_value == null ? "" : String(lead.project_value));
  const [currency, setCurrency] = useState(lead.currency ?? "");
  const statuses = [...new Set([lead.status, ...(leadOptions.data?.statuses ?? [])])];
  return <Dialog open onOpenChange={(open) => { if (!open && !update.isPending) onClose(); }}>
    <DialogContent className="max-h-[90dvh] overflow-y-auto"><DialogHeader><DialogTitle>Edit lead</DialogTitle><DialogDescription>{lead.full_name} — {lead.company || "Lead details"}</DialogDescription></DialogHeader>
<form className="space-y-4" onSubmit={(event) => {
        event.preventDefault();
        server.clear();
        const parsedValue = projectValue.trim() ? Number(projectValue) : null;
        if (parsedValue !== null && (!Number.isFinite(parsedValue) || parsedValue < 0)) return;
        update.mutate({ id: lead.id, ...extra, phase: (extra.phase || null) as Lead["phase"], temperature: (extra.temperature || null) as Lead["temperature"], application_tools: [...new Set(extra.application_tools.split(/\r?\n/).map(value => value.trim()).filter(Boolean))], status, project_size: projectSize.trim() || null, project_value: parsedValue, currency: currency.trim().toUpperCase() || null }, { onSuccess: onClose, onError: (failure: Error) => server.capture(failure) });
      }}>
        <ServerErrorBanner message={server.bannerMessage} />
        {(["full_name", "email", "company", "job_title", "phone", "project"] as const).map(key => <div key={key} className="space-y-2"><Label htmlFor={`edit-${key}`}>{key.replace(/_/g, " ")}</Label><Input id={`edit-${key}`} required={key === "full_name" || key === "email"} type={key === "email" ? "email" : "text"} disabled={update.isPending} value={extra[key]} onChange={e => setExtra({ ...extra, [key]: e.target.value })} /><ServerFieldError message={server.fieldErrors[key]} /></div>)}
{(["industry", "phase", "temperature"] as const).map(key => {
          const choices = key === "industry" ? leadOptions.data?.industries : key === "phase" ? leadOptions.data?.phases : leadOptions.data?.temperatures;
          return <div key={key} className="space-y-2"><Label htmlFor={`edit-${key}`}>{key}</Label><Select value={extra[key] || "unspecified"} onValueChange={value => setExtra({ ...extra, [key]: value === "unspecified" ? "" : value })} disabled={update.isPending}><SelectTrigger id={`edit-${key}`}><SelectValue placeholder="Unspecified" /></SelectTrigger><SelectContent><SelectItem value="unspecified">Unspecified</SelectItem>{[...new Set([extra[key], ...(choices ?? [])])].filter(Boolean).map(value => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select><ServerFieldError message={server.fieldErrors[key]} /></div>;
        })}
        <div className="grid gap-3 sm:grid-cols-2"><div className="space-y-1 rounded-lg border border-border bg-muted/30 px-3 py-2"><p className="text-xs text-muted-foreground">Region</p><p className="text-sm font-medium">{lead.region || "Unassigned"}</p></div><div className="space-y-1 rounded-lg border border-border bg-muted/30 px-3 py-2"><p className="text-xs text-muted-foreground">Country</p><p className="text-sm font-medium">{lead.country || "Unassigned"}</p></div></div>
        <div className="space-y-2"><Label htmlFor="edit-applications">Applications (one per line)</Label><Textarea id="edit-applications" className="w-full rounded border bg-background p-3" disabled={update.isPending} value={extra.application_tools} onChange={e => setExtra({ ...extra, application_tools: e.target.value })} /><ServerFieldError message={server.fieldErrors.application_tools} /></div>
        {leadOptions.isError && <p role="alert" className="text-destructive">{leadOptions.error.message}</p>}
        <div className="space-y-2"><Label htmlFor="edit-lead-status">Status</Label>
          <Select value={status} disabled={update.isPending} onValueChange={value => setStatus(value as Lead["status"])}><SelectTrigger id="edit-lead-status"><SelectValue /></SelectTrigger><SelectContent>
            {statuses.map((item) => <SelectItem key={item} value={item}>{item === "won" ? "Closed Won" : item === "lost" ? "Closed Lost" : item[0].toUpperCase() + item.slice(1)}</SelectItem>)}
</SelectContent></Select>
          <ServerFieldError message={server.fieldErrors.status} />
        </div>
        <div className="space-y-2"><Label htmlFor="edit-project-size">Project size</Label><Input id="edit-project-size" value={projectSize} disabled={update.isPending} onChange={(event) => setProjectSize(event.target.value)} /><ServerFieldError message={server.fieldErrors.project_size} /><p className="text-xs text-muted-foreground">Overall project size or range, separate from the bid amount.</p></div>
        <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="edit-project-value">Project value</Label><Input id="edit-project-value" type="number" min="0" step="any" value={projectValue} disabled={update.isPending} onChange={(event) => setProjectValue(event.target.value)} placeholder="Not confirmed" /><ServerFieldError message={server.fieldErrors.project_value} /></div><div className="space-y-2"><Label htmlFor="edit-currency">Currency</Label><Input id="edit-currency" value={currency} disabled={update.isPending} onChange={(event) => setCurrency(event.target.value.toUpperCase())} placeholder="GBP" /><ServerFieldError message={server.fieldErrors.currency} /><p className="text-xs text-muted-foreground">ISO code, e.g. GBP, USD, EUR.</p></div></div>
<DialogFooter><Button type="button" variant="outline" disabled={update.isPending} onClick={onClose}>Cancel</Button><Button type="submit" disabled={update.isPending}>{update.isPending ? "Saving..." : "Save changes"}</Button></DialogFooter>
      </form>
    </DialogContent>
  </Dialog>;
};

const Leads = () => {
  const { confirm, confirmation } = useConfirmation();
  const navigate = useNavigate();
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState(""); const [industry, setIndustry] = useState("all"); const [region, setRegion] = useState("all"); const [phase, setPhase] = useState("all"); const [page, setPage] = useState(1);
  const [details, setDetails] = useState<Lead | null>(null); const [pipelineLead, setPipelineLead] = useState<Lead | null>(null); const [adminOpen, setAdminOpen] = useState(false);
  const filters = useMemo(() => ({ search: search || undefined, industry: industry === "all" ? undefined : industry, region: region === "all" ? undefined : region, phase: phase === "all" ? undefined : phase, archived: false }), [search, industry, region, phase]);
  const query = useLeads(page, 20, filters); const options = useLeads(1, 100, { archived: false }); const importer = useImportLeads(); const archive = useArchiveLead(); const remove = useDeleteLead(); const industries = useIndustries(); const regions = useRegions();
  const leads = query.data?.leads ?? []; const all = options.data?.leads ?? []; const pagination = query.data?.pagination;
  const leadOptions = useLeadOptions();
  const industryOptions = leadOptions.data?.industries ?? industries.data?.industries ?? [...new Set(all.map((lead) => lead.industry).filter(Boolean))] as string[];
const regionOptions = leadOptions.data?.regions ?? regions.data?.regions ?? [...new Set(all.map((lead) => lead.region).filter(Boolean))] as string[];
  const phaseOptions = leadOptions.data?.phases ?? [...new Set(all.map((lead) => lead.phase).filter(Boolean))] as string[];
  useEffect(() => { setPage(1); }, [search, industry, region, phase]);
  const exportCsv = async () => {
    if (exporting) return;
    setExporting(true);
    setExportError("");
    try {
      const response = await api.download("/leads/export", filters);
      const blob = response.data;
      const contentType = String(response.headers["content-type"] || blob.type).toLowerCase();
      if (contentType.includes("json")) {
        let message = "The server returned JSON instead of a CSV file.";
        try {
          const body = JSON.parse(await blob.text());
          if (typeof body.message === "string") message = body.message;
        } catch { /* Use the format error when JSON is malformed. */ }
        throw new Error(message);
      }
      if (contentType.includes("text/html")) throw new Error("The export endpoint returned a web page instead of a CSV file.");
      if (!blob.size) throw new Error("The server returned an empty export file.");
      const csv = renameLeadCsvHeaders(await blob.text());
      const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = "twinblueprint-leads.csv";
      document.body.appendChild(link);
      try { link.click(); } finally {
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
      toast.success("CSV download started");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not export leads. Please try again.";
      setExportError(message);
      toast.error(message);
    } finally { setExporting(false); }
  };
  const importCsv = (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (file) importer.mutate(file); event.target.value = ""; };
  return <div className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8"><div className="mb-5 flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-3xl font-bold">Leads</h1><p className="mt-1 text-sm text-muted-foreground">{pagination?.total ?? 0} leads found</p></div><div className="flex flex-wrap gap-2"><Input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={importCsv} /><Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}><Upload className="mr-2 h-3.5 w-3.5" />Import CSV</Button><Button variant="outline" size="sm" onClick={exportCsv} disabled={exporting}><Download className="mr-2 h-3.5 w-3.5" />{exporting ? "Exporting..." : "Export CSV"}</Button><Button variant="outline" size="sm" onClick={() => setAdminOpen(true)}><ShieldCheck className="mr-2 h-3.5 w-3.5" />Admin</Button><Button size="sm" onClick={() => navigate(crmPath("/capture"))}><Plus className="mr-2 h-3.5 w-3.5" />Add Lead</Button></div></div><div className="mb-4 grid gap-3 rounded-xl border border-border bg-card p-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_160px_160px_160px]"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, company, or project..." /></div><Select value={industry} onValueChange={setIndustry}><SelectTrigger><SelectValue placeholder="All Industries" /></SelectTrigger><SelectContent><SelectItem value="all">All Industries</SelectItem>{industryOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select><Select value={region} onValueChange={setRegion}><SelectTrigger><SelectValue placeholder="All Regions" /></SelectTrigger><SelectContent><SelectItem value="all">All Regions</SelectItem>{regionOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select><Select value={phase} onValueChange={setPhase}><SelectTrigger><SelectValue placeholder="All Phases" /></SelectTrigger><SelectContent><SelectItem value="all">All Phases</SelectItem>{phaseOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
    {exportError && <p role="alert" className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">Export failed: {exportError}</p>}
    <div className="leads-table-scroll overflow-x-auto rounded-xl border border-border bg-card"><Table className="mobile-records w-full break-words text-left text-xs" aria-label="Leads"><TableHeader className="border-b border-border text-muted-foreground"><TableRow><TableHead className="px-3 py-3 font-medium">Company</TableHead><TableHead className="hidden px-3 py-3 font-medium md:table-cell">Industry</TableHead><TableHead className="hidden px-3 py-3 font-medium xl:table-cell">Project</TableHead><TableHead className="px-3 py-3 font-medium">Name</TableHead><TableHead className="hidden px-3 py-3 font-medium md:table-cell">Region</TableHead><TableHead className="hidden px-3 py-3 font-medium xl:table-cell">Country</TableHead><TableHead className="hidden px-3 py-3 font-medium xl:table-cell">Size</TableHead><TableHead className="hidden px-3 py-3 font-medium md:table-cell">Phase</TableHead><TableHead className="hidden px-3 py-3 font-medium lg:table-cell">Applications</TableHead><TableHead className="px-3 py-3 font-medium">Status</TableHead><TableHead className="hidden px-3 py-3 font-medium">Temperature</TableHead><TableHead className="px-3 py-3 font-medium">Actions</TableHead></TableRow></TableHeader><TableBody className="divide-y divide-border">{query.isLoading ? <TableRow><TableCell colSpan={12} className="py-12 text-center">Loading leads…</TableCell></TableRow> : leads.map((lead) => <TableRow key={lead.id}><TableCell data-label="Company" className="px-3 py-3 font-semibold">{lead.company || "—"}</TableCell><TableCell data-label="Industry" className="hidden px-3 py-3 md:table-cell">{lead.industry || "—"}</TableCell><TableCell data-label="Project" className="hidden px-3 py-3 xl:table-cell">{lead.project || "—"}</TableCell><TableCell data-label="Name" className="px-3 py-3"><b>{lead.full_name}</b><br /><span className="text-primary">{lead.job_title || "—"}</span><br /><span className="text-muted-foreground">{lead.email}</span></TableCell><TableCell data-label="Region" className="hidden px-3 py-3 md:table-cell">{lead.region || "—"}</TableCell><TableCell data-label="Country" className="hidden px-3 py-3 xl:table-cell">{lead.country || "—"}</TableCell><TableCell data-label="Size" className="hidden px-3 py-3 xl:table-cell">{formatProjectSize(lead.project_value, lead.currency, lead.project_size)}</TableCell><TableCell data-label="Phase" className="hidden px-3 py-3 md:table-cell">{lead.phase ? <Badge className={phaseBadgeClass(lead.phase)}>{lead.phase}</Badge> : "—"}</TableCell><TableCell data-label="Applications" className="hidden px-3 py-3 lg:table-cell">{lead.application_tools?.length ? lead.application_tools.join(", ") : "-"}</TableCell><TableCell data-label="Status" className="px-3 py-3"><span className={"rounded-full px-2 py-1 " + badgeClass(lead.status)}>{lead.status}</span></TableCell><TableCell data-label="Temperature" className="hidden px-3 py-3">{lead.temperature
  ? lead.temperature[0].toUpperCase() + lead.temperature.slice(1)
  : "—"}</TableCell><TableCell data-label="Actions" className="px-3 py-3"><div className="flex flex-wrap items-center gap-2 md:flex-nowrap md:gap-1.5"><Button type="button" variant="outline" size="icon" className={leadActionClass} title="Edit lead" aria-label={"Edit " + lead.full_name} onClick={() => setEditingLead(lead)}><Pencil className="h-3.5 w-3.5" /></Button><Button type="button" variant="outline" size="icon" className={leadActionClass} aria-label={"View " + lead.full_name} title="View details" onClick={() => setDetails(lead)}><Eye className="h-3.5 w-3.5" /></Button><Button type="button" variant="outline" size="icon" className={leadActionClass} aria-label={"Move " + lead.full_name + " to pipeline"} title="Move to pipeline" onClick={() => setPipelineLead(lead)}><GitBranch className="h-3.5 w-3.5" /></Button><Button type="button" variant="outline" size="icon" className={leadActionClass} disabled={archive.isPending} aria-label={"Archive " + lead.full_name} title="Archive lead" onClick={async () => await confirm("Archive " + lead.full_name + "?") && archive.mutate(lead.id)}><Archive className="h-3.5 w-3.5" /></Button><Button type="button" variant="outline" size="icon" title="Delete lead" disabled={remove.isPending} aria-label={"Delete " + lead.full_name} className={`${leadActionClass} text-destructive hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive}`} onClick={async () => await confirm("Permanently delete " + lead.full_name + "?") && remove.mutate(lead.id)}><Trash2 className="h-3.5 w-3.5" /></Button></div></TableCell></TableRow>)}{!query.isLoading && !leads.length && <TableRow><TableCell colSpan={12} className="py-12 text-center text-muted-foreground">No leads match these filters.</TableCell></TableRow>}</TableBody></Table></div>
    {pagination && pagination.pages > 1 && <div className="mt-4 flex justify-end gap-2"><Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}><ChevronLeft />Previous</Button><Button variant="outline" size="sm" disabled={page === pagination.pages} onClick={() => setPage(page + 1)}>Next<ChevronRight /></Button></div>}
    <Dialog open={Boolean(details)} onOpenChange={(open) => !open && setDetails(null)}><DialogContent><DialogHeader><DialogTitle>{details?.full_name}</DialogTitle><DialogDescription>{details?.company || "Lead details"}</DialogDescription></DialogHeader>{details && <div className="grid min-w-0 grid-cols-1 gap-3 text-sm [overflow-wrap:anywhere] sm:grid-cols-2"><p>Project: {details.project || "—"}</p><p>Project size: {formatProjectSize(details.project_value, details.currency, details.project_size)}</p><p>Region: {details.region || "—"}</p><p>Country: {details.country || "—"}</p><p>Applications: {details.application_tools?.length ? details.application_tools.join(", ") : "-"}</p><p>Score: {details.score}</p><p>Temperature: {details.temperature || "—"}</p></div>}</DialogContent></Dialog>{adminOpen && <AdminLoginDialog onClose={() => setAdminOpen(false)} />}{editingLead && <EditLead key={editingLead.id} lead={editingLead} onClose={() => setEditingLead(null)} />}<MoveToPipeline lead={pipelineLead} onClose={() => setPipelineLead(null)} />
    {confirmation}
  </div>;
};
export default Leads;
