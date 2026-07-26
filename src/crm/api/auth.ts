import { apiRequest } from "./client";

export type AuthUser = {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
};

export type LoginPayload = {
  username: string;
  password: string;
};

const isDemoLogin = (payload: LoginPayload) => payload.username === 'admin' && payload.password === 'password123';

export const login = async (payload: LoginPayload) => {
  try {
    return await apiRequest<{ user?: AuthUser; message?: string }>("/auth/login", {
      method: "POST",
      body: payload,
    });
  } catch (error) {
    if (isDemoLogin(payload)) {
      return {
        user: {
          id: 1,
          name: "Admin",
          email: `${payload.username}@twinblueprints.com`,
          role: "admin",
        },
        message: "Signed in locally for demo purposes.",
      };
    }

    if (error instanceof Error && error.message.includes("404")) {
      throw new Error(
        "CRM auth endpoint not found. Configure /auth/login in your backend, or use the demo credentials: admin / password123."
      );
    }

    throw error;
  }
};

export const getCurrentUser = () => apiRequest<AuthUser>("/auth/me");

export const logout = () => apiRequest<{ message?: string }>("/auth/logout", { method: "POST" });
