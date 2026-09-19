import { crmStore } from "./store";
import type { OutreachInput, OutreachPreview } from "@/hooks/use-outreach";

// Try the live Express API first. When the server is unreachable or the route is
// not implemented (404/501), serve the request from the client-side store so the
// CRM remains functional without a backend.
export async function fallback<T>(primary: () => Promise<T>, local: () => T): Promise<T> {
  try {
    return await primary();
  } catch (error) {
    if (isFallbackable(error)) return local();
    throw error;
  }
}

function isFallbackable(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const candidate = error as { status?: unknown; unreachable?: unknown };
  if (candidate.unreachable) return true;
  return candidate.status === 404 || candidate.status === 501;
}

export function localPreview(input: OutreachInput): OutreachPreview {
  const lead = crmStore.lead(input.lead_id);
  return { recipient: lead?.email || lead?.full_name || "", subject: input.subject, html: input.template };
}