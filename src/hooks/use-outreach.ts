import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { isValidationError } from "@/lib/server-errors";
import type { Pagination } from "@/lib/types";
import { crmStore } from "@/crm/lib/store";
import { fallback, localPreview } from "@/crm/lib/fallback";

export interface OutreachInput { lead_id: string; subject: string; template: string; }
export interface OutreachPreview { recipient: string; subject: string; html: string; }
export interface OutreachMessage {
  id: string; lead_id: string; campaign_id: string | null; recipient: string;
  subject: string; channel: string; template: string; status: string;
  sent_at: string | null; delivered_at: string | null; opened_at: string | null;
  clicked_at: string | null; bounced_at: string | null;
}
export function useOutreachMessages(page = 1) {
  return useQuery({ queryKey: ["outreach", "messages", page], queryFn: () => fallback(
    () => api.get<{ messages: OutreachMessage[]; total: number; pagination: Pagination }>("/outreach/messages", { page, limit: 20 }),
    () => crmStore.listMessages(page, 20),
  ), refetchInterval: 30000 });
}
export function useOutreachPreview() {
  return useMutation({ mutationFn: (input: OutreachInput) => fallback(() => api.post<OutreachPreview>("/outreach/preview", input), () => localPreview(input)) });
}
export function useSendOutreach() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: OutreachInput & { campaign_id?: string | null }) =>
      api.postCreated<{ message: OutreachMessage }>("/outreach/send", input),
    onSuccess: () => {
      for (const key of ["outreach", "campaigns", "analytics"]) void qc.invalidateQueries({ queryKey: [key] });
      toast.success("Email sent");
    },
    onError: (error: Error) => { if (!isValidationError(error)) toast.error(error.message || "Could not send email"); },
  });
}
