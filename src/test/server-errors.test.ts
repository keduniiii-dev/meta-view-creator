import { describe, expect, it } from "vitest";
import { ApiError } from "@/lib/api";
import { applyServerErrors, isValidationError, resolveServerErrors, serverFields, serverMessage } from "@/lib/server-errors";

describe("server validation errors", () => {
  it("attaches field messages next to the inputs that are on screen", () => {
    const error = new ApiError("Please review the highlighted fields.", 400, [
      { path: "email", message: "Enter a valid work email" },
      { path: "company", message: "Company is required" },
      { path: "website", message: "Unknown field error" },
      { path: 12 as unknown as string, message: "Malformed" },
    ], "VALIDATION_ERROR");

    const resolved = resolveServerErrors(error, ["name", "email", "company", "role", "phone", "category"]);

    expect(isValidationError(error)).toBe(true);
    expect(resolved.fieldErrors).toEqual({
      email: "Enter a valid work email",
      company: "Company is required",
    });
    // The website field cannot be attached, so the top-level message surfaces in the banner.
    expect(resolved.bannerMessage).toBe("Please review the highlighted fields.");
    expect(serverFields(error)).toEqual([
      { path: "email", message: "Enter a valid work email" },
      { path: "company", message: "Company is required" },
      { path: "website", message: "Unknown field error" },
    ]);
  });

  it("omits the banner when every reported field is on screen", () => {
    const error = { status: 400, error: "VALIDATION_ERROR", message: "Fix the fields", fields: [{ path: "email", message: "Taken" }] };
    const resolved = resolveServerErrors(error, ["email"]);
    expect(resolved.fieldErrors).toEqual({ email: "Taken" });
    expect(resolved.bannerMessage).toBeNull();
  });

  it("falls back to the top-level message when the response has no fields", () => {
    const error = { status: 400, error: "VALIDATION_ERROR", message: "Nothing matched." };
    expect(resolveServerErrors(error, ["email"])).toEqual({ fieldErrors: {}, bannerMessage: "Nothing matched." });
  });

  it("treats non-validation failures as banner-only with their top-level message", () => {
    const error = new ApiError("Internal server error", 500);
    expect(resolveServerErrors(error, ["email"])).toEqual({ fieldErrors: {}, bannerMessage: "Internal server error" });
  });

  it("only renders structured messages, never raw backend internals", () => {
    const error = new ApiError("Validation failed", 400, [{ path: "email", message: "Email is invalid" }], "VALIDATION_ERROR");
    expect(error.message).toBe("Validation failed");
    expect(error.message).not.toContain("Email is invalid");
    expect(serverMessage(error)).toBe("Validation failed");
  });

  it("returns a safe generic message for non-message errors and no-op for no error", () => {
    expect(resolveServerErrors(null, ["email"])).toEqual({ fieldErrors: {}, bannerMessage: null });
    expect(serverMessage("nope")).toBe("Something went wrong. Please try again.");
    expect(isValidationError(new Error("boom"))).toBe(false);
  });

  it("applies matched fields through setError", () => {
    const error = { status: 400, error: "VALIDATION_ERROR", message: "Review", fields: [{ path: "name", message: "Need a name" }] };
    const calls: Array<[string, { message: string }]> = [];
    const resolved = applyServerErrors(
      (name, options) => calls.push([name, { message: options.message }]),
      error,
      ["name", "email"],
    );
    expect(calls).toEqual([["name", { message: "Need a name" }]]);
    expect(resolved.bannerMessage).toBeNull();
  });
});