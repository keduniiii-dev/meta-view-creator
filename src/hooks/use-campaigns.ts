import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { isValidationError } from "@/lib/server-errors";
import type { Campaign, CampaignStats, Pagination } from "@/lib/types";
import { crmStore } from "@/crm/lib/store";
import { fallback } from "@/crm/lib/fallback";

interface CampaignsListResponse {
  campaigns: Campaign[];
  pagination: Pagination;
}

export function useCampaigns(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["campaigns", page, limit],
    queryFn: () =>
      fallback(
        () => api.get<CampaignsListResponse>("/campaigns", { page, limit }),
        () => crmStore.listCampaigns(page, limit),
      ),
  });
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: ["campaigns", id],
    queryFn: () =>
      fallback(
        () => api.get<{ campaign: Campaign }>(`/campaigns/${id}`),
        () => {
          const campaign = crmStore.campaign(id);
          if (!campaign) throw new Error("Campaign not found");
          return { campaign };
        },
      ),
    enabled: !!id,
  });
}

export function useCampaignStats() {
  return useQuery({
    queryKey: ["campaigns", "stats"],
    queryFn: () => fallback(() => api.get<CampaignStats>("/campaigns/stats"), () => crmStore.campaignStats()),
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
    }) => fallback(
      () => api.post<{ campaign: Campaign }>("/campaigns", data),
      () => ({ campaign: crmStore.createCampaign({ name: data.name, type: data.type, campaign_date: data.campaign_date, status: data.status ?? "Active", sent: data.sent ?? 0, opened: data.opened ?? 0, clicked: data.clicked ?? 0 }) }),
    ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["campaigns"] });
      qc.invalidateQueries({ queryKey: ["analytics"] });
      toast.success("Campaign created");
    },
    onError: (err: Error) => {
      if (!isValidationError(err)) toast.error(err.message || "Failed to create campaign");
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
    }) => fallback(
      () => api.patch<{ campaign: Campaign }>(`/campaigns/${id}`, data),
      () => ({ campaign: crmStore.updateCampaign(id, data) }),
    ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["campaigns"] });
      qc.invalidateQueries({ queryKey: ["analytics"] });
      toast.success("Campaign updated");
    },
    onError: (err: Error) => {
      if (!isValidationError(err)) toast.error(err.message || "Failed to update campaign");
    },
  });
}

export function useDeleteCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fallback(
      () => api.delete<void>(`/campaigns/${id}`),
      () => { crmStore.deleteCampaign(id); return undefined as void; },
    ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["campaigns"] });
      qc.invalidateQueries({ queryKey: ["analytics"] });
      toast.success("Campaign deleted");
    },
    onError: (err: Error) => {
      if (!isValidationError(err)) toast.error(err.message || "Failed to delete campaign");
    },
  });
}
