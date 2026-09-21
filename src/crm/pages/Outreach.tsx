import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { emailHtmlToText, emailTextToHtml, hasEscapedEmailMarkup } from "@/lib/email-text";
import OutreachDealFlow, { outreachStages, type OutreachStage } from "@/crm/components/OutreachDealFlow";
import FollowUpSequence from "@/crm/components/FollowUpSequence";
import LinkedInActivity from "@/crm/components/LinkedInActivity";
import type { Lead } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { CampaignStats } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OutreachForm, OutreachField } from "@/crm/components/OutreachForm";
import { useLeads } from "@/hooks/use-leads";
import { useCampaign, useCampaigns, useCreateCampaign, useUpdateCampaign, useDeleteCampaign } from "@/hooks/use-campaigns";
import { useOutreachMessages, useOutreachPreview, useSendOutreach } from "@/hooks/use-outreach";
import { crmStore } from "@/crm/lib/store";
import { fallback } from "@/crm/lib/fallback";
import { QueryStatus, PaginationControls, EmptyState } from "@/crm/components/QueryStatus";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Mail, Plus, Pencil, Trash2, Copy, MessageSquare, Megaphone, Inbox } from "lucide-react";
import OutreachMetrics from "@/crm/components/OutreachMetrics";
import OutreachActivity from "@/crm/components/OutreachActivity";
const templates = {
  "Bidding Phase": { subject: "Supporting {{project}} at {{company}}", template: "<p>Dear {{full_name}},</p><p>We would love to discuss how Twinblueprint can support your bid preparation for {{project}} at {{company}}.</p><p>Would you be open to a 15-minute call?</p><p>Best regards,<br>Twinblueprint Team</p>" },
  "In-Flight Project": { subject: "Supporting the next phase of {{project}}", template: "<p>Dear {{full_name}},</p><p>How can Twinblueprint support design coordination for {{project}} at {{company}}?</p><p>Would you be open to a 15-minute call?</p>" },
  "Follow-Up": { subject: "Following up on {{project}}", template: "<p>Dear {{full_name}},</p><p>I wanted to follow up on how Twinblueprint can support {{project}} at {{company}}. Is there a good time to connect?</p>" },
};

const stageCopy: Record<OutreachStage, { subject: string; body: string }> = {
  Discovery: { subject: "Exploring 3D Visualization for {{company}}'s Upcoming Projects", body: "I'm reaching out to learn more about {{company}}'s pipeline — particularly around {{project}}. At Twinblueprint, we partner with construction and architecture leaders to streamline early-stage planning with immersive 3D models.</p><p>Would you be open to a short discovery call to explore where our framework could add value?" },
  Qualified: { subject: "Exploring the right 3D solution for {{project}}", body: "Following our introduction, we'd love to understand the design coordination priorities for {{project}} at {{company}}.</p><p>Could we arrange a short call to discuss your requirements and demonstrate a relevant 3D workflow?" },
  Proposal: { subject: "Next steps on our proposal for {{project}}", body: "I'm following up on our proposal for {{project}} at {{company}}.</p><p>Would you be available to review the scope, deliverables, and timeline together?" },
  Negotiation: { subject: "Aligning on scope and terms for {{project}}", body: "We look forward to supporting {{company}} on {{project}}.</p><p>Can we schedule a conversation to resolve any remaining questions about scope, pricing, or delivery?" },
  "Closed Won": { subject: "Getting started on {{project}}", body: "Thank you for choosing Twinblueprint to support {{project}} at {{company}}.</p><p>Let's arrange a kickoff meeting to confirm the team, milestones, and next steps." },
};
function stageTemplate(stage: OutreachStage) {
  const copy = stageCopy[stage];
  return { subject: `[${stage}] ${copy.subject}`, template: emailHtmlToText(`<p>Dear {{full_name}},</p><p>${copy.body}</p><p>Best regards,<br>Twinblueprint Team</p>`) };
}
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]!));

// Field paths the backend reports in VALIDATION_ERROR fields[] (see
// twinblueprint-server outreachPreviewSchema / outreachSendSchema).
const composerFields = ["lead_id", "subject", "template", "campaign_id"] as const;
const campaignFields = ["name", "type", "campaign-date", "campaign_date", "status"] as const;

function CampaignDateServerMessage() {
  const { formState } = useFormContext();
  const message = formState.errors.campaign_date?.message ?? formState.errors["campaign-date"]?.message;
  return message ? <p role="alert" className="text-xs text-destructive">{String(message)}</p> : null;
}

function CampaignDetail({ id }: { id: string }) {
  const detail = useCampaign(id);
  const stats = useQuery({ queryKey: ["campaigns", id, "stats"], queryFn: () => fallback(() => api.get<CampaignStats>(`/campaigns/${id}/stats`), () => crmStore.campaignStatsFor(id)) });
  return <div className="rounded-lg border p-4"><QueryStatus query={detail} /><QueryStatus query={stats} />{detail.data && <p className="font-semibold">{detail.data.campaign.name} · {detail.data.campaign.campaign_date}</p>}{stats.data && <p className="mt-2 text-sm">Email tracking: {stats.data.total_sent} sent · {stats.data.total_opens} opened · {stats.data.total_clicks} clicked · {stats.data.avg_ctr}% CTR</p>}</div>;
}

function CampaignManager() {
  const [page, setPage] = useState(1);
  const query = useCampaigns(page);
  const create = useCreateCampaign();
  const update = useUpdateCampaign();
  const remove = useDeleteCampaign();
  const [id, setId] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [detailId, setDetailId] = useState("");
  const [serverError, setServerError] = useState<unknown>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState<"Email" | "LinkedIn">("Email");
  const [date, setDate] = useState(new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10));
  const [status, setStatus] = useState<"Active" | "Completed">("Active");
  const busy = create.isPending || update.isPending || remove.isPending;
  function reset() { setId(""); setName(""); setType("Email"); setStatus("Active"); }
  return <Card><CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4"><div><CardTitle className="text-lg">Campaigns</CardTitle><p className="mt-1 text-sm text-muted-foreground">Organize your outreach and track campaign activity.</p></div><Button onClick={() => { setServerError(null); reset(); setEditorOpen(true); }}><Plus className="mr-2 h-4 w-4" />New campaign</Button></CardHeader><CardContent className="space-y-4">
    <Dialog open={editorOpen} onOpenChange={open => { if (!busy) setEditorOpen(open); }}><DialogContent><DialogHeader><DialogTitle>{id ? "Edit campaign" : "Create campaign"}</DialogTitle><DialogDescription>Set up the campaign name, channel, and schedule.</DialogDescription></DialogHeader><OutreachForm className="grid gap-5" serverError={serverError} fieldNames={campaignFields} onSubmit={async e => { e.preventDefault(); const data = { name: name.trim(), type, campaign_date: date, status }; try { if (id) await update.mutateAsync({ id, ...data }); else await create.mutateAsync(data); reset(); setEditorOpen(false); } catch (error) { setServerError(error); } }}>
      <OutreachField name="name" label="Name" required disabled={busy} placeholder="e.g. September outreach" value={name} onChange={setName} />
      <OutreachField name="type" label="Type" value={type} disabled={busy} onChange={value => setType(value as typeof type)} options={[{ value: "Email", label: "Email" }, { value: "LinkedIn", label: "LinkedIn" }]} />
      <div className="space-y-2">
        <Label htmlFor="campaign-date">Campaign date</Label>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button id="campaign-date" type="button" variant="outline" disabled={busy} className="w-full justify-start text-left font-normal">
              <CalendarDays className="mr-2 h-4 w-4" />
              {format(parseISO(date), "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" required selected={parseISO(date)} defaultMonth={parseISO(date)} onSelect={selected => { if (selected) { setDate(format(selected, "yyyy-MM-dd")); setCalendarOpen(false); } }} initialFocus />
          </PopoverContent>
        </Popover>
        <CampaignDateServerMessage />
      </div>
      <OutreachField name="status" label="Status" value={status} disabled={busy} onChange={value => setStatus(value as typeof status)} options={[{ value: "Active", label: "Active" }, { value: "Completed", label: "Completed" }]} />
      <div className="flex gap-2"><Button disabled={busy || !name.trim()}>{id ? "Save changes" : "Create campaign"}</Button><Button type="button" variant="outline" disabled={busy} onClick={() => setEditorOpen(false)}>Cancel</Button></div>
    </OutreachForm></DialogContent></Dialog>
    <QueryStatus query={query} />
    <p className="text-xs text-muted-foreground">Select a campaign to view email engagement.</p>
    <div className="overflow-x-auto"><Table className="w-full min-w-[850px] text-left text-sm"><TableHeader><TableRow>{["Campaign", "Type", "Sent", "Opened", "Clicked", "Open Rate", "CTR", "Status", "Actions"].map(label => <TableHead className="p-3" key={label}>{label}</TableHead>)}</TableRow></TableHeader><TableBody>{query.data?.campaigns.map(c => { const openRate = c.open_rate ?? (c.sent > 0 ? Math.round((c.opened / c.sent) * 1000) / 10 : 0); const ctr = c.ctr ?? (c.sent > 0 ? Math.round((c.clicked / c.sent) * 1000) / 10 : 0); return <TableRow key={c.id} className="border-t"><TableCell className="p-3"><Button variant="ghost" className="text-primary underline" onClick={() => setDetailId(c.id)}>{c.name}</Button></TableCell><TableCell>{c.type}</TableCell><TableCell>{c.sent}</TableCell><TableCell>{c.opened}</TableCell><TableCell>{c.clicked}</TableCell><TableCell>{openRate}%</TableCell><TableCell>{ctr}%</TableCell><TableCell><Badge variant={c.status === "Active" ? "default" : "secondary"}>{c.status}</Badge></TableCell><TableCell className="p-3"><div className="flex items-center gap-2"><Button size="sm" variant="outline" disabled={busy} onClick={() => { setServerError(null); setEditorOpen(true); setId(c.id); setName(c.name); setType(c.type); setDate(c.campaign_date.slice(0, 10)); setStatus(c.status); }}><Pencil className="mr-1.5 h-3.5 w-3.5" />Edit</Button><Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" aria-label={`Delete ${c.name}`} disabled={busy} onClick={() => setDeleteTarget(c)}><Trash2 className="h-4 w-4" /></Button></div></TableCell></TableRow>; })}</TableBody></Table></div>
    {query.isSuccess && !query.data.campaigns.length && <EmptyState title="No campaigns yet" description="Create your first campaign to organize your outreach." />}
    <PaginationControls page={page} pages={query.data?.pagination.pages ?? 0} onChange={setPage} busy={query.isFetching} />
    <Dialog open={!!detailId} onOpenChange={open => { if (!open) setDetailId(""); }}><DialogContent><DialogHeader><DialogTitle>Campaign performance</DialogTitle><DialogDescription>Engagement totals from tracked email activity.</DialogDescription></DialogHeader>{detailId && <CampaignDetail id={detailId} />}</DialogContent></Dialog>
    <AlertDialog open={!!deleteTarget} onOpenChange={open => { if (!busy && !open) setDeleteTarget(null); }}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete campaign?</AlertDialogTitle><AlertDialogDescription>This will permanently delete &quot;{deleteTarget?.name}&quot;. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={busy} onClick={event => { event.preventDefault(); if (deleteTarget) remove.mutate(deleteTarget.id, { onSuccess: () => { setDeleteTarget(null); if (query.data?.campaigns.length === 1 && page > 1) setPage(page - 1); } }); }}>{remove.isPending ? "Deleting..." : "Delete campaign"}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </CardContent></Card>;
}

function Composer({ linkedin = false }: { linkedin?: boolean }) {
  const [leadPage, setLeadPage] = useState(1);
  const [campaignPage, setCampaignPage] = useState(1);
  const leads = useLeads(leadPage, 20, { archived: false });
  const campaigns = useCampaigns(campaignPage, 20);
  const [leadId, setLeadId] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [stage, setStage] = useState<OutreachStage>("Discovery");
  const [personalization, setPersonalization] = useState({ full_name: "", company: "", project: "" });
  const [campaignId, setCampaignId] = useState("");
  const [subject, setSubject] = useState(stageTemplate("Discovery").subject);
  const [template, setTemplate] = useState(stageTemplate("Discovery").template);
  const preview = useOutreachPreview();
  const send = useSendOutreach();
  const personalize = (text: string, html = false) => text.replace(/\{\{(full_name|company|project)\}\}/g, (_, key: keyof typeof personalization) => html ? escapeHtml(personalization[key]) : personalization[key]);
  function chooseStage(value: OutreachStage) { setStage(value); const draft = stageTemplate(value); setSubject(draft.subject); setTemplate(draft.template); preview.reset(); send.reset(); }
  function chooseLead(lead: Lead, value?: OutreachStage) { if (preview.isPending || send.isPending) return; setLeadId(lead.id); setSelectedLead(lead); setPersonalization({ full_name: lead.full_name, company: lead.company || "", project: lead.project || "" }); chooseStage(value ?? ({ qualified: "Qualified", proposal: "Proposal", negotiation: "Negotiation", won: "Closed Won" } as Partial<Record<Lead["status"], OutreachStage>>)[lead.status] ?? "Discovery"); }
  const input = { lead_id: leadId, subject: linkedin ? "LinkedIn introduction" : personalize(subject), template: linkedin ? "Hi {{full_name}}, let's discuss how Twinblueprint can support {{project}} at {{company}}. Would you be open to a 15-minute call?" : emailTextToHtml(personalize(template)) };
  const signature = JSON.stringify(input);
  const fresh = preview.isSuccess && JSON.stringify(preview.variables) === signature;
  const busy = preview.isPending || send.isPending;
  const escapedPreview = !linkedin && fresh && hasEscapedEmailMarkup(preview.data.html);
  const composerError = send.isError ? send.error : preview.isError ? preview.error : null;
  return <div className="space-y-6">{!linkedin && <><FollowUpSequence key={"sequence-" + leadId} lead={leadId ? selectedLead : null} subject={input.subject} message={input.template} />{leadId && selectedLead && <OutreachActivity key={"activity-" + leadId} lead={selectedLead} />}<OutreachDealFlow selectedId={leadId} onSelect={chooseLead} /></>}<Card><CardHeader><CardTitle className="text-lg">{linkedin ? "LinkedIn Message" : "Select Supplier & Personalize Email"}</CardTitle><p className="text-sm text-muted-foreground">Choose a recipient, personalize your message, then review before sending.</p>{!linkedin && <div className="flex flex-wrap gap-2 pt-3">{outreachStages.map(value => <Button key={value} size="sm" variant={stage === value ? "default" : "secondary"} aria-pressed={stage === value} disabled={busy} onClick={() => chooseStage(value)}>{value}</Button>)}</div>}</CardHeader><CardContent className="grid items-start gap-8 lg:grid-cols-2"><OutreachForm className="space-y-5" serverError={composerError} fieldNames={composerFields} onSubmit={event => { event.preventDefault(); if (!busy && leadId) preview.mutate(input); }}>
    <QueryStatus query={leads} />
    <OutreachField name="recipient" required label="Recipient" value={leadId} disabled={busy || leads.isPending} placeholder="Select a lead" onChange={value => { const lead = leads.data?.leads.find(item => item.id === value); if (lead) chooseLead(lead); }} options={[...(selectedLead && !leads.data?.leads.some(lead => lead.id === selectedLead.id) ? [selectedLead] : []), ...(leads.data?.leads ?? [])].map(lead => ({ value: lead.id, label: `${lead.full_name} - ${lead.company || lead.email}` }))} />
    {leads.isSuccess && !leads.data.leads.length && <p className="text-sm text-muted-foreground">No leads available.</p>}
    <PaginationControls page={leadPage} pages={leads.data?.pagination.pages ?? 0} busy={busy || leads.isFetching} onChange={page => { setLeadPage(page); setLeadId(""); preview.reset(); }} />
    {!linkedin && <>
      <div className="grid gap-3 sm:grid-cols-3">{([{ key: "full_name", label: "Contact name" }, { key: "company", label: "Company" }, { key: "project", label: "Project" }] as const).map(field => <OutreachField key={field.key} name={field.key} label={field.label} value={personalization[field.key]} disabled={busy || !leadId} onChange={value => { setPersonalization(current => ({ ...current, [field.key]: value })); preview.reset(); send.reset(); }} />)}</div>
      <div className="flex flex-wrap gap-2">{Object.entries(templates).map(([label, value]) => <Button type="button" key={label} variant="secondary" disabled={busy} onClick={() => { setSubject(value.subject); setTemplate(emailHtmlToText(value.template)); preview.reset(); send.reset(); }}>{label}</Button>)}</div>
      <OutreachField name="subject" label="Subject" required value={subject} disabled={busy} onChange={value => { setSubject(value); send.reset(); }} />
      <OutreachField name="template" label="Email message" required multiline className="[&_textarea]:min-h-48" value={template} disabled={busy} onChange={value => { setTemplate(value); send.reset(); }} />
      <p className="text-xs text-muted-foreground">Personalize with {"{{full_name}}, {{company}}, and {{project}}"}.</p>
      <QueryStatus query={campaigns} />
      <OutreachField name="campaign" label="Campaign (optional)" value={campaignId || "none"} disabled={busy} onChange={value => setCampaignId(value === "none" ? "" : value)} options={[{ value: "none", label: "No campaign" }, ...(campaigns.data?.campaigns ?? []).filter(c => c.type === "Email").map(c => ({ value: c.id, label: c.name }))]} />
      <PaginationControls page={campaignPage} pages={campaigns.data?.pagination.pages ?? 0} busy={busy || campaigns.isFetching} onChange={page => { setCampaignPage(page); setCampaignId(""); }} />
    </>}
    <Button type="submit" disabled={busy || !leadId || !input.subject.trim() || !input.template.trim()}>{preview.isPending ? "Preparing preview..." : "Preview"}</Button>
    </OutreachForm><div className="space-y-4 rounded-xl bg-muted/30 p-4 sm:p-5"><div className="flex items-center justify-between"><h3 className="text-sm font-semibold">Message preview</h3><Badge variant="outline">{fresh ? "Ready to review" : "Draft"}</Badge></div>{!fresh && <EmptyState title="Preview your message" description="Choose a recipient and generate a preview to review the personalized message here." />}
    {fresh && <div className="space-y-3 rounded-xl border p-4"><p className="text-sm">To: {preview.data.recipient}</p><p className="font-semibold">{preview.data.subject}</p><iframe title="Message preview" sandbox="" referrerPolicy="no-referrer" className="h-64 w-full rounded bg-white" srcDoc={`<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:">${escapedPreview ? emailTextToHtml(emailHtmlToText(preview.data.html)) : preview.data.html}`} /><div className="flex gap-2"><Button variant="outline" onClick={async () => { try { await navigator.clipboard.writeText(`${linkedin ? "" : preview.data.subject + "\n\n"}${emailHtmlToText(preview.data.html)}`); toast.success("Message copied"); } catch { toast.error("Could not copy message"); } }}><Copy className="mr-2 h-4 w-4" />Copy</Button>{!linkedin && <Button disabled={busy || send.isSuccess || escapedPreview} onClick={() => send.mutate({ ...input, campaign_id: campaignId || null })}>{send.isPending ? "Sending..." : send.isSuccess ? "Email sent" : "Send Email"}</Button>}</div></div>}
    {escapedPreview && <p role="alert" className="text-sm text-destructive">The server is escaping email formatting. Sending is paused until the backend fixes this, so recipients do not receive visible HTML tags. You can still copy the message.</p>}
    {linkedin && <LinkedInActivity leadId={leadId} message={fresh ? emailHtmlToText(preview.data.html) : ""} />}
  </div></CardContent></Card></div>;
}

function MessageHistory() {
  const [page, setPage] = useState(1);
  const query = useOutreachMessages(page);
  return <Card><CardHeader><CardTitle className="text-lg">Sent Email Tracker</CardTitle><p className="text-sm text-muted-foreground">Delivery and engagement activity for your outreach.</p></CardHeader><CardContent><QueryStatus query={query} /><div className="overflow-x-auto"><Table className="w-full min-w-[650px] text-left text-sm"><TableHeader><TableRow>{["Status", "Recipient", "Subject", "Sent At"].map(label => <TableHead key={label} className="p-3">{label}</TableHead>)}</TableRow></TableHeader><TableBody>{query.data?.messages.map(message => <TableRow key={message.id} className="border-t"><TableCell className="p-3 capitalize"><Badge variant={message.status === "bounced" ? "destructive" : "secondary"}>{message.status}</Badge></TableCell><TableCell className="p-3">{message.recipient}</TableCell><TableCell className="p-3">{message.subject}</TableCell><TableCell className="p-3">{message.sent_at ? new Date(message.sent_at).toLocaleString() : "Not sent"}</TableCell></TableRow>)}</TableBody></Table></div>{query.isSuccess && !query.data.messages.length && <EmptyState title="Your email history starts here" description="Sent emails and their delivery status will appear here." />}<PaginationControls page={page} pages={query.data?.pagination.pages ?? 0} onChange={setPage} busy={query.isFetching} /></CardContent></Card>;
}

export default function Outreach() {
  const [linkedinVisited, setLinkedinVisited] = useState(false);
  return <div className="mx-auto max-w-7xl space-y-8 px-5 py-7 sm:px-8">
    <header><p className="mb-2 text-xs font-medium uppercase tracking-widest text-primary">Engagement</p><h1 className="text-3xl font-semibold tracking-tight">Outreach Center</h1><p className="mt-2 text-sm text-muted-foreground">Build relationships with personalized messages and focused campaigns.</p></header>
    <OutreachMetrics />
    <Tabs defaultValue="email" onValueChange={value => { if (value === "linkedin") setLinkedinVisited(true); }} className="space-y-6"><TabsList className="grid h-auto w-full grid-cols-2 gap-1 p-1 sm:inline-flex sm:w-auto"><TabsTrigger value="email" className="py-2"><Mail className="mr-2 h-4 w-4" />Email Templates</TabsTrigger><TabsTrigger value="linkedin" className="py-2"><MessageSquare className="mr-2 h-4 w-4" />LinkedIn CTA</TabsTrigger><TabsTrigger value="campaigns" className="py-2"><Megaphone className="mr-2 h-4 w-4" />Campaigns</TabsTrigger><TabsTrigger value="sent" className="py-2"><Inbox className="mr-2 h-4 w-4" />Sent Emails</TabsTrigger></TabsList><TabsContent value="email"><Composer /></TabsContent><TabsContent value="linkedin" forceMount className="data-[state=inactive]:hidden">{linkedinVisited && <Composer linkedin />}</TabsContent><TabsContent value="campaigns"><CampaignManager /></TabsContent><TabsContent value="sent"><MessageHistory /></TabsContent></Tabs>
  </div>;
}
