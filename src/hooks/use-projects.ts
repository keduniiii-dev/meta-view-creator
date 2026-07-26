import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Project, Pagination } from "@/lib/types";

interface ProjectsListResponse {
  projects: Project[];
  pagination: Pagination;
}

export function useProjects(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["projects", page, limit],
    queryFn: () =>
      api.get<ProjectsListResponse>("/api/projects", { page, limit }),
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: () => api.get<{ project: Project }>(`/api/projects/${id}`),
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
      progress?: number;
      suppliers?: string[];
      uses_3d?: boolean;
      competitor?: string;
      issue?: string;
    }) => api.post<{ project: Project }>("/api/projects", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create project");
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
      progress?: number;
      suppliers?: string[];
      uses_3d?: boolean;
      competitor?: string;
      issue?: string;
    }) => api.patch<{ project: Project }>(`/api/projects/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project updated");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update project");
    },
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/projects/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete project");
    },
  });
}
