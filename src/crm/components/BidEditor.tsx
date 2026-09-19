import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ProjectDate } from "./ProjectEditor";
import { useCreateBid, useUpdateBid } from "@/hooks/use-bids";
import { useServerErrors } from "@/hooks/use-server-errors";
import { ServerErrorBanner, ServerFieldError } from "@/crm/components/ServerErrorBanner";
import type { Bid } from "@/lib/types";

const bidFields = ["project", "client", "phase", "deadline", "value", "currency", "status", "lead_id", "suppliers"] as const;

export default function BidEditor({ bid, onClose }: { bid: Bid | null; onClose: () => void }) {
  const create = useCreateBid();
  const update = useUpdateBid();
  const server = useServerErrors(bidFields);
  const [status, setStatus] = useState(bid?.status ?? "Active");
  const [leadId, setLeadId] = useState(bid?.lead_id ?? "");
  const [project, setProject] = useState(bid?.project ?? "");
  const [client, setClient] = useState(bid?.client ?? "");
  const [phase, setPhase] = useState<Bid["phase"]>(bid?.phase ?? "RFP Review");
  const [deadline, setDeadline] = useState(bid?.deadline?.slice(0, 10) ?? "");
  const [value, setValue] = useState(bid?.value == null ? "" : String(bid.value));
  const [suppliers, setSuppliers] = useState(bid?.suppliers?.join("\n") ?? "");
  const [error, setError] = useState("");
  const busy = create.isPending || update.isPending;
  return <Dialog open onOpenChange={open => { if (!open && !busy) onClose(); }}><DialogContent hideClose={busy} className="max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto sm:max-w-lg"><DialogHeader><DialogTitle>{bid ? "Edit bid" : "Create bid"}</DialogTitle><DialogDescription>Manage the bid amount, deadline, and supplier names.</DialogDescription></DialogHeader>
    <form className="mt-4 space-y-4" onSubmit={event => {
      event.preventDefault();
      if (!status.trim() || !project.trim() || !client.trim() || !deadline) { setError("Enter a project, client, and deadline."); return; }
const amount = value.trim() ? Number(value) : null;
      if (amount !== null && (!Number.isFinite(amount) || amount < 0)) { setError("Enter an amount of zero or more."); return; }
      setError("");
      server.clear();
      const data = { status: status.trim(), lead_id: leadId.trim() || null, project: project.trim(), client: client.trim(), phase, deadline, value: amount, suppliers: [...new Set(suppliers.split(/\r?\n/).map(name => name.trim()).filter(Boolean))] };
      const options = { onSuccess: onClose, onError: (failure: Error) => server.capture(failure) };
      if (bid) update.mutate({ id: bid.id, ...data }, options); else create.mutate(data, options);
    }}>
<fieldset disabled={busy} className="space-y-4"><ServerErrorBanner message={server.bannerMessage} /><div className="space-y-2"><Label htmlFor="bid-status">Status</Label><Input id="bid-status" required value={status} onChange={e => setStatus(e.target.value)} /><ServerFieldError message={server.fieldErrors.status} /><p className="text-xs text-muted-foreground">Only Active bids appear in Active Bids.</p></div><div className="space-y-2"><Label htmlFor="bid-lead">Linked lead ID (optional)</Label><Input id="bid-lead" value={leadId} onChange={e => setLeadId(e.target.value)} /><ServerFieldError message={server.fieldErrors.lead_id} /></div>
        <div className="space-y-2"><Label htmlFor="bid-project">Project</Label><Input id="bid-project" value={project} required onChange={e => setProject(e.target.value)} /><ServerFieldError message={server.fieldErrors.project} /></div>
        <div className="space-y-2"><Label htmlFor="bid-client">Client</Label><Input id="bid-client" value={client} required onChange={e => setClient(e.target.value)} /><ServerFieldError message={server.fieldErrors.client} /></div>
        <div className="space-y-2"><Label htmlFor="bid-phase">Phase</Label><Select value={phase} onValueChange={v => setPhase(v as Bid["phase"])} disabled={busy}><SelectTrigger id="bid-phase"><SelectValue /></SelectTrigger><SelectContent>{["RFP Review", "Technical Eval", "Shortlist"].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select><ServerFieldError message={server.fieldErrors.phase} /></div>
        <div className="space-y-2"><Label htmlFor="bid-deadline">Deadline</Label><ProjectDate id="bid-deadline" value={deadline} onChange={setDeadline} disabled={busy} /><ServerFieldError message={server.fieldErrors.deadline} /></div>
        <div className="space-y-2"><Label htmlFor="bid-value">Bid amount (USD)</Label><Input id="bid-value" type="number" min="0" step="any" value={value} onChange={e => setValue(e.target.value)} /><ServerFieldError message={server.fieldErrors.value} /><p className="text-xs text-muted-foreground">Leave blank if unknown. Zero is a confirmed amount.</p></div>
        <div className="space-y-2"><Label htmlFor="bid-suppliers">Supplier names</Label><Textarea id="bid-suppliers" value={suppliers} onChange={e => setSuppliers(e.target.value)} /><ServerFieldError message={server.fieldErrors.suppliers} /><p className="text-xs text-muted-foreground">One name per line.</p></div>
      </fieldset>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <DialogFooter className="gap-2"><Button type="button" variant="outline" disabled={busy} onClick={onClose}>Cancel</Button><Button disabled={busy}>{busy ? "Saving..." : "Save bid"}</Button></DialogFooter>
    </form>
  </DialogContent></Dialog>;
}
