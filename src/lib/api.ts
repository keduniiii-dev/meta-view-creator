import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";
import type { ApiResponse } from "./types";

const API_BASE = "";

function getToken(): string | null {
  return localStorage.getItem("crm_token");
}

export function setToken(token: string) {
  localStorage.setItem("crm_token", token);
}

export function clearToken() {
  localStorage.removeItem("crm_token");
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const client = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (err: AxiosError<ApiResponse<unknown>>) => {
    const status = err.response?.status ?? 500;
    if (status === 401) {
      clearToken();
      toast.error("Session expired. Please sign in again.");
      window.location.href = "/crm/login";
    }
    const message =
      err.response?.data?.message || `Request failed with status ${status}`;
    return Promise.reject(new ApiError(message, status));
  },
);

async function request<T>(
  path: string,
  config: InternalAxiosRequestConfig = {},
): Promise<T> {
  const res = await client.request<ApiResponse<T>>({
    url: path,
    ...config,
  });
  const body = res.data;
  if (!body.success) {
    throw new ApiError(
      body.message || "Request failed",
      res.status,
    );
  }
  return body.data;
}

export const api = {
  get: <T>(path: string, params?: Record<string, unknown>) =>
    request<T>(path, { method: "GET", params }),

  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "POST", data }),

  patch: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "PATCH", data }),

  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
