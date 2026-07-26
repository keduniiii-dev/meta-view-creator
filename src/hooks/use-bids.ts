import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Bid, Pagination } from "@/lib/types";

interface BidsListResponse {
  bids: Bid[];
  pagination: Pagination;
}

export function useBids(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["bids", page, limit],
    queryFn: () =>
      api.get<BidsListResponse>("/api/bids", { page, limit }),
  });
}

export function useBid(id: string) {
  return useQuery({
    queryKey: ["bids", id],
    queryFn: () => api.get<{ bid: Bid }>(`/api/bids/${id}`),
    enabled: !!id,
  });
}

export function useCreateBid() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      project: string;
      client: string;
      phase: "RFP Review" | "Technical Eval" | "Shortlist";
      deadline: string;
      suppliers?: string[];
      value?: number;
    }) => api.post<{ bid: Bid }>("/api/bids", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bids"] });
      toast.success("Bid created");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create bid");
    },
  });
}

export function useUpdateBid() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: {
      id: string;
      project?: string;
      client?: string;
      phase?: "RFP Review" | "Technical Eval" | "Shortlist";
      deadline?: string;
      suppliers?: string[];
      value?: number;
    }) => api.patch<{ bid: Bid }>(`/api/bids/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bids"] });
      toast.success("Bid updated");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update bid");
    },
  });
}

export function useDeleteBid() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/bids/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bids"] });
      toast.success("Bid deleted");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete bid");
    },
  });
}
