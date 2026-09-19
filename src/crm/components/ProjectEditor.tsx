import { useState } from "react";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateProject, useUpdateProject } from "@/hooks/use-projects";
import { useServerErrors } from "@/hooks/use-server-errors";
import { ServerErrorBanner, ServerFieldError } from "@/crm/components/ServerErrorBanner";
import type { Project } from "@/lib/types";

const projectFields = ["project", "client", "start_date", "end_date", "progress", "value", "currency", "status", "phase", "suppliers", "uses_3d", "competitor", "issue"] as const;

export function ProjectDate({ id, value, onChange, disabled }: { id: string; value: string; onChange: (value: string) => void; disabled: boolean }) {
  const [open, setOpen] = useState(false);
  return <Popover open={open} onOpenChange={setOpen}><PopoverTrigger asChild><Button id={id} type="button" variant="outline" disabled={disabled} className="w-full justify-start font-normal"><CalendarIcon className="mr-2 h-4 w-4" />{value ? format(parseISO(value), "PP") : "Pick a date"}</Button></PopoverTrigger><PopoverContent align="start" className="w-auto p-0"><Calendar mode="single" initialFocus selected={value ? parseISO(value) : undefined} defaultMonth={value ? parseISO(value) : undefined} onSelect={date => { onChange(date ? format(date, "yyyy-MM-dd") : ""); setOpen(false); }} /></PopoverContent></Popover>;
}

export default function ProjectEditor({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const create = useCreateProject();
  const update = useUpdateProject();
  const server = useServerErrors(projectFields);
  const [status, setStatus] = useState(project?.status ?? "In-flight");
  const [phase, setPhase] = useState<Project["phase"]>(project?.phase ?? "Planning");
  const [name, setName] = useState(project?.project ?? "");
  const [client, setClient] = useState(project?.client ?? "");
  const [start, setStart] = useState(project?.start_date?.slice(0, 10) ?? "");
  const [end, setEnd] = useState(project?.end_date?.slice(0, 10) ?? "");
  const [progress, setProgress] = useState(String(project?.progress ?? 0));
  const [value, setValue] = useState(project?.value == null ? "" : String(project.value));
  const [currency, setCurrency] = useState(project?.currency ?? "USD");
  const [suppliers, setSuppliers] = useState(project?.suppliers?.join("\n") ?? "");
  const [uses3d, setUses3d] = useState(project?.uses_3d ?? false);
  const [competitor, setCompetitor] = useState(project?.competitor ?? "");
  const [issue, setIssue] = useState(project?.issue ?? "");
  const [error, setError] = useState("");
  const busy = create.isPending || update.isPending;
  return <Dialog open onOpenChange={open => { if (!open && !busy) onClose(); }}><DialogContent hideClose={busy} className="max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto sm:max-w-xl"><DialogHeader><DialogTitle>{project ? "Edit project" : "Create project"}</DialogTitle><DialogDescription>Manage project dates, progress, suppliers, and delivery details.</DialogDescription></DialogHeader>
    <form className="mt-4 space-y-4" onSubmit={event => {
      event.preventDefault();
      if (!name.trim() || !client.trim()) { setError("Enter a project and client name."); return; }
      if (!start || !end || end < start) { setError("Choose both dates, with the end date on or after the start date."); return; }
      if (!progress.trim() || !Number.isFinite(Number(progress)) || Number(progress) < 0 || Number(progress) > 100) { setError("Progress must be between 0 and 100."); return; }
      setError("");
      server.clear();
      const data = { status, phase, project: name.trim(), client: client.trim(), start_date: start, end_date: end, progress: Number(progress), value: value.trim() === "" ? null : Number(value), currency: currency.trim() || null, suppliers: [...new Set(suppliers.split(/\r?\n/).map(value => value.trim()).filter(Boolean))], uses_3d: uses3d, competitor: competitor.trim(), issue: issue.trim() };
      const options = { onSuccess: onClose, onError: (failure: Error) => server.capture(failure) };
      if (project) update.mutate({ id: project.id, ...data }, options); else create.mutate(data, options);
    }}>
      <fieldset disabled={busy} className="space-y-4"><ServerErrorBanner message={server.bannerMessage} /><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="project-status">Status</Label><Select value={status} onValueChange={setStatus}><SelectTrigger id="project-status"><SelectValue /></SelectTrigger><SelectContent>{["Active", "In-flight", "On Hold", "Completed", "Cancelled"].map(value => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label htmlFor="project-phase">Phase</Label><Select value={phase ?? "Planning"} onValueChange={value => setPhase(value as Project["phase"])}><SelectTrigger id="project-phase"><SelectValue /></SelectTrigger><SelectContent>{["Planning", "Design", "Construction", "In Progress", "Completed"].map(value => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div></div>
        <div className="space-y-2"><Label htmlFor="project-name">Project name</Label><Input id="project-name" required value={name} onChange={e => setName(e.target.value)} /><ServerFieldError message={server.fieldErrors.project} /></div>
        <div className="space-y-2"><Label htmlFor="project-client">Client</Label><Input id="project-client" required value={client} onChange={e => setClient(e.target.value)} /><ServerFieldError message={server.fieldErrors.client} /></div>
        <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="project-start">Start date</Label><ProjectDate id="project-start" value={start} onChange={setStart} disabled={busy} /><ServerFieldError message={server.fieldErrors.start_date} /></div><div className="space-y-2"><Label htmlFor="project-end">End date</Label><ProjectDate id="project-end" value={end} onChange={setEnd} disabled={busy} /><ServerFieldError message={server.fieldErrors.end_date} /></div></div>
        <div className="space-y-2"><Label htmlFor="project-progress">Progress (%)</Label><Input id="project-progress" type="number" min="0" max="100" step="any" required value={progress} onChange={e => setProgress(e.target.value)} /><ServerFieldError message={server.fieldErrors.progress} /></div>
        <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="project-value">Project value</Label><Input id="project-value" type="number" min="0" step="any" value={value} onChange={e => setValue(e.target.value)} placeholder="Not confirmed" /><ServerFieldError message={server.fieldErrors.value} /></div><div className="space-y-2"><Label htmlFor="project-currency">Currency</Label><Input id="project-currency" value={currency} onChange={e => setCurrency(e.target.value.toUpperCase())} placeholder="USD" /><ServerFieldError message={server.fieldErrors.currency} /></div></div>
        <div className="space-y-2"><Label htmlFor="project-suppliers">Suppliers</Label><Textarea id="project-suppliers" value={suppliers} onChange={e => setSuppliers(e.target.value)} /><ServerFieldError message={server.fieldErrors.suppliers} /><p className="text-xs text-muted-foreground">Enter one supplier name per line.</p></div>
        <div className="flex items-center gap-2"><Checkbox id="project-3d" checked={uses3d} onCheckedChange={value => setUses3d(value === true)} /><Label htmlFor="project-3d">Uses 3D visualisation</Label></div>
        <div className="space-y-2"><Label htmlFor="project-competitor">Competitor (optional)</Label><Input id="project-competitor" value={competitor} onChange={e => setCompetitor(e.target.value)} /><ServerFieldError message={server.fieldErrors.competitor} /></div>
        <div className="space-y-2"><Label htmlFor="project-issue">Issues (optional)</Label><Textarea id="project-issue" value={issue} onChange={e => setIssue(e.target.value)} /><ServerFieldError message={server.fieldErrors.issue} /></div>
      </fieldset>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <DialogFooter className="gap-2"><Button type="button" variant="outline" disabled={busy} onClick={onClose}>Cancel</Button><Button type="submit" disabled={busy}>{busy ? "Saving..." : project ? "Save changes" : "Create project"}</Button></DialogFooter>
    </form>
  </DialogContent></Dialog>;
}
