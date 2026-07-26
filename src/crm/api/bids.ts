import { apiRequest } from "./client";

export type Bid = {
  id?: number;
  project: string;
  client: string;
  phase: string;
  deadline: string;
  suppliers: string[];
  value: string;
};

export const getBids = () => apiRequest<Bid[]>('/bid/');

export const getBidById = (id: number | string) => apiRequest<Bid>(`/bid/${id}`);

export const createBid = (payload: Bid) => apiRequest<Bid>('/bid/', { method: 'POST', body: payload });

export const updateBid = (id: number | string, payload: Partial<Bid>) => apiRequest<Bid>(`/bid/${id}`, { method: 'PATCH', body: payload });

export const deleteBid = (id: number | string) => apiRequest<void>(`/bid/${id}`, { method: 'DELETE' });
