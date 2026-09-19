import { usePipeline } from "@/hooks/use-demo";
import type { Lead } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QueryStatus } from "@/crm/components/QueryStatus";
import { formatCurrency } from "@/lib/money";

export const outreachStages = ["Discovery", "Qualified", "Proposal", "Negotiation", "Closed Won"] as const;
export type OutreachStage = typeof outreachStages[number];

export default function OutreachDealFlow({ selectedId, onSelect }: { selectedId?: string; onSelect: (lead: Lead, stage: OutreachStage) => void }) {
  const query = usePipeline();
  return <Card><CardHeader><CardTitle className="text-base">Deal Flow</CardTitle><p className="text-xs text-muted-foreground">Select a contact to personalize an email for their pipeline stage.</p></CardHeader><CardContent><QueryStatus query={query} />{query.isSuccess && <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{outreachStages.map(name => {
    const stage = query.data?.stages?.find(item => item.name === name);
    return <div key={name} className="min-w-0 rounded-lg border bg-muted/20 p-4"><div className="flex items-center justify-between gap-2"><h3 className="text-sm font-semibold">{name}</h3><Badge variant="secondary">{stage?.count ?? 0}</Badge></div><p className="mt-3 text-xs text-muted-foreground">Pipeline value</p><p className="my-3 text-xl font-semibold">{formatCurrency(stage?.value, stage?.currency, { compact: true, fallback: "Not available" })}</p><div className="space-y-2 border-t pt-3">{stage?.leads.filter(lead => !lead.archived).map(lead => <Button key={lead.id} variant="outline" aria-pressed={selectedId === lead.id} onClick={() => onSelect(lead, name)} className={`h-auto w-full justify-start whitespace-normal break-words px-2 py-2 text-left text-xs ${selectedId === lead.id ? "border-primary text-primary" : "bg-background/50"}`}>{lead.company || lead.full_name}<span className="sr-only"> — {lead.full_name}</span></Button>)}{!stage?.leads.some(lead => !lead.archived) && <p className="text-xs text-muted-foreground">No active contacts</p>}</div></div>;
  })}</div>}</CardContent></Card>;
}
