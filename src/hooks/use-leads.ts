import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Lead, Pagination } from "@/lib/types";

interface LeadsListResponse {
  leads: Lead[];
  pagination: Pagination;
}

export function useLeads(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["leads", page, limit],
    queryFn: () =>
      api.get<LeadsListResponse>("/api/leads", { page, limit }),
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: ["leads", id],
    queryFn: () => api.get<{ lead: Lead }>(`/api/leads/${id}`),
    enabled: !!id,
  });
}

export function useCreateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      full_name: string;
      email: string;
      company?: string;
      job_title?: string;
      phone?: string;
      category?: string;
      applications?: number;
      score?: number;
    }) => api.post<{ lead: Lead }>("/api/leads", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead created successfully");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create lead");
    },
  });
}

export function useUpdateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: {
      id: string;
      full_name?: string;
      email?: string;
      company?: string;
      job_title?: string;
      phone?: string;
      category?: string;
      applications?: number;
      score?: number;
      status?: string;
    }) => api.patch<{ lead: Lead }>(`/api/leads/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead updated");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update lead");
    },
  });
}

export function useDeleteLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/leads/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead deleted");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete lead");
    },
  });
}

export function useAssignLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, assigned_to }: { id: string; assigned_to: string }) =>
      api.patch(`/api/leads/${id}/assign`, { assigned_to }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead assigned");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to assign lead");
    },
  });
}
