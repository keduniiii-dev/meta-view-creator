import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { isValidationError } from "@/lib/server-errors";
import type { PipelineApiResponse } from "@/lib/pipeline";

export function usePipeline() {
  return useQuery<PipelineApiResponse>({
    queryKey: ["pipeline"],
    queryFn: () => api.get<PipelineApiResponse>("/pipeline"),
  });
}

export function useSubmitDemo() {
  return useMutation({
mutationFn: (data: {
      fullName: string;
      workEmail: string;
      company?: string;
      jobTitle?: string;
      phone?: string;
      industry?: string;
      confirmationEmail?: boolean;
    }) => api.postCreated("/demo", data),
    onError: (err: Error) => {
      if (err instanceof ApiError) {
        if (err.status === 429) {
          toast.error("Too many requests. Please try again later.");
          return;
        }
        if (isValidationError(err)) return;
        toast.error(err.message || "Submission failed. Please try again.");
        return;
      }
      toast.error(err.message || "Submission failed. Please try again.");
    },
  });
}
