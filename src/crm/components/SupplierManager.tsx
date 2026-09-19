import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSuppliers, useSaveSupplier, useLinkSupplier } from "@/hooks/use-suppliers";
import { useServerErrors } from "@/hooks/use-server-errors";
import { ServerErrorBanner, ServerFieldError } from "@/crm/components/ServerErrorBanner";
import type { Supplier, Bid } from "@/lib/types";

const supplierFieldPaths: Record<string, string> = {
  name: "name",
  role: "role",
  contactName: "contact.name",
  jobTitle: "contact.job_title",
  email: "contact.email",
  visualisation: "visualisation_tool",
  opportunity: "opportunity",
  tools: "tools",
  painPoints: "pain_points",
};

export function SupplierDetails({ supplier }: { supplier: Supplier }) {
  return <Card className="min-w-0 bg-muted/20 shadow-none"><CardContent className="space-y-2 p-3 text-xs">
    <div className="flex flex-wrap justify-between gap-2"><p className="font-semibold text-primary">{supplier.name}</p><span className="text-muted-foreground">{supplier.tools?.join(", ")}</span></div>
    {supplier.role && <p className="text-muted-foreground">{supplier.role}</p>}
    <div className="flex flex-wrap items-center gap-2">{supplier.temperature && <Badge variant="secondary">{supplier.temperature}</Badge>}<span>{supplier.contact?.name} {supplier.contact?.job_title && `(${supplier.contact.job_title})`}</span>{supplier.contact?.email && <a className="break-all text-primary" href={`mailto:${supplier.contact.email}`}>{supplier.contact.email}</a>}</div>
    {supplier.visualisation_tool && <p>Using: {supplier.visualisation_tool}</p>}
    {supplier.uses_3d === false && <p>No 3D visualisation</p>}
    {supplier.opportunity && <p className="text-primary">{supplier.opportunity}</p>}
    {supplier.pain_points?.map((point, index) => <p key={index} className="text-amber-400">{point}</p>)}
  </CardContent></Card>;
}

function SupplierForm({ supplier, onClose }: { supplier: Supplier | null; onClose: () => void }) {
  const save = useSaveSupplier();
  const server = useServerErrors(["name", "role", "tools", "temperature", "contact", "contact.name", "contact.job_title", "contact.email", "visualisation_tool", "uses_3d", "opportunity", "pain_points"]);
  const [form, setForm] = useState({ name: supplier?.name ?? "", role: supplier?.role ?? "", tools: supplier?.tools?.join("\n") ?? "", temperature: supplier?.temperature ?? "", contactName: supplier?.contact?.name ?? "", jobTitle: supplier?.contact?.job_title ?? "", email: supplier?.contact?.email ?? "", visualisation: supplier?.visualisation_tool ?? "", uses3d: supplier?.uses_3d == null ? "" : String(supplier.uses_3d), opportunity: supplier?.opportunity ?? "", painPoints: supplier?.pain_points?.join("\n") ?? "" });
  const list = (value: string) => [...new Set(value.split(/\r?\n/).map(item => item.trim()).filter(Boolean))];
  return <Dialog open onOpenChange={open => { if (!open && !save.isPending) onClose(); }}><DialogContent hideClose={save.isPending} className="max-h-[90dvh] overflow-y-auto sm:max-w-xl"><DialogHeader><DialogTitle>{supplier ? "Edit supplier" : "Create supplier"}</DialogTitle><DialogDescription>Unknown details can be left blank. Tools and pain points use one entry per line.</DialogDescription></DialogHeader>
    <form className="mt-4 space-y-4" onSubmit={e => { e.preventDefault(); if (!form.name.trim()) return; server.clear(); save.mutate({ id: supplier?.id, name: form.name.trim(), role: form.role.trim() || null, tools: list(form.tools), temperature: (form.temperature || null) as Supplier["temperature"], contact: { name: form.contactName.trim() || null, job_title: form.jobTitle.trim() || null, email: form.email.trim() || null }, visualisation_tool: form.visualisation.trim() || null, uses_3d: form.uses3d === "" ? null : form.uses3d === "true", opportunity: form.opportunity.trim() || null, pain_points: list(form.painPoints) }, { onSuccess: onClose, onError: (failure: Error) => server.capture(failure) }); }}>
      <fieldset disabled={save.isPending} className="space-y-3">
        <ServerErrorBanner message={server.bannerMessage} />
        {([["name", "Supplier name"], ["role", "Role"], ["contactName", "Contact name"], ["jobTitle", "Job title"], ["email", "Email"], ["visualisation", "Visualisation tool"], ["opportunity", "Opportunity"]] as const).map(([key, label]) => <div key={key} className="space-y-1"><Label htmlFor={`supplier-${key}`}>{label}</Label><Input id={`supplier-${key}`} required={key === "name"} type={key === "email" ? "email" : "text"} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} /><ServerFieldError message={server.fieldErrors[supplierFieldPaths[key]]} /></div>)}
        <div className="space-y-1"><Label htmlFor="supplier-temperature">Status</Label><Select value={form.temperature || "unknown"} onValueChange={value => setForm({ ...form, temperature: value === "unknown" ? "" : value as typeof form.temperature })}><SelectTrigger id="supplier-temperature"><SelectValue /></SelectTrigger><SelectContent>{["unknown", "hot", "warm", "cool"].map(value => <SelectItem key={value} value={value}>{value === "unknown" ? "Unknown" : value}</SelectItem>)}</SelectContent></Select><ServerFieldError message={server.fieldErrors.temperature} /></div>
        <div className="space-y-1"><Label htmlFor="supplier-3d">Uses 3D</Label><Select value={form.uses3d || "unknown"} onValueChange={value => setForm({ ...form, uses3d: value === "unknown" ? "" : value })}><SelectTrigger id="supplier-3d"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="unknown">Unknown</SelectItem><SelectItem value="true">Yes</SelectItem><SelectItem value="false">No</SelectItem></SelectContent></Select><ServerFieldError message={server.fieldErrors.uses_3d} /></div>
        {([["tools", "Tools"], ["painPoints", "Pain points"]] as const).map(([key, label]) => <div key={key} className="space-y-1"><Label htmlFor={`supplier-${key}`}>{label}</Label><Textarea id={`supplier-${key}`} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} /><ServerFieldError message={server.fieldErrors[supplierFieldPaths[key]]} /></div>)}
      </fieldset>
      <div className="flex justify-end gap-2"><Button type="button" variant="outline" disabled={save.isPending} onClick={onClose}>Cancel</Button><Button disabled={save.isPending}>{save.isPending ? "Saving..." : "Save supplier"}</Button></div>
    </form>
  </DialogContent></Dialog>;
}

export default function SupplierManager({ bids, onClose }: { bids: Bid[]; onClose: () => void }) {
  const [page, setPage] = useState(1);
  const query = useSuppliers(page);
  const link = useLinkSupplier();
  const [bidId, setBidId] = useState(bids[0]?.id ?? "");
  const [editor, setEditor] = useState<{ supplier: Supplier | null } | null>(null);
  const [notice, setNotice] = useState("");
  return <Dialog open onOpenChange={open => { if (!open && !link.isPending) onClose(); }}><DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl"><DialogHeader><DialogTitle>Supplier profiles</DialogTitle><DialogDescription>Create profiles, edit details, and link suppliers to a pipeline bid.</DialogDescription></DialogHeader>
    <Button className="mt-4" onClick={() => setEditor({ supplier: null })}>Create supplier</Button>
    <div className="my-4 space-y-1"><Label htmlFor="supplier-bid">Bid to link</Label><Select value={bidId || "none"} onValueChange={value => { setBidId(value === "none" ? "" : value); setNotice(""); }}><SelectTrigger id="supplier-bid"><SelectValue placeholder="Select a bid" /></SelectTrigger><SelectContent><SelectItem value="none">Select a bid</SelectItem>{bids.map(bid => <SelectItem key={bid.id} value={bid.id}>{bid.project} — {bid.client}</SelectItem>)}</SelectContent></Select></div>
    {query.isLoading && <p>Loading suppliers...</p>}
    {query.isError && <p role="alert" className="text-destructive">{query.error.message}</p>}
    {query.isSuccess && !query.data.suppliers.length && <p>No supplier profiles yet.</p>}
    <div className="space-y-3">{query.data?.suppliers.map(supplier => <div key={supplier.id}><SupplierDetails supplier={supplier} /><div className="mt-2 flex flex-wrap gap-2"><Button size="sm" variant="outline" className="h-auto min-h-11 max-w-full whitespace-normal text-left" onClick={() => setEditor({ supplier })}>Edit {supplier.name}</Button><Button size="sm" disabled={!bidId || link.isPending} onClick={() => link.mutate({ bidId, supplierId: supplier.id }, { onSuccess: () => setNotice(`${supplier.name} linked to bid.`) })}>Link to bid</Button></div></div>)}</div>
    {link.isError && <p role="alert" className="text-destructive">{link.error.message}</p>}{notice && <p role="status">{notice}</p>}
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-muted-foreground">{query.data ? `Page ${page} of ${Math.max(1, query.data.pagination.pages)} · ${query.data.pagination.total} supplier${query.data.pagination.total === 1 ? "" : "s"}` : "Loading pages..."}</p><div className="flex gap-2"><Button type="button" variant="outline" disabled={query.isFetching || page <= 1} onClick={() => setPage(page - 1)}>Previous</Button><Button type="button" variant="outline" disabled={query.isFetching || !query.data || page >= query.data.pagination.pages} onClick={() => setPage(page + 1)}>Next</Button></div></div>
    {editor && <SupplierForm key={editor.supplier?.id ?? "new"} supplier={editor.supplier} onClose={() => setEditor(null)} />}
  </DialogContent></Dialog>;
}
