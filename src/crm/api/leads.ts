import { apiRequest } from "./client";

export type Lead = {
  id: number;
  company: string;
  category: string;
  app?: string;
  score?: number;
  status?: string;
  name?: string;
  email?: string;
  role?: string;
  phone?: string;
  createdAt?: string;
};

export type CreateLeadPayload = {
  name: string;
  email: string;
  company: string;
  role?: string;
  phone?: string;
  category: string;
};

export const getLeads = () => apiRequest<Lead[]>('/lead/');

export const getLeadById = (id: number | string) => apiRequest<Lead>(`/lead/${id}`);

export const createLead = (payload: CreateLeadPayload) => apiRequest<Lead>('/lead/', { method: 'POST', body: payload });

export const updateLead = (id: number | string, payload: Partial<CreateLeadPayload>) => apiRequest<Lead>(`/lead/${id}`, { method: 'PATCH', body: payload });

export const deleteLead = (id: number | string) => apiRequest<void>(`/lead/${id}`, { method: 'DELETE' });

export const assignLead = (id: number | string, assigneeId: string | number) => apiRequest<Lead>(`/lead/${id}/assign`, { method: 'PATCH', body: { assigneeId } });
