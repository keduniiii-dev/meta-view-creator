import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import type { PipelineResponse } from "@/lib/pipeline";

export function usePipeline() {
  return useQuery<PipelineResponse>({
    queryKey: ["pipeline"],
    queryFn: () => api.get<PipelineResponse>("/api/pipeline"),
  });
}

export function useSubmitDemo() {
  return useMutation({
    mutationFn: (data: {
      fullName: string;
      workEmail: string;
      company: string;
      jobTitle?: string;
      phone?: string;
      category?: string;
    }) => api.post("/api/demo", data),
    onError: (err: Error) => {
      if (err instanceof ApiError && err.status === 429) {
        toast.error("Too many requests. Please try again later.");
      } else {
        toast.error(err.message || "Submission failed. Please try again.");
      }
    },
  });
}
