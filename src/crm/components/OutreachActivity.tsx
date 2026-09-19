import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/lib/api";
import { useActivityWrite, useMeetings, useReplies, type ActivityWrite, type Meeting, type MeetingStatus } from "@/hooks/use-outreach-activity";
import type { Lead } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OutreachForm, OutreachField } from "./OutreachForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PaginationControls, QueryStatus } from "./QueryStatus";

const localInput = (value: string) => { const date = new Date(value); return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16); };
const displayTime = (value: string) => new Date(value).toLocaleString();
const statusLabels = { booked: "Booked", completed: "Completed", cancelled: "Cancelled", no_show: "No-show" };
interface Draft { kind: "reply" | "meeting" | "update"; id: string; time: string; originalTime: string; scheduled: string; originalScheduled?: string; channel: "linkedin" | "email" | "phone"; notes: string; outcome: string; status: MeetingStatus; snapshot?: ActivityWrite }
export default function OutreachActivity({ lead }: { lead: Lead }) {
  const { user } = useAuth();
  const admin = user?.role === "admin";
  const [replyPage, setReplyPage] = useState(1);
  const [meetingPage, setMeetingPage] = useState(1);
  const replies = useReplies(lead.id, replyPage);
  const meetings = useMeetings(lead.id, meetingPage);
  const write = useActivityWrite();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  function begin(kind: Draft["kind"], meeting?: Meeting) {
    if (draft?.snapshot) { setOpen(true); return; }
    setError(""); write.reset(); setOpen(true);
    const now = new Date().toISOString();
    setDraft({ kind, id: meeting?.id ?? crypto.randomUUID(), time: localInput(now), originalTime: now, scheduled: meeting ? localInput(meeting.scheduled_at) : "", originalScheduled: meeting?.scheduled_at, channel: "email", notes: meeting?.notes ?? "", outcome: meeting?.outcome ?? "", status: meeting?.status ?? "booked" });
  }
  function change(patch: Partial<Draft>) { setDraft(current => current ? { ...current, ...patch } : current); }
  async function submit() {
    if (!admin || !draft || write.isPending) return;
    setError("");
    try {
      let input = draft.snapshot;
      if (!input) {
        const time = new Date(draft.time === localInput(draft.originalTime) ? draft.originalTime : draft.time);
        if (draft.kind !== "update" && (!Number.isFinite(time.getTime()) || time.getTime() > Date.now())) throw new Error("Reply and booking times cannot be in the future.");
        input = draft.kind === "reply" ? { kind: "reply", body: { id: draft.id, lead_id: lead.id, channel: draft.channel, replied_at: time.toISOString(), notes: draft.notes } }
          : draft.kind === "meeting" ? { kind: "meeting", body: { id: draft.id, lead_id: lead.id, booked_at: time.toISOString(), scheduled_at: new Date(draft.scheduled).toISOString(), notes: draft.notes } }
          : { kind: "update", id: draft.id, body: { ...(draft.originalScheduled && localInput(draft.originalScheduled) === draft.scheduled ? {} : { scheduled_at: new Date(draft.scheduled).toISOString() }), status: draft.status, notes: draft.notes || null, outcome: draft.outcome || null } };
        // Freeze the exact body as well as the UUID: an uncertain response must be retried identically.
        setDraft(current => current ? { ...current, snapshot: input } : current);
      }
      await write.mutateAsync(input);
      setDraft(null); setOpen(false); toast.success("Activity saved");
    } catch (cause) {
      if (cause instanceof ApiError && [400, 404, 409].includes(cause.status)) setDraft(current => current ? { ...current, snapshot: undefined } : current);
      setError(cause instanceof Error ? cause.message : "Could not save activity");
    }
  }
  return <Card><CardHeader><CardTitle className="text-base">Replies & Meetings</CardTitle><p className="text-sm text-muted-foreground">Recorded activity for {lead.full_name}. Times are shown in your local time.</p></CardHeader><CardContent className="space-y-5">
    {admin ? <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => begin("reply")}>Record reply</Button><Button variant="outline" onClick={() => begin("meeting")}>Record meeting</Button>{draft?.snapshot && <Button variant="outline" onClick={() => setOpen(true)}>Resume unsaved activity</Button>}</div> : <p className="text-xs text-muted-foreground">Only admins can record or update activity.</p>}
    <div className="grid gap-6 lg:grid-cols-2"><section aria-label="Recorded replies" className="space-y-3"><h3 className="text-sm font-semibold">Recorded replies</h3><QueryStatus query={replies} />{replies.isError && <p className="text-xs text-destructive">{replies.error.message}</p>}{replies.data?.replies.map(reply => <div key={reply.id} className="space-y-2 rounded-lg border p-3 text-sm"><p className="capitalize">{reply.channel} · {displayTime(reply.replied_at)}</p>{reply.notes && <p className="whitespace-pre-wrap break-words text-muted-foreground">{reply.notes}</p>}</div>)}{replies.isSuccess && !replies.data.replies.length && <p className="text-sm text-muted-foreground">No replies recorded.</p>}<PaginationControls page={replyPage} pages={replies.data?.pagination.pages ?? 0} onChange={setReplyPage} busy={replies.isFetching} /></section>
      <section aria-label="Recorded meetings" className="space-y-3"><h3 className="text-sm font-semibold">Meetings</h3><QueryStatus query={meetings} />{meetings.isError && <p className="text-xs text-destructive">{meetings.error.message}</p>}{meetings.data?.meetings.map(meeting => <div key={meeting.id} className="space-y-2 rounded-lg border p-3 text-sm"><Badge variant="secondary">{statusLabels[meeting.status]}</Badge><p>Scheduled: {displayTime(meeting.scheduled_at)}</p><p className="text-xs text-muted-foreground">Originally booked: {displayTime(meeting.booked_at)}</p>{meeting.notes && <p className="whitespace-pre-wrap break-words">{meeting.notes}</p>}{meeting.outcome && <p className="whitespace-pre-wrap break-words">Outcome: {meeting.outcome}</p>}{admin && <Button size="sm" variant="outline" aria-label={`Update meeting ${displayTime(meeting.scheduled_at)}`} onClick={() => begin("update", meeting)}>Reschedule / update outcome</Button>}</div>)}{meetings.isSuccess && !meetings.data.meetings.length && <p className="text-sm text-muted-foreground">No meetings recorded.</p>}<PaginationControls page={meetingPage} pages={meetings.data?.pagination.pages ?? 0} onChange={setMeetingPage} busy={meetings.isFetching} /></section></div>
    <Dialog open={open} onOpenChange={value => { if (!write.isPending) setOpen(value); }}><DialogContent><DialogHeader><DialogTitle>{draft?.kind === "reply" ? "Record reply" : draft?.kind === "meeting" ? "Record meeting" : "Update meeting"}</DialogTitle><DialogDescription>{draft?.kind === "reply" ? "Save a received reply. The applicable active sequence pauses automatically; historical replies may not pause a newer sequence." : "Save the meeting details. Rescheduling preserves the original booking and meeting ID."}</DialogDescription></DialogHeader>
      {draft && <OutreachForm className="space-y-4" onSubmit={event => { event.preventDefault(); return submit(); }}><fieldset disabled={write.isPending || !!draft.snapshot} className="space-y-4">
        {draft.kind === "reply" && <OutreachField name="channel" label="Reply channel" value={draft.channel} disabled={write.isPending || !!draft.snapshot} onChange={value => change({ channel: value as Draft["channel"] })} options={[{ value: "email", label: "Email" }, { value: "linkedin", label: "LinkedIn" }, { value: "phone", label: "Phone" }]} />}
        {draft.kind !== "update" && <OutreachField name="time" label={`${draft.kind === "reply" ? "Reply time" : "Booking time"} (local time)`} dateTime required value={draft.time} disabled={write.isPending || !!draft.snapshot} onChange={value => change({ time: value })} />}
        {draft.kind !== "reply" && <OutreachField name="scheduled" label="Scheduled time (local time)" dateTime required value={draft.scheduled} disabled={write.isPending || !!draft.snapshot} onChange={value => change({ scheduled: value })} />}
        {draft.kind === "update" && <><OutreachField name="status" label="Meeting status" value={draft.status} disabled={write.isPending || !!draft.snapshot} onChange={value => change({ status: value as MeetingStatus })} options={Object.entries(statusLabels).map(([value, label]) => ({ value, label }))} /><OutreachField name="outcome" label="Outcome" multiline maxLength={10000} value={draft.outcome} onChange={value => change({ outcome: value })} /></>}
        <OutreachField name="notes" label="Activity notes" multiline maxLength={10000} value={draft.notes} onChange={value => change({ notes: value })} />
      </fieldset>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}{draft.snapshot && !write.isPending && <p className="text-xs text-muted-foreground">Retry uses the same activity ID and details to avoid duplicates.</p>}<div className="flex gap-2"><Button type="submit" disabled={!admin || write.isPending}>{write.isPending ? "Saving…" : draft.snapshot ? "Retry save" : "Save activity"}</Button><Button type="button" variant="outline" disabled={write.isPending} onClick={() => setOpen(false)}>Close</Button></div></OutreachForm>}
    </DialogContent></Dialog>
  </CardContent></Card>;
}
