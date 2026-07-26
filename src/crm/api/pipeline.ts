import { apiRequest } from "./client";

export type PipelineSummary = {
  totalDeals: number;
  stageCounts: Record<string, number>;
  totalValue: string;
};

export const getPipelineData = () => apiRequest<PipelineSummary>('/pipeline/');
