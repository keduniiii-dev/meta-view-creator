import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { IndustriesResponse } from "@/lib/types";

export function useIndustries() {
  return useQuery({
    queryKey: ["industries"],
    queryFn: () => api.get<IndustriesResponse>("/api/industries"),
    staleTime: 5 * 60 * 1000,
  });
}
