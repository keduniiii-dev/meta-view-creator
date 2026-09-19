import { useState } from "react";
import { emailHtmlToText, emailTextToHtml } from "@/lib/email-text";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useSequence, useSequences, useSequenceWrite, type SequenceDraftStep, type SequenceStep, type SequenceWrite } from "@/hooks/use-outreach-sequences";
import type { Lead } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OutreachForm, OutreachField } from "./OutreachForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SelectField } from "./CrmPageUi";
import { PaginationControls, QueryStatus } from "./QueryStatus";

const labels = { pending: "Pending", scheduled: "Scheduled", sent: "Sent", completed: "Completed", failed: "Failed", skipped: "Skipped", active: "Active", paused: "Paused", cancelled: "Cancelled" };
const channels = { linkedin: "LinkedIn", email: "Email", phone: "Phone" };
const localDate = (value: string) => { const date = new Date(value); return Number.isNaN(date.getTime()) ? value : date.toLocaleString(); };
const dateInput = (value: string) => { const date = new Date(value); return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16); };
type Operation = "start" | "edit" | "complete" | "skip" | "pause" | "resume" | "cancel";
const titles: Record<Operation, string> = { start: "Review and start sequence", edit: "Edit follow-up step", complete: "Complete manual activity", skip: "Skip step", pause: "Pause sequence", resume: "Resume sequence", cancel: "Cancel sequence" };

export default function FollowUpSequence({ lead, subject, message }: { lead: Lead | null; subject: string; message: string }) {
  const { user } = useAuth();
  const admin = user?.role === "admin";
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState("");
  const list = useSequences(lead?.id ?? "", page);
  const sequenceId = selectedId || list.data?.sequences[0]?.id || "";
  const detail = useSequence(sequenceId);
  const sequence = detail.data;
  const write = useSequenceWrite();
  const [operation, setOperation] = useState<Operation | null>(null);
  const [step, setStep] = useState<SequenceStep | null>(null);
  const [drafts, setDrafts] = useState<SequenceDraftStep[]>([]);
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const closedLead = lead?.archived || lead?.status === "won" || lead?.status === "lost" || lead?.lead_status === "Closed";
  const live = sequence?.status === "active" || sequence?.status === "paused";
  function open(action: Operation, target?: SequenceStep) {
    write.reset(); setError(""); setNotes(""); setOperation(action); setStep(target ?? null);
    setTime(target ? dateInput(target.due_at) : "");
    setDrafts(target ? [{ channel: target.channel, subject: target.subject ?? "", message: target.channel === "email" ? emailHtmlToText(target.message) : target.message }] : [
      { channel: "linkedin", message: "Hi {{full_name}}, I'd like to connect about {{project}} at {{company}}." },
      { channel: "email", subject, message: emailHtmlToText(message) },
      { channel: "email", subject: "Following up on {{project}}", message: "Hi {{full_name}},\n\nFollowing up on our introduction. Would you be available to discuss {{project}} at {{company}}?" },
      { channel: "phone", message: "Call {{full_name}} about {{project}} and record the outcome." },
    ]);
  }
  async function submit() {
    if (!admin || !lead || !operation) return;
    setError("");
    try {
      let input: SequenceWrite;
      if (operation === "start") input = { action: "start", body: { lead_id: lead.id, ...(time ? { start_at: new Date(time).toISOString() } : {}), steps: drafts.map(draft => ({ channel: draft.channel, message: draft.channel === "email" ? emailTextToHtml(draft.message) : draft.message, ...(draft.channel === "email" ? { subject: draft.subject } : {}) })) } };
      else if (!sequence) return;
      else if (operation === "edit" && step) input = { action: "edit", id: sequence.id, stepId: step.id, body: { ...(dateInput(step.due_at) !== time ? { due_at: new Date(time).toISOString() } : {}), message: step.channel === "email" ? (drafts[0].message === emailHtmlToText(step.message) ? step.message : emailTextToHtml(drafts[0].message)) : drafts[0].message, ...(step.channel === "email" ? { subject: drafts[0].subject } : {}) } };
      else if ((operation === "complete" || operation === "skip") && step) input = { action: operation, id: sequence.id, stepId: step.id, body: { notes } };
      else if (operation === "pause" || operation === "resume" || operation === "cancel") input = { action: operation, id: sequence.id, body: { notes, ...(operation === "pause" ? { reason: "manual" as const } : {}) } };
      else return;
      const saved = await write.mutateAsync(input);
      setSelectedId(saved.id); setOperation(null); toast.success("Sequence updated");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not update sequence"); }
  }
  return <Card><CardHeader><CardTitle className="text-base">4-Touch Follow-Up Sequence</CardTitle><p className="text-sm text-muted-foreground">{lead ? `Follow-ups for ${lead.full_name}. Dates are shown in your local time.` : "Select a recipient below or in Deal Flow to view their follow-ups."}</p></CardHeader><CardContent className="space-y-4">
    {!lead && <div className="grid gap-3 sm:grid-cols-4">{[{ channel: "LinkedIn", day: 0 }, { channel: "Email", day: 3 }, { channel: "Email", day: 7 }, { channel: "Phone/Email", day: 14 }].map((touch, index) => <div key={touch.day} className="flex flex-col items-center gap-2 rounded-lg border bg-muted/20 p-4 text-center"><Badge variant="secondary" className="flex h-7 w-7 items-center justify-center rounded-full p-0">{index + 1}</Badge><p className="text-sm font-semibold">{touch.channel}</p><p className="text-xs text-muted-foreground">Day {touch.day}</p><Badge variant="outline">Select recipient</Badge></div>)}</div>}
    {lead && <><QueryStatus query={list} />{list.isSuccess && <>
      {list.data.sequences.length > 0 && <SelectField label="Sequence history" value={sequenceId} onChange={setSelectedId} options={list.data.sequences.map(item => ({ value: item.id, label: `${localDate(item.start_at)} — ${labels[item.status]}` }))} />}
      <PaginationControls page={page} pages={list.data.pagination.pages} busy={list.isFetching} onChange={value => { setPage(value); setSelectedId(""); }} />
      {!list.data.sequences.length && <p className="text-sm text-muted-foreground">No follow-up sequences for this lead.</p>}
      {admin && page === 1 && !closedLead && !list.data.sequences.some(item => item.status === "active" || item.status === "paused") && <Button onClick={() => open("start")}>Set up sequence</Button>}
    </>}{!admin && <p className="text-xs text-muted-foreground">Only admins can start or change sequences.</p>}
    {sequenceId && <QueryStatus query={detail} />}
    {sequence && <><div className="flex flex-wrap items-center gap-2"><Badge>{labels[sequence.status]}</Badge>{sequence.pause_reason && <span className="text-xs text-muted-foreground">Reason: {sequence.pause_reason.split("_").join(" ")}</span>}{admin && live && <>
      {sequence.status === "active" && <Button size="sm" variant="outline" onClick={() => open("pause")}>Pause</Button>}
      {sequence.status === "paused" && <Button size="sm" variant="outline" disabled={!!closedLead} onClick={() => open("resume")}>Resume</Button>}
      <Button size="sm" variant="outline" onClick={() => open("cancel")}>Cancel sequence</Button>
    </>}</div>{sequence.status === "paused" && <p className="text-sm text-muted-foreground">Future sends are paused. Step dates are retained.</p>}
    {sequence.notes && <p className="whitespace-pre-wrap break-words text-sm">Notes: {sequence.notes}</p>}<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[...sequence.steps].sort((a, b) => a.position - b.position).map(item => {
      const unfinished = item.status === "pending" || item.status === "scheduled" || item.status === "failed";
      const actionable = admin && live && unfinished && !item.lease_token;
      return <div key={item.id} className="min-w-0 space-y-3 rounded-lg border p-4"><div className="flex items-center justify-between gap-2"><h3 className="text-sm font-semibold">{item.position}. {channels[item.channel]}</h3><Badge variant={item.status === "failed" ? "destructive" : "secondary"}>{labels[item.status]}</Badge></div><p className="text-xs text-muted-foreground">Due {localDate(item.due_at)}</p>{item.subject && <p className="break-words text-sm font-medium">{item.subject}</p>}<details><summary className="cursor-pointer text-xs text-primary">View message</summary><p className="mt-2 whitespace-pre-wrap break-words text-xs">{item.channel === "email" ? emailHtmlToText(item.message) : item.message}</p></details>
        {item.channel !== "email" && <Button size="sm" variant="outline" onClick={async () => { try { await navigator.clipboard.writeText(item.message); toast.success("Message copied"); } catch { toast.error("Could not copy message"); } }}>Copy message</Button>}
        {item.completed_at && <p className="text-xs">{labels[item.status]} {localDate(item.completed_at)}</p>}{item.notes && <p className="whitespace-pre-wrap break-words text-xs">Notes: {item.notes}</p>}{item.last_error && <p className="break-words text-xs text-destructive">{item.last_error}</p>}{item.next_attempt_at && <p className="text-xs">Next attempt: {localDate(item.next_attempt_at)}</p>}
        {item.sent_email && <details><summary className="cursor-pointer text-xs text-primary">Sent email: {item.sent_email.status}</summary><div className="mt-2 space-y-1 break-words text-xs"><p>{item.sent_email.recipient}</p><p>{item.sent_email.subject}</p>{(["sent_at", "delivered_at", "opened_at", "clicked_at", "bounced_at"] as const).map(key => item.sent_email?.[key] && <p key={key}>{key.replace("_at", "").split("_").join(" ")}: {localDate(item.sent_email[key]!)}</p>)}</div></details>}
        {actionable && <div className="flex flex-wrap gap-2">{item.attempt_count === 0 && <Button size="sm" variant="outline" onClick={() => open("edit", item)}>Edit step {item.position}</Button>}{item.channel !== "email" && <Button size="sm" variant="outline" onClick={() => open("complete", item)}>Complete step {item.position}</Button>}<Button size="sm" variant="ghost" onClick={() => open("skip", item)}>Skip step {item.position}</Button></div>}{item.channel === "email" && item.attempt_count > 0 && <p className="text-xs text-muted-foreground">Attempted emails cannot be edited or rescheduled.</p>}
      </div>;
    })}</div></>}
    </>}
    <Dialog open={!!operation} onOpenChange={value => { if (!value && !write.isPending) setOperation(null); }}><DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl"><DialogHeader><DialogTitle>{operation ? titles[operation] : "Sequence"}</DialogTitle><DialogDescription>{operation === "start" ? "Review all four messages before scheduling. LinkedIn and phone activities remain manual; email steps send automatically when due. Manual completion does not delay later emails." : operation === "resume" ? "Original due dates are retained. Overdue emails may send immediately after you resume." : operation === "pause" || operation === "cancel" ? "This stops future sends. An email already being dispatched may still send." : "Update this follow-up activity."}</DialogDescription></DialogHeader>
      <OutreachForm className="space-y-4" onSubmit={event => { event.preventDefault(); return submit(); }}><fieldset disabled={write.isPending} className="space-y-4">
        {(operation === "start" || operation === "edit") && <><OutreachField name="time" label={operation === "start" ? "Start time (optional, local time)" : "Due time (local time)"} dateTime required={operation === "edit"} value={time} disabled={write.isPending} onChange={setTime} />{drafts.map((draft, index) => <div key={index} className="space-y-2 rounded-lg border p-3"><h3 className="text-sm font-medium">{operation === "start" ? `Day ${[0, 3, 7, 14][index]} — ${channels[draft.channel]}` : channels[draft.channel]}</h3>{operation === "start" && index === 3 && <OutreachField name={`channel-${index}`} label="Final channel" value={draft.channel} disabled={write.isPending} onChange={value => setDrafts(current => current.map((item, position) => position === index ? { ...item, channel: value as "phone" | "email", subject: item.subject || "Next steps for {{project}}" } : item))} options={[{ value: "phone", label: "Phone" }, { value: "email", label: "Email" }]} />}{draft.channel === "email" && <OutreachField name={`subject-${index}`} label={`Step ${operation === "edit" ? step?.position : index + 1} subject`} required maxLength={998} value={draft.subject ?? ""} onChange={value => setDrafts(current => current.map((item, position) => position === index ? { ...item, subject: value } : item))} />}<OutreachField name={`message-${index}`} label={`Step ${operation === "edit" ? step?.position : index + 1} message`} multiline required maxLength={100000} value={draft.message} onChange={value => setDrafts(current => current.map((item, position) => position === index ? { ...item, message: value } : item))} /></div>)}</>}
        {operation !== "start" && operation !== "edit" && <OutreachField name="notes" label="Notes (optional)" multiline maxLength={10000} value={notes} onChange={setNotes} />}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}<div className="flex gap-2"><Button type="submit" disabled={!admin || ((operation === "start" || operation === "edit") && drafts.some(draft => !draft.message.trim() || (draft.channel === "email" && !draft.subject?.trim())))}>{write.isPending ? "Saving…" : operation === "start" ? "Start sequence" : "Confirm"}</Button><Button type="button" variant="outline" onClick={() => setOperation(null)}>Back</Button></div>
      </fieldset></OutreachForm>
    </DialogContent></Dialog>
  </CardContent></Card>;
}
