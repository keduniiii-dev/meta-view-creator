import { api } from "@/lib/api";

export interface DemoRequest {
  fullName: string;
  workEmail: string;
  company: string;
  role: string;
  phone: string;
  category: string;
}

export const demoService = {
  submitRequest: (data: DemoRequest) =>
    api.post<{ success: boolean }>("/demo", data),
};
