import { apiRequest } from "./client";

export type Campaign = {
  id?: number;
  name: string;
  status?: string;
  budget?: string;
  startDate?: string;
  endDate?: string;
};

export type CampaignStats = {
  totalCampaigns: number;
  activeCampaigns: number;
  budget: string;
};

export const getCampaignStats = () => apiRequest<CampaignStats>('/campaign/stats');

export const getCampaigns = () => apiRequest<Campaign[]>('/campaign/');

export const getCampaignById = (id: number | string) => apiRequest<Campaign>(`/campaign/${id}`);

export const createCampaign = (payload: Campaign) => apiRequest<Campaign>('/campaign/', { method: 'POST', body: payload });

export const updateCampaign = (id: number | string, payload: Partial<Campaign>) => apiRequest<Campaign>(`/campaign/${id}`, { method: 'PATCH', body: payload });

export const deleteCampaign = (id: number | string) => apiRequest<void>(`/campaign/${id}`, { method: 'DELETE' });
