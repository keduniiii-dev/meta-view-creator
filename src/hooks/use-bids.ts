import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { isValidationError } from "@/lib/server-errors";
import type { Bid, Pagination } from "@/lib/types";

interface BidsListResponse {
  bids: Bid[];
  pagination: Pagination;
}

export function useBids(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["bids", page, limit],
    queryFn: () =>
      api.get<BidsListResponse>("/bids", { page, limit }),
  });
}

export function useBid(id: string) {
  return useQuery({
    queryKey: ["bids", id],
    queryFn: () => api.get<{ bid: Bid }>(`/bids/${id}`),
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
      value?: number | null;
      lead_id?: string | null;
      status?: string;
    }) => api.post<{ bid: Bid }>("/bids", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bids"] });
      qc.invalidateQueries({ queryKey: ["pipeline"] });
      toast.success("Bid created");
    },
    onError: (err: Error) => {
      if (!isValidationError(err)) toast.error(err.message || "Failed to create bid");
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
      value?: number | null;
      lead_id?: string | null;
      status?: string;
    }) => api.patch<{ bid: Bid }>(`/bids/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bids"] });
      qc.invalidateQueries({ queryKey: ["pipeline"] });
      toast.success("Bid updated");
    },
    onError: (err: Error) => {
      if (!isValidationError(err)) toast.error(err.message || "Failed to update bid");
    },
  });
}

export function useDeleteBid() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/bids/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bids"] });
      qc.invalidateQueries({ queryKey: ["pipeline"] });
      toast.success("Bid deleted");
    },
    onError: (err: Error) => {
      if (!isValidationError(err)) toast.error(err.message || "Failed to delete bid");
    },
  });
}
