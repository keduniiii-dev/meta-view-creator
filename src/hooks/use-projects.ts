import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { isValidationError } from "@/lib/server-errors";
import type { Project, Pagination } from "@/lib/types";

interface ProjectsListResponse {
  projects: Project[];
  pagination: Pagination;
}

export function useProjects(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["projects", page, limit],
    queryFn: () =>
      api.get<ProjectsListResponse>("/projects", { page, limit }),
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: () => api.get<{ project: Project }>(`/projects/${id}`),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      project: string;
      client: string;
      start_date: string;
      end_date: string;
      status?: string;
      phase?: Project["phase"];
      value?: number | null;
      currency?: string | null;
      progress?: number;
      suppliers?: string[];
      uses_3d?: boolean;
      competitor?: string;
      issue?: string;
    }) => api.post<{ project: Project }>("/projects", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["pipeline"] });
      toast.success("Project created");
    },
    onError: (err: Error) => {
      if (!isValidationError(err)) toast.error(err.message || "Failed to create project");
    },
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: {
      id: string;
      project?: string;
      client?: string;
      start_date?: string;
      end_date?: string;
      status?: string;
      phase?: Project["phase"];
      value?: number | null;
      currency?: string | null;
      progress?: number;
      suppliers?: string[];
      uses_3d?: boolean;
      competitor?: string;
      issue?: string;
    }) => api.patch<{ project: Project }>(`/projects/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["pipeline"] });
      toast.success("Project updated");
    },
    onError: (err: Error) => {
      if (!isValidationError(err)) toast.error(err.message || "Failed to update project");
    },
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/projects/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["pipeline"] });
      toast.success("Project deleted");
    },
    onError: (err: Error) => {
      if (!isValidationError(err)) toast.error(err.message || "Failed to delete project");
    },
  });
}

function invalidateProjectSupplierData(qc: ReturnType<typeof useQueryClient>, projectId: string) {
  return Promise.all([
    qc.invalidateQueries({ queryKey: ["projects"] }),
    qc.invalidateQueries({ queryKey: ["suppliers"] }),
    qc.invalidateQueries({ queryKey: ["pipeline"] }),
    qc.invalidateQueries({ queryKey: ["projects", projectId] }),
  ]);
}

export function useLinkProjectSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, supplierId }: { projectId: string; supplierId: string }) => api.put(`/projects/${projectId}/suppliers/${supplierId}`),
    onSuccess: (_, variables) => { invalidateProjectSupplierData(qc, variables.projectId); toast.success("Supplier linked to project"); },
    onError: (error: Error) => { if (!isValidationError(error)) toast.error(error.message || "Could not link supplier to project"); },
  });
}

export function useUnlinkProjectSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, supplierId }: { projectId: string; supplierId: string }) => api.delete(`/projects/${projectId}/suppliers/${supplierId}`),
    onSuccess: (_, variables) => { invalidateProjectSupplierData(qc, variables.projectId); toast.success("Supplier unlinked from project"); },
    onError: (error: Error) => { if (!isValidationError(error)) toast.error(error.message || "Could not unlink supplier from project"); },
  });
}
