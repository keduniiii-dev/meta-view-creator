import { useConfirmation } from "@/hooks/use-confirmation";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { ArchiveRestore, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteLead, useLeads, useUpdateLead } from "@/hooks/use-leads";
import type { Lead } from "@/lib/types";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { crmPath } from "@/lib/crm-base";

const ArchivedLeadRecords = () => {
  const { confirm, confirmation } = useConfirmation();
  const leadsQuery = useLeads(1, 100, { archived: true });
  const restoreLead = useUpdateLead();
  const deleteLead = useDeleteLead();
  const leads = leadsQuery.data?.leads ?? [];
  const restore = async (lead: Lead) => { if (await confirm("Restore " + lead.full_name + " to active leads?")) restoreLead.mutate({ id: lead.id, archived: false }); };
  const remove = async (lead: Lead) => { if (await confirm("Permanently delete " + lead.full_name + "? This cannot be undone.")) deleteLead.mutate(lead.id); };

  return <div className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8">
    <div className="mb-5"><h1 className="text-3xl font-bold">Archived Leads</h1><p className="mt-1 text-sm text-muted-foreground">Restore archived records or permanently remove them.</p></div>
    {leadsQuery.isError && <p className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">Could not load archived leads.</p>}
    <div className="overflow-x-auto rounded-xl border border-border bg-card"><Table className="mobile-records w-full md:min-w-[820px] text-left text-xs" aria-label="Archived leads"><TableHeader className="border-b border-border text-muted-foreground"><TableRow>{["Company", "Industry", "Name", "Email", "Region", "Status", "Actions"].map((heading) => <TableHead key={heading} className="whitespace-nowrap px-4 py-3 font-medium">{heading}</TableHead>)}</TableRow></TableHeader><TableBody className="divide-y divide-border">{leadsQuery.isLoading ? <TableRow><TableCell colSpan={7} className="px-4 py-12 text-center text-muted-foreground">Loading archived leads…</TableCell></TableRow> : leads.map((lead) => <TableRow key={lead.id} className="hover:bg-muted/40"><TableCell data-label="Company" className="px-4 py-3 font-semibold">{lead.company || "—"}</TableCell><TableCell data-label="Industry" className="px-4 py-3">{lead.industry || "—"}</TableCell><TableCell data-label="Name" className="px-4 py-3">{lead.full_name}</TableCell><TableCell data-label="Email" className="px-4 py-3 text-muted-foreground">{lead.email}</TableCell><TableCell data-label="Region" className="px-4 py-3 text-muted-foreground">{lead.region || "—"}</TableCell><TableCell data-label="Status" className="px-4 py-3">{lead.status}</TableCell><TableCell data-label="Actions" className="px-4 py-3"><div className="flex flex-wrap gap-2"><Button variant="ghost" size="sm" disabled={restoreLead.isPending} onClick={() => restore(lead)}><ArchiveRestore className="mr-1 h-3.5 w-3.5" />Restore</Button><Button variant="ghost" size="icon" className="h-11 w-11 md:h-7 md:w-7 text-destructive hover:text-destructive" disabled={deleteLead.isPending} onClick={() => remove(lead)} aria-label={"Delete " + lead.full_name}><Trash2 className="h-3.5 w-3.5" /></Button></div></TableCell></TableRow>)}{!leadsQuery.isLoading && !leads.length && <TableRow><TableCell colSpan={7} className="px-4 py-12 text-center text-muted-foreground">No archived leads.</TableCell></TableRow>}</TableBody></Table></div>
    {confirmation}
  </div>;
};

export default function ArchivedLeads() {
  const { user, loading } = useAuth();
  if (loading) return <p role="status" className="p-6">Checking admin access…</p>;
  if (user?.role !== "admin") return <Navigate to={crmPath("/leads")} replace />;
  return <ArchivedLeadRecords />;
}
