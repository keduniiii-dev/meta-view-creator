import axios, { type AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";
import type { ApiResponse } from "./types";
import { crmPath } from "./crm-base";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

function getToken(): string | null {
  return localStorage.getItem("crm_token");
}

export function setToken(token: string) {
  localStorage.setItem("crm_token", token);
}

export function clearToken() {
  localStorage.removeItem("crm_token");
}

export interface ServerValidationField {
  path: string;
  message: string;
}

export class ApiError extends Error {
  status: number;
  constructor(
    message: string,
    status: number,
    public fields: ServerValidationField[] = [],
    public error?: string,
    public unreachable = false,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.unreachable = unreachable;
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
  async (err: AxiosError<ApiResponse<unknown> | Blob>) => {
    const status = err.response?.status ?? 500;
    const unreachable = !err.response;
    const url = err.config?.url || "";
    if (status === 401 && !url.includes("/auth")) {
      clearToken();
      if (window.location.pathname !== crmPath("/login")) {
        sessionStorage.setItem("session-expired", "1");
        window.location.href = crmPath("/login");
      }
    }
    let body = err.response?.data;
    if (body instanceof Blob) {
      try { body = JSON.parse(await body.text()); } catch { body = undefined; }
    }
    const data = body && !(body instanceof Blob) && typeof body === "object" ? body as unknown as Record<string, unknown> : undefined;
    const message = (typeof data?.message === "string" && data.message)
      || (err.response ? `Request failed with status ${status}` : "Unable to reach the server. Check your connection and try again.");
    const fields = Array.isArray(data?.fields)
      ? data.fields.filter((field): field is ServerValidationField =>
          !!field && typeof field === "object" && typeof (field as ServerValidationField).path === "string" && typeof (field as ServerValidationField).message === "string")
      : [];
    const code = typeof data?.error === "string" ? data.error : undefined;
    return Promise.reject(new ApiError(message, status, fields, code, unreachable));
  },
);

async function request<T>(
  path: string,
  config: AxiosRequestConfig = {},
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

  postCreated: async <T>(path: string, data?: unknown): Promise<T> => {
    const res = await client.request<ApiResponse<T>>({
      url: path,
      method: "POST",
      data,
    });
    const body = res.data;
    if (res.status !== 201 || !body.success) {
      throw new ApiError(body.message || "Submission failed. Please try again.", res.status);
    }
    return body.data;
  },

  put: <T>(path: string, data?: unknown) => request<T>(path, { method: "PUT", data }),
  patch: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "PATCH", data }),

  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),

  upload: <T>(path: string, data: FormData) =>
    request<T>(path, {
      method: "POST",
      data,
      headers: { "Content-Type": "multipart/form-data" },
    }),

  download: (path: string, params?: Record<string, unknown>) =>
    client.get<Blob>(path, { params, responseType: "blob" }),
};
