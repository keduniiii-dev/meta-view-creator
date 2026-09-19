import type { ServerValidationField } from "./api";

export interface ResolvedServerErrors {
  fieldErrors: Record<string, string>;
  bannerMessage: string | null;
}

interface ServerErrorLike {
  message?: unknown;
  status?: unknown;
  error?: unknown;
  fields?: unknown;
}

// Structural check on purpose: the Vitest test suites mock "@/lib/api" without
// exporting ApiError, so instanceof is unusable at runtime in tests.
function asServerError(error: unknown): ServerErrorLike | null {
  if (!error || typeof error !== "object") return null;
  return error as ServerErrorLike;
}

function toMessage(value: unknown): string {
  return typeof value === "string" && value ? value : "Something went wrong. Please try again.";
}

export function isValidationError(error: unknown): boolean {
  const candidate = asServerError(error);
  return candidate?.status === 400 && candidate.error === "VALIDATION_ERROR";
}

export function serverMessage(error: unknown): string {
  return toMessage(asServerError(error)?.message);
}

export function serverFields(error: unknown): ServerValidationField[] {
  const candidate = asServerError(error);
  if (!Array.isArray(candidate?.fields)) return [];
  return candidate.fields.filter((field): field is ServerValidationField =>
    !!field && typeof field === "object" &&
    typeof (field as ServerValidationField).path === "string" &&
    typeof (field as ServerValidationField).message === "string");
}

// Attach VALIDATION_ERROR field messages to the inputs that are on screen.
// When any field cannot be attached (or the response carried no fields), hand
// the caller the top-level message to render in a generic error banner.
export function resolveServerErrors(error: unknown, visibleFields: readonly string[]): ResolvedServerErrors {
  if (!error) return { fieldErrors: {}, bannerMessage: null };
  const fieldErrors: Record<string, string> = {};
  let needsBanner = true;
  if (isValidationError(error)) {
    const fields = serverFields(error);
    const attached = new Set<string>();
    for (const field of fields) {
      if (visibleFields.includes(field.path) && !fieldErrors[field.path]) {
        fieldErrors[field.path] = field.message;
        attached.add(field.path);
      }
    }
    needsBanner = fields.length === 0 || fields.some(field => !attached.has(field.path));
  }
  return { fieldErrors, bannerMessage: needsBanner ? serverMessage(error) : null };
}

type RHFSetError = (name: string, options: { type: string; message: string }) => void;

export function applyServerErrors(
  setError: RHFSetError,
  error: unknown,
  visibleFields: readonly string[],
): ResolvedServerErrors {
  const resolved = resolveServerErrors(error, visibleFields);
  for (const [name, message] of Object.entries(resolved.fieldErrors)) {
    setError(name, { type: "server", message });
  }
  return resolved;
}