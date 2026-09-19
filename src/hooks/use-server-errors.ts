import { useMemo, useState } from "react";
import { resolveServerErrors } from "@/lib/server-errors";

// Keeps a server validation error around so forms can render the message next
// to the input that matched its path (plus a banner fallback when unmatched).
export function useServerErrors(fields: readonly string[]) {
  const [error, setError] = useState<unknown>(null);
  const resolved = useMemo(() => resolveServerErrors(error, fields), [error, fields]);
  return {
    fieldErrors: resolved.fieldErrors,
    bannerMessage: resolved.bannerMessage,
    capture: (err: unknown) => setError(err),
    clear: () => setError(null),
  };
}