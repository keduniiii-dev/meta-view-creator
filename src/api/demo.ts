import { apiRequest } from "./client";

export type DemoPayload = {
  name: string;
  email: string;
  company: string;
  role?: string;
  phone?: string;
  category: string;
  website?: string;
};

export const createDemoRequest = (payload: DemoPayload) =>
  apiRequest<{ message: string; data?: DemoPayload }>('/demo/', {
    method: 'POST',
    body: payload,
  });
