import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { isValidationError } from "@/lib/server-errors";
import type { Supplier, Pagination } from "@/lib/types";

export interface Opportunity {
  id: string;
  supplier_id?: string;
  lead_id?: string | null;
  project_id?: string | null;
  bid_id?: string | null;
  name: string;
  description?: string | null;
  project: string | null;
  value: number | null;
  currency: string | null;
  insight: string | null;
  status: "open" | "qualified" | "won" | "lost";
}

interface OpportunitiesResponse { opportunities: Opportunity[]; pagination: Pagination; }

export function useSuppliers(page = 1) {
  return useQuery({ queryKey: ["suppliers", page], queryFn: () => api.get<{ suppliers: SupplierNetworkProfile[]; pagination: Pagination }>("/suppliers", { page, limit: 20 }) });
}
export function useSaveSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Omit<Supplier, "id"> & { id?: string }) => id ? api.patch<{ supplier: Supplier }>(`/suppliers/${id}`, data) : api.post<{ supplier: Supplier }>("/suppliers", data),
    onSuccess: async (_, variables) => { await Promise.all(["suppliers", "pipeline", "bids"].map(key => qc.invalidateQueries({ queryKey: [key] }))); toast.success(variables.id ? "Supplier updated" : "Supplier created"); },
    onError: (error: Error) => { if (!isValidationError(error)) toast.error(error.message || "Could not save supplier"); },
  });
}
export function useLinkSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ bidId, supplierId }: { bidId: string; supplierId: string }) => api.put(`/bids/${bidId}/suppliers/${supplierId}`),
    onSuccess: async () => { await Promise.all(["suppliers", "pipeline", "bids"].map(key => qc.invalidateQueries({ queryKey: [key] }))); toast.success("Supplier linked to bid"); },
    onError: (error: Error) => { if (!isValidationError(error)) toast.error(error.message || "Could not link supplier to bid"); },
  });
}

const invalidateSupplierData = (qc: ReturnType<typeof useQueryClient>, supplierId?: string) => Promise.all([
  qc.invalidateQueries({ queryKey: ["suppliers"] }),
  qc.invalidateQueries({ queryKey: ["pipeline"] }),
  supplierId ? qc.invalidateQueries({ queryKey: ["opportunities", supplierId] }) : Promise.resolve(),
]);

export function useSupplierOpportunities(supplierId: string | null, page = 1) {
  return useQuery({
    queryKey: ["opportunities", supplierId, page],
    queryFn: () => api.get<OpportunitiesResponse>(`/suppliers/${supplierId}/opportunities`, { page, limit: 20 }),
    enabled: Boolean(supplierId),
  });
}

export type OpportunityInput = Omit<Opportunity, "id" | "project" | "supplier_id"> & { supplier_id: string; project?: string | null };

export function useCreateOpportunity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: OpportunityInput) => api.post<{ opportunity: Opportunity }>("/opportunities", data),
    onSuccess: (_, variables) => { invalidateSupplierData(qc, variables.supplier_id); toast.success("Opportunity created"); },
    onError: (error: Error) => { if (!isValidationError(error)) toast.error(error.message || "Could not create opportunity"); },
  });
}

export function useUpdateOpportunity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, supplier_id: _supplierId, ...data }: Partial<OpportunityInput> & { id: string; supplier_id?: string }) => api.patch<{ opportunity: Opportunity }>(`/opportunities/${id}`, data),
    onSuccess: (_, variables) => { invalidateSupplierData(qc, variables.supplier_id); toast.success("Opportunity updated"); },
    onError: (error: Error) => { if (!isValidationError(error)) toast.error(error.message || "Could not update opportunity"); },
  });
}

export function useDeleteOpportunity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, supplierId }: { id: string; supplierId: string }) => api.delete<void>(`/opportunities/${id}`),
    onSuccess: (_, variables) => { invalidateSupplierData(qc, variables.supplierId); toast.success("Opportunity deleted"); },
    onError: (error: Error) => { if (!isValidationError(error)) toast.error(error.message || "Could not delete opportunity"); },
  });
}

export function useLinkOpportunity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ opportunityId, supplierId }: { opportunityId: string; supplierId: string }) => api.put(`/opportunities/${opportunityId}/suppliers/${supplierId}`),
    onSuccess: (_, variables) => { invalidateSupplierData(qc, variables.supplierId); toast.success("Opportunity linked"); },
    onError: (error: Error) => { if (!isValidationError(error)) toast.error(error.message || "Could not link opportunity"); },
  });
}

export function useUnlinkOpportunity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ opportunityId, supplierId }: { opportunityId: string; supplierId: string }) => api.delete(`/opportunities/${opportunityId}/suppliers/${supplierId}`),
    onSuccess: (_, variables) => { invalidateSupplierData(qc, variables.supplierId); toast.success("Opportunity unlinked"); },
    onError: (error: Error) => { if (!isValidationError(error)) toast.error(error.message || "Could not unlink opportunity"); },
  });
}

// Backend counts use explicitly linked records. Active means Active or In-flight;
// shared-project counts include distinct projects across all statuses.
export interface SupplierNetworkProfile extends Supplier {
  regions?: string[];
  active_project_count: number;
  active_projects: { id: string; name: string; client: string | null; status: string | null; phase: string | null; value: number | null; currency: string | null }[];
  related_suppliers?: { id: string; name: string; role: string | null; shared_project_count: number }[];
  opportunities?: Opportunity[];
}
export function useSupplierProfile(id: string | null) {
  return useQuery({
    queryKey: ["suppliers", "detail", id],
    queryFn: () => api.get<{ supplier: SupplierNetworkProfile }>(`/suppliers/${id}`),
    enabled: !!id,
  });
}