import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Pagination } from "@/lib/types";

export interface OutreachPeriod { start: string; end: string }
export interface OutreachStats {
  linkedin_sent: number | null; response_rate: number | null; meetings_booked: number | null;
  response_rate_numerator: number | null; response_rate_denominator: number | null;
  availability: { linkedin_sent: boolean; response_rate: boolean; meetings_booked: boolean };
  period: OutreachPeriod & { timezone: string; bounds: string };
  sequence_schema_ready: boolean | null; scheduler_enabled: boolean; unavailable_reason?: string;
}
export interface ReplyInput { id: string; lead_id: string; channel: "linkedin" | "email" | "phone"; replied_at: string; notes?: string }
export interface Reply extends ReplyInput { created_at: string }
export interface MeetingInput { id: string; lead_id: string; booked_at: string; scheduled_at: string; notes?: string }
export type MeetingStatus = "booked" | "completed" | "cancelled" | "no_show";
export interface Meeting extends Omit<MeetingInput, "notes"> { status: MeetingStatus; outcome: string | null; notes: string | null; created_at: string }
export interface MeetingUpdate { scheduled_at?: string; status?: MeetingStatus; outcome?: string | null; notes?: string | null }
export function useOutreachStats(period?: OutreachPeriod) {
  return useQuery({ queryKey: ["outreach", "stats", period], queryFn: () => api.get<OutreachStats>("/outreach/stats", { ...period }), refetchInterval: 15000 });
}
export function useReplies(leadId: string, page: number) {
  return useQuery({ queryKey: ["outreach", "replies", leadId, page], enabled: !!leadId,
    queryFn: () => api.get<{ replies: Reply[]; pagination: Pagination }>("/outreach/replies", { lead_id: leadId, page, limit: 20 }) });
}
export function useMeetings(leadId: string, page: number) {
  return useQuery({ queryKey: ["outreach", "meetings", leadId, page], enabled: !!leadId,
    queryFn: () => api.get<{ meetings: Meeting[]; pagination: Pagination }>("/outreach/meetings", { lead_id: leadId, page, limit: 20 }) });
}
export type ActivityWrite = { kind: "reply"; body: ReplyInput } | { kind: "meeting"; body: MeetingInput } | { kind: "update"; id: string; body: MeetingUpdate };
export function useActivityWrite() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (input: ActivityWrite) => input.kind === "update"
    ? api.patch<Meeting>(`/outreach/meetings/${input.id}`, input.body)
    : api.post<Reply | Meeting>(`/outreach/${input.kind === "reply" ? "replies" : "meetings"}`, input.body),
  onSuccess: async () => { await Promise.all(["outreach", "analytics", "campaigns"].map(key => qc.invalidateQueries({ queryKey: [key] }))); } });
}
