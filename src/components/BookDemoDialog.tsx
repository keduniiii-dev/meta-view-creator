import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle, AlertCircle, Loader2, Send } from "lucide-react";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDemoDialogStore } from "@/stores/demoDialogStore";
import { useSubmitDemo } from "@/hooks/use-demo";
import { useIndustries } from "@/hooks/use-industries";
import { resolveServerErrors } from "@/lib/server-errors";
import { cn } from "@/lib/utils";
import { ServerErrorBanner } from "@/crm/components/ServerErrorBanner";

const fallbackCategories = [
  "Construction",
  "Architecture",
  "Urban Development",
  "Infrastructure",
];

// Field paths the backend reports in VALIDATION_ERROR fields[] (see
// twinblueprint-server createDemoRequestSchema).
const demoFields = ["fullName", "workEmail", "company", "jobTitle", "phone", "industry"] as const;

type FormState = {
  name: string;
  email: string;
  company: string;
  role: string;
  phone: string;
  category: string;
  website: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  company: "",
  role: "",
  phone: "",
  category: "",
  website: "",
};

const BookDemoDialog = () => {
  const { open, setOpen } = useDemoDialogStore();
  const submitDemo = useSubmitDemo();
  const { data: industriesData } = useIndustries();
  const categories = industriesData?.industries ?? fallbackCategories;
  const [submitted, setSubmitted] = useState(false);
  const [serverBanner, setServerBanner] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState | "captcha", string>>
  >({});
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [openedAt] = useState(() => Date.now());
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const demoSchema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(2, "Please enter your full name").max(100),
        email: z.string().trim().email("Enter a valid work email").max(255),
        company: z.string().trim().max(120).optional().or(z.literal("")),
        role: z.string().trim().max(120).optional().or(z.literal("")),
        phone: z
          .string()
          .trim()
          .max(30)
          .regex(/^[+\d][\d\s()\-]{6,}$/i, "Enter a valid phone number")
          .optional()
          .or(z.literal("")),
        category: z.string().trim().max(120).optional().or(z.literal("")),
        website: z.string().max(0, "Spam detected").optional().or(z.literal("")),
      }),
    [categories],
  );

  const captcha = useMemo(() => {
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 8) + 2;
    return { a, b, answer: a + b };
  }, [open]);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setServerBanner(null);
    if (submitDemo.isError) submitDemo.reset();
  };

  const focusFirstError = (errs: Partial<Record<string, string>>) => {
    const firstKey = Object.keys(errs).find((k) => errs[k]);
    if (!firstKey) return;
    const el = document.getElementById(
      firstKey === "captcha" ? "captcha" : firstKey,
    ) as HTMLElement | null;
    el?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (Date.now() - openedAt < 1500) {
      const errs = {
        captcha: "Please take a moment to complete the form.",
      };
      setErrors(errs);
      requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }

    if (Number(captchaAnswer) !== captcha.answer) {
      const errs = {
        captcha: "Incorrect answer to the verification question.",
      };
      setErrors(errs);
      requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }

    const result = demoSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormState, string>> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof FormState | undefined;
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      requestAnimationFrame(() => {
        errorSummaryRef.current?.focus();
        focusFirstError(fieldErrors);
      });
      return;
    }

    setErrors({});

    submitDemo.mutate(
{
        fullName: form.name,
        workEmail: form.email,
        ...(form.company ? { company: form.company } : {}),
        jobTitle: form.role || undefined,
        phone: form.phone || undefined,
        ...(form.category ? { industry: form.category } : {}),
        confirmationEmail: true,
      },
      {
        onSuccess: () => setSubmitted(true),
        onError: (error: unknown) => {
          const resolved = resolveServerErrors(error, demoFields);
          setErrors((prev) => ({ ...prev, ...resolved.fieldErrors }) as typeof prev);
          setServerBanner(resolved.bannerMessage);
          if (resolved.bannerMessage) {
            requestAnimationFrame(() => errorSummaryRef.current?.focus());
          }
        },
      },
    );
  };

  useEffect(() => {
    if (submitted) {
      requestAnimationFrame(() => successRef.current?.focus());
    }
  }, [submitted]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setTimeout(() => {
        setSubmitted(false);
        setForm(initialForm);
        setErrors({});
        setServerBanner(null);
        setCaptchaAnswer("");
        submitDemo.reset();
      }, 200);
    }
  };

  const fieldError = (key: keyof FormState) => errors[key];
  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl border-0 bg-transparent p-0 shadow-none max-h-[90dvh] flex flex-col sm:p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Book a Demo</DialogTitle>
          <DialogDescription>Book a demo with our team.</DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div
            ref={successRef}
            tabIndex={-1}
            role="status"
            aria-live="polite"
            className="flex-1 flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 text-center shadow-elevated focus:outline-none"
          >
            <CheckCircle
              className="w-14 h-14 text-primary mb-4"
              aria-hidden="true"
            />
            <h3 className="text-2xl font-bold text-foreground mb-2">
              You're In!
            </h3>
<p className="text-muted-foreground max-w-sm">
              Thanks for booking! Check your email for your confirmation and
              personalised lead report.
            </p>
            <Button className="mt-6" onClick={() => handleOpenChange(false)}>
              Close
            </Button>
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar">
            <form
              onSubmit={handleSubmit}
              className="w-full rounded-2xl border border-border bg-card p-4 text-left shadow-elevated sm:p-9"
              noValidate
              aria-describedby={
                hasErrors
                  ? "form-error-summary"
                  : undefined
              }
            >
              <ServerErrorBanner message={serverBanner} />
              {hasErrors && (
                <div
                  ref={errorSummaryRef}
                  id="form-error-summary"
                  tabIndex={-1}
                  role="alert"
                  aria-live="assertive"
                  className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 focus:outline-none focus:ring-2 focus:ring-destructive"
                >
                  <p className="flex items-center gap-2 text-sm font-semibold text-destructive mb-2">
                    <AlertCircle className="w-4 h-4" aria-hidden="true" />
                    Please fix the following before submitting:
                  </p>
                  <ul className="list-disc list-inside text-xs text-destructive space-y-1">
                    {Object.entries(errors)
                      .filter(([, v]) => v)
                      .map(([k, v]) => (
                        <li key={k}>
                          <a
                            href={`#${k === "captcha" ? "captcha" : k}`}
                            className="underline-offset-2 hover:underline"
                          >
                            {v}
                          </a>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              <div className="hidden" aria-hidden="true">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                />
              </div>

              <div
                className={cn(
                  "grid grid-cols-1 gap-4 sm:grid-cols-2",
                  (serverBanner || hasErrors) && "mt-6",
                )}
              >
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs text-muted-foreground">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    aria-invalid={!!fieldError("name")}
                    aria-describedby={
                      fieldError("name") ? "name-error" : undefined
                    }
                    className={fieldError("name") ? "border-destructive" : ""}
                  />
                  {fieldError("name") && (
                    <p
                      id="name-error"
                      className="text-xs text-destructive flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {fieldError("name")}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs text-muted-foreground">
                    Work Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    aria-invalid={!!fieldError("email")}
                    aria-describedby={
                      fieldError("email") ? "email-error" : undefined
                    }
                    className={fieldError("email") ? "border-destructive" : ""}
                  />
                  {fieldError("email") && (
                    <p
                      id="email-error"
                      className="text-xs text-destructive flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {fieldError("email")}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="company" className="text-xs text-muted-foreground">
                    Company
                  </Label>
                  <Input
                    id="company"
                    autoComplete="organization"
                    value={form.company}
                    onChange={(e) => handleChange("company", e.target.value)}
                    aria-invalid={!!fieldError("company")}
                    aria-describedby={
                      fieldError("company") ? "company-error" : undefined
                    }
                    className={fieldError("company") ? "border-destructive" : ""}
                  />
                  {fieldError("company") && (
                    <p
                      id="company-error"
                      className="text-xs text-destructive flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {fieldError("company")}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="role" className="text-xs text-muted-foreground">
                    Job Title
                  </Label>
                  <Input
                    id="role"
                    autoComplete="organization-title"
                    value={form.role}
                    onChange={(e) => handleChange("role", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs text-muted-foreground">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    aria-invalid={!!fieldError("phone")}
                    aria-describedby={
                      fieldError("phone") ? "phone-error" : undefined
                    }
                    className={fieldError("phone") ? "border-destructive" : ""}
                  />
                  {fieldError("phone") && (
                    <p
                      id="phone-error"
                      className="text-xs text-destructive flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {fieldError("phone")}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="category" className="text-xs text-muted-foreground">
                    Industry
                  </Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) => handleChange("category", v)}
                  >
                    <SelectTrigger
                      id="category"
                      aria-invalid={!!fieldError("category")}
                      aria-describedby={
                        fieldError("category") ? "category-error" : undefined
                      }
                      className={
                        fieldError("category") ? "border-destructive" : ""
                      }
                    >
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldError("category") && (
                    <p
                      id="category-error"
                      className="text-xs text-destructive flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {fieldError("category")}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="captcha" className="text-xs text-muted-foreground">
                    Verification: what is {captcha.a} + {captcha.b}?{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="captcha"
                    type="number"
                    required
                    inputMode="numeric"
                    autoComplete="off"
                    value={captchaAnswer}
                    onChange={(e) => {
                      setCaptchaAnswer(e.target.value);
                      setErrors((prev) => ({ ...prev, captcha: undefined }));
                    }}
                    aria-invalid={!!errors.captcha}
                    aria-describedby={
                      errors.captcha ? "captcha-error" : undefined
                    }
                    className={errors.captcha ? "border-destructive" : ""}
                  />
                  {errors.captcha && (
                    <p
                      id="captcha-error"
                      className="text-xs text-destructive flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors.captcha}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={submitDemo.isPending}
                className="mt-6 h-auto min-h-11 w-full whitespace-normal px-3"
              >
                {submitDemo.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Book a Demo
                  </>
                )}
              </Button>
              <p className="mt-3 text-center text-[10px] text-muted-foreground">
                We respect your privacy. Your details are only used to schedule
                your demo.
              </p>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookDemoDialog;
