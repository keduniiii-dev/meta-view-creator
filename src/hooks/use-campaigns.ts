import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Campaign, CampaignStats, Pagination } from "@/lib/types";

interface CampaignsListResponse {
  campaigns: Campaign[];
  pagination: Pagination;
}

export function useCampaigns(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["campaigns", page, limit],
    queryFn: () =>
      api.get<CampaignsListResponse>("/api/campaigns", { page, limit }),
  });
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: ["campaigns", id],
    queryFn: () => api.get<{ campaign: Campaign }>(`/api/campaigns/${id}`),
    enabled: !!id,
  });
}

export function useCampaignStats() {
  return useQuery({
    queryKey: ["campaigns", "stats"],
    queryFn: () => api.get<CampaignStats>("/api/campaigns/stats"),
  });
}

export function useCreateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      name: string;
      type: "LinkedIn" | "Email";
      campaign_date: string;
      sent?: number;
      opened?: number;
      clicked?: number;
      status?: "Completed" | "Active";
    }) => api.post<{ campaign: Campaign }>("/api/campaigns", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Campaign created");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create campaign");
    },
  });
}

export function useUpdateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: {
      id: string;
      name?: string;
      type?: "LinkedIn" | "Email";
      sent?: number;
      opened?: number;
      clicked?: number;
      status?: "Completed" | "Active";
      campaign_date?: string;
    }) => api.patch<{ campaign: Campaign }>(`/api/campaigns/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Campaign updated");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update campaign");
    },
  });
}

export function useDeleteCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/campaigns/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Campaign deleted");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete campaign");
    },
  });
}
