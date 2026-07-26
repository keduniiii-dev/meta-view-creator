export type ApiRequestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  credentials?: RequestCredentials;
  signal?: AbortSignal;
};

export { apiRequest, getApiBaseUrl } from "@/api/client";
