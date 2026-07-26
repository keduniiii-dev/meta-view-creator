import { apiRequest } from "./client";

export type AuthUser = {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export const login = (payload: LoginPayload) =>
  apiRequest<{ user?: AuthUser; message?: string }>('/api/auth/login', {
    method: 'POST',
    body: payload,
  });

export const getCurrentUser = () => apiRequest<AuthUser>('/auth/me');

export const logout = () => apiRequest<{ message?: string }>('/auth/logout', { method: 'POST' });
