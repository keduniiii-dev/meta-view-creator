import { apiRequest } from "./client";

export type Industry = {
  id?: number;
  name: string;
  slug?: string;
  active?: boolean;
};

export const getIndustries = () => apiRequest<Industry[]>('/industries');

export const getIndustryById = (id: number | string) => apiRequest<Industry>(`/industries/${id}`);

export const createIndustry = (payload: Industry) =>
  apiRequest<Industry>('/industries', {
    method: 'POST',
    body: payload,
  });

export const updateIndustry = (id: number | string, payload: Partial<Industry>) =>
  apiRequest<Industry>(`/industries/${id}`, {
    method: 'PATCH',
    body: payload,
  });

export const deleteIndustry = (id: number | string) =>
  apiRequest<void>(`/industries/${id}`, { method: 'DELETE' });
