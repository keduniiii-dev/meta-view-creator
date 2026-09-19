import { useState } from "react";
import { Mail, Eye, MousePointer2, BarChart3, CalendarCheck } from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa";
import { useCampaignStats } from "@/hooks/use-campaigns";
import { useOutreachStats, type OutreachPeriod } from "@/hooks/use-outreach-activity";
import { MetricCard } from "./CrmPageUi";
import { QueryStatus } from "./QueryStatus";
import { OutreachForm, OutreachField } from "./OutreachForm";
import { Button } from "@/components/ui/button";

const localInput = (value: string) => { const date = new Date(value); return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16); };
export default function OutreachMetrics() {
  const email = useCampaignStats();
  const [initialPeriod] = useState(() => { const end = new Date(); return { start: new Date(end.getTime() - 30 * 86400000).toISOString(), end: end.toISOString() }; });
  const [period, setPeriod] = useState<OutreachPeriod>();
  const [start, setStart] = useState(localInput(initialPeriod.start));
  const [end, setEnd] = useState(localInput(initialPeriod.end));
  const [error, setError] = useState("");
  const stats = useOutreachStats(period);
  const metric = (value: number | null | undefined, percent = false) => value == null ? "Unavailable" : `${value.toLocaleString()}${percent ? "%" : ""}`;
  return <section aria-label="Outreach statistics" className="space-y-4">
    <OutreachForm className="flex flex-wrap items-end gap-3" onSubmit={event => { event.preventDefault(); const from = new Date(start); const to = new Date(end); if (!Number.isFinite(from.getTime()) || !Number.isFinite(to.getTime()) || from >= to) { setError("Choose an end time after the start time."); return; } setError(""); setPeriod({ start: from.toISOString(), end: to.toISOString() }); }}>
      <OutreachField name="start" label="Activity period start (local time)" dateTime required value={start} onChange={setStart} />
      <OutreachField name="end" label="Activity period end (exclusive, local time)" dateTime required value={end} onChange={setEnd} />
      <Button type="submit" variant="outline">Apply period</Button>
      <Button type="button" variant="ghost" onClick={() => { const now = new Date(); setStart(localInput(new Date(now.getTime() - 30 * 86400000).toISOString())); setEnd(localInput(now.toISOString())); setPeriod(undefined); setError(""); }}>Last 30 days</Button>
    </OutreachForm>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <QueryStatus query={email} /><QueryStatus query={stats} />
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      <MetricCard compact icon={Mail} label="Emails Sent" value={email.data ? email.data.total_sent.toLocaleString() : "Unavailable"} detail="All time" />
      <MetricCard compact icon={Eye} label="Open Rate" value={email.data ? `${email.data.total_sent ? (email.data.total_opens / email.data.total_sent * 100).toFixed(1) : "0"}%` : "Unavailable"} detail="All time" />
      <MetricCard compact icon={MousePointer2} label="Click Rate" value={email.data ? `${email.data.avg_ctr}%` : "Unavailable"} detail="All time" />
      <MetricCard compact icon={FaLinkedinIn} label="LinkedIn Sent" value={metric(stats.data?.linkedin_sent)} detail="Completed sequence steps" />
      <MetricCard compact icon={BarChart3} label="Response Rate" value={metric(stats.data?.response_rate, true)} detail={stats.data?.response_rate_numerator != null && stats.data?.response_rate_denominator != null ? `${stats.data.response_rate_numerator} of ${stats.data.response_rate_denominator} contacted leads replied` : "Recorded replies"} />
      <MetricCard compact icon={CalendarCheck} label="Meetings Booked" value={metric(stats.data?.meetings_booked)} detail="Includes later cancellations" />
    </div>
    {stats.data?.period && <p className="text-xs text-muted-foreground">LinkedIn, replies, and meetings: {new Date(stats.data.period.start).toLocaleString()} to {new Date(stats.data.period.end).toLocaleString()} (end excluded). Email metrics are all time.</p>}
    {stats.data?.unavailable_reason && <p className="text-xs text-muted-foreground">{stats.data.unavailable_reason}</p>}
  </section>;
}
