import { apiRequest } from "./client";

export type Project = {
  id?: number;
  name: string;
  client: string;
  status?: string;
  progress?: number;
  deadline?: string;
};

export const getProjects = () => apiRequest<Project[]>('/project/');

export const getProjectById = (id: number | string) => apiRequest<Project>(`/project/${id}`);

export const createProject = (payload: Project) => apiRequest<Project>('/project/', { method: 'POST', body: payload });

export const updateProject = (id: number | string, payload: Partial<Project>) => apiRequest<Project>(`/project/${id}`, { method: 'PATCH', body: payload });

export const deleteProject = (id: number | string) => apiRequest<void>(`/project/${id}`, { method: 'DELETE' });
