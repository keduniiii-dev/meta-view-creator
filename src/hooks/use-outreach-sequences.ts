import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Pagination } from "@/lib/types";
import type { OutreachMessage } from "./use-outreach";

export type SequenceStatus = "active" | "paused" | "cancelled" | "completed";
export type StepStatus = "pending" | "scheduled" | "sent" | "completed" | "failed" | "skipped";
export interface SequenceDraftStep { channel: "linkedin" | "email" | "phone"; subject?: string; message: string }
export interface SequenceStep extends SequenceDraftStep {
  id: string; position: number; due_at: string; status: StepStatus; subject?: string;
  completed_at: string | null; notes: string | null; attempt_count: number;
  lease_token: string | null; next_attempt_at: string | null; last_error: string | null;
  sent_email: OutreachMessage | null;
}
export interface SequenceSummary { id: string; lead_id: string; status: SequenceStatus; start_at: string; created_at: string; pause_reason?: string | null; notes?: string | null }
export interface OutreachSequence extends SequenceSummary { steps: SequenceStep[] }
const root = "/outreach/sequences";
export function useSequences(leadId: string, page: number) {
  return useQuery({ queryKey: ["outreach", "sequences", "list", leadId, page], enabled: !!leadId,
    queryFn: () => api.get<{ sequences: SequenceSummary[]; pagination: Pagination }>(root, { lead_id: leadId, page, limit: 20 }), refetchInterval: 15000 });
}
export function useSequence(id: string) {
  return useQuery({ queryKey: ["outreach", "sequences", "detail", id], enabled: !!id,
    queryFn: () => api.get<OutreachSequence>(`${root}/${id}`), refetchInterval: 15000 });
}
export type SequenceWrite =
  | { action: "start"; body: { lead_id: string; start_at?: string; steps: SequenceDraftStep[] } }
  | { action: "edit" | "complete" | "skip"; id: string; stepId: string; body: { due_at?: string; subject?: string; message?: string; notes?: string } }
  | { action: "pause" | "resume" | "cancel"; id: string; body: { reason?: "manual" | "reply" | "deal_outcome"; notes?: string } };
export function useSequenceWrite() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (input: SequenceWrite) => {
    if (input.action === "start") return api.post<OutreachSequence>(root, input.body);
    if (input.action === "edit") return api.patch<OutreachSequence>(`${root}/${input.id}/steps/${input.stepId}`, input.body);
    const path = "stepId" in input ? `${root}/${input.id}/steps/${input.stepId}/${input.action}` : `${root}/${input.id}/${input.action}`;
    return api.post<OutreachSequence>(path, input.body);
  }, onSuccess: async sequence => {
    qc.setQueryData(["outreach", "sequences", "detail", sequence.id], sequence);
    await Promise.all(["outreach", "campaigns", "analytics"].map(key => qc.invalidateQueries({ queryKey: [key] })));
  }, onError: () => { void qc.invalidateQueries({ queryKey: ["outreach", "sequences"] }); } });
}
