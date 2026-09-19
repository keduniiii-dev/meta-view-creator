import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { isValidationError } from "@/lib/server-errors";
import type { Lead, Pagination } from "@/lib/types";

export type LeadInput = Partial<Omit<Lead, "id" | "created_at" | "updated_at">> & { full_name: string; email: string; send_confirmation_email?: boolean };
type LeadsResponse = { leads: Lead[]; pagination: Pagination };
const reply = (error: Error) => { if (!isValidationError(error)) toast.error(error.message); };

export function useLeads(page = 1, limit = 20, filters: Record<string, unknown> = {}) {
  return useQuery({ queryKey: ["leads", page, limit, filters], queryFn: () => api.get<LeadsResponse>("/leads", { page, limit, ...filters }) });
}
export function useLead(id: string) { return useQuery({ queryKey: ["leads", id], queryFn: () => api.get<{ lead: Lead }>(`/leads/${id}`), enabled: Boolean(id) }); }
const refresh = (qc: ReturnType<typeof useQueryClient>) => qc.invalidateQueries({ queryKey: ["leads"] });
export function useCreateLead() { const qc = useQueryClient(); return useMutation({ mutationFn: (data: LeadInput) => api.post<{ lead: Lead }>("/leads", data), onSuccess: () => { refresh(qc); qc.invalidateQueries({ queryKey: ["analytics"] }); toast.success("Lead created successfully"); }, onError: (error: Error) => reply(error) }); }
export function useUpdateLead() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, ...data }: Partial<LeadInput> & { id: string }) => api.patch<{ lead: Lead }>(`/leads/${id}`, data), onSuccess: async () => { await Promise.all([refresh(qc), qc.invalidateQueries({ queryKey: ["pipeline"] }), qc.invalidateQueries({ queryKey: ["analytics"] })]); toast.success("Lead updated"); }, onError: (error: Error) => reply(error) }); }
export function useDeleteLead() { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => api.delete<void>(`/leads/${id}`), onSuccess: () => { refresh(qc); toast.success("Lead deleted"); }, onError: (error: Error) => reply(error) }); }
export function useArchiveLead() { const update = useUpdateLead(); return { ...update, mutate: (id: string) => update.mutate({ id, archived: true }) }; }
export function useAssignLead() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, assigned_to }: { id: string; assigned_to: string }) => api.patch<{ lead: Lead }>(`/leads/${id}/assign`, { assigned_to }), onSuccess: () => { refresh(qc); toast.success("Lead assigned"); }, onError: (error: Error) => reply(error) }); }
export function useImportLeads() { const qc = useQueryClient(); return useMutation({ mutationFn: (file: File) => { const data = new FormData(); data.append("file", file); return api.upload<{ created: number; skipped: number; failed: number }>("/leads/import", data); }, onSuccess: async (result) => { await Promise.all([refresh(qc), qc.invalidateQueries({ queryKey: ["analytics"] })]); const summary = `${result.created} created, ${result.skipped} skipped, ${result.failed} failed`; if (result.failed || result.skipped) toast.warning(summary, { duration: 10000 }); else toast.success(summary); }, onError: (error: Error) => reply(error) }); }
export function useMoveLeadToPipeline() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, ...data }: { id: string; project: string; client: string; phase: "RFP Review" | "Technical Eval" | "Shortlist"; deadline: string; value?: number }) => api.post<{ lead: Lead }>(`/leads/${id}/move-to-pipeline`, data), onSuccess: () => { refresh(qc); qc.invalidateQueries({ queryKey: ["pipeline"] }); qc.invalidateQueries({ queryKey: ["bids"] }); toast.success("Lead moved to pipeline"); }, onError: (error: Error) => reply(error) }); }

export function useLeadOptions() {
  return useQuery({ queryKey: ["leads", "options"], queryFn: () => api.get<{ industries: string[]; regions: string[]; countries: string[]; project_sizes: string[]; phases: string[]; statuses: Lead["status"][]; lead_statuses: string[]; temperatures: string[] }>("/leads/options") });
}