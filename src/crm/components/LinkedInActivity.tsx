import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

interface LinkedInSend {
  id: string;
  lead_id: string;
  message: string;
  sent_at: string;
}

export default function LinkedInActivity({ leadId, message }: { leadId: string; message: string }) {
  const { user } = useAuth();
  const client = useQueryClient();
  const snapshot = useRef<LinkedInSend | null>(null);
  const saving = useRef(false);
  const [savedSignature, setSavedSignature] = useState("");
  const signature = JSON.stringify([leadId, message]);
  const history = useQuery({
    queryKey: ["outreach", "linkedin-sends", leadId],
    enabled: !!leadId,
    queryFn: async () => {
      const data = await api.get<{ linkedin_sends: LinkedInSend[] }>("/outreach/linkedin-sends", { lead_id: leadId });
      if (!Array.isArray(data?.linkedin_sends)) throw new Error("Unexpected LinkedIn activity response.");
      return data;
    },
  });
  const write = useMutation({
    retry: false,
    mutationFn: (body: LinkedInSend) => api.post("/outreach/linkedin-sends", body),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["outreach"] });
      void client.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
  async function record() {
    if (user?.role !== "admin" || saving.current || (!snapshot.current && (!leadId || !message.trim() || savedSignature === signature))) return;
    saving.current = true;
    try {
      snapshot.current ??= { id: crypto.randomUUID(), lead_id: leadId, message, sent_at: new Date().toISOString() };
      const body = snapshot.current;
      await write.mutateAsync(body);
      setSavedSignature(JSON.stringify([body.lead_id, body.message]));
      snapshot.current = null;
      toast.success("LinkedIn activity saved");
    } catch {
      // Keep the exact UUID and body for explicit retries, including uncertain responses.
    } finally {
      saving.current = false;
    }
  }
  return <section aria-label="LinkedIn activity" className="space-y-3 rounded-lg border p-4">
    <h3 className="text-sm font-semibold">LinkedIn activity</h3>
    <p className="text-sm text-muted-foreground">After sending the previewed message on LinkedIn, mark it as sent here. This records a standalone activity; for a sequence message, complete its LinkedIn step instead.</p>
    {user?.role === "admin" && <Button type="button" onClick={record} disabled={write.isPending || (!snapshot.current && (!leadId || !message.trim() || savedSignature === signature))}>
      {write.isPending ? "Saving..." : snapshot.current ? "Retry save" : savedSignature === signature ? "Activity saved" : "Mark as sent"}
    </Button>}
    {write.isError && <p role="alert" className="text-sm text-destructive">{write.error.message || "Could not save LinkedIn activity."} Retry saves the original recipient, message and time.</p>}
    {snapshot.current && write.isError && <p className="whitespace-pre-wrap text-sm">Unconfirmed activity: {snapshot.current.message}</p>}
    {leadId && <div className="space-y-2">
      <h4 className="text-sm font-medium">Recorded LinkedIn messages</h4>
      {history.isPending && <p className="text-sm">Loading activity...</p>}
      {history.isError && <div role="alert"><p className="text-sm">Could not load LinkedIn activity.</p><Button variant="outline" size="sm" onClick={() => history.refetch()}>Retry history</Button></div>}
      {history.data?.linkedin_sends?.map(item => <div key={item.id} className="rounded border p-3 text-sm"><p>{new Date(item.sent_at).toLocaleString()}</p><p className="whitespace-pre-wrap break-words">{item.message}</p></div>)}
      {history.data?.linkedin_sends?.length === 0 && <p className="text-sm text-muted-foreground">No LinkedIn messages recorded.</p>}
    </div>}
  </section>;
}
