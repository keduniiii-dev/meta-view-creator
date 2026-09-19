import { AlertCircle } from "lucide-react";

export function ServerErrorBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div role="alert" aria-live="assertive" className="flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}

export function ServerFieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" aria-live="polite" className="text-xs text-destructive">
      {message}
    </p>
  );
}