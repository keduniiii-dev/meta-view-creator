import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
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

const fallbackCategories = [
  "Construction",
  "Architecture",
  "Urban Development",
  "Infrastructure",
];

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
        company: z.string().trim().min(2, "Company is required").max(120),
        role: z.string().trim().max(120).optional().or(z.literal("")),
        phone: z
          .string()
          .trim()
          .max(30)
          .regex(/^[+\d][\d\s()\-]{6,}$/i, "Enter a valid phone number")
          .optional()
          .or(z.literal("")),
        category: z.enum(categories as [string, ...string[]], {
          errorMap: () => ({ message: "Select an industry" }),
        }),
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
        company: form.company,
        jobTitle: form.role || undefined,
        phone: form.phone || undefined,
        category: form.category,
      },
      {
        onSuccess: () => setSubmitted(true),
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
        setCaptchaAnswer("");
        submitDemo.reset();
      }, 200);
    }
  };

  const fieldError = (key: keyof FormState) => errors[key];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[95vw] max-w-xl bg-background max-h-[90vh] overflow-hidden flex flex-col p-8">
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
            className="flex-1 flex flex-col items-center justify-center text-center py-10 focus:outline-none"
          >
            <CheckCircle
              className="w-14 h-14 text-primary mb-4"
              aria-hidden="true"
            />
            <h3 className="text-2xl font-bold text-foreground mb-2">
              You're In!
            </h3>
            <p className="text-muted-foreground max-w-sm">
              Our team will reach out within 24 hours with a tailored Immersive
              Property Visualisation strategy for your project.
            </p>
            <Button className="mt-6" onClick={() => handleOpenChange(false)}>
              Close
            </Button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-1 hide-scrollbar">
            <form
              onSubmit={handleSubmit}
              className="space-y-5 pr-2 text-left"
              noValidate
              aria-describedby={
                Object.values(errors).some(Boolean)
                  ? "form-error-summary"
                  : undefined
              }
            >
              {Object.values(errors).some(Boolean) && (
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="name"
                    className="block text-sm text-muted-foreground px-1"
                  >
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    required
                    autoComplete="name"
                    placeholder="John Smith"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    aria-invalid={!!fieldError("name")}
                    aria-describedby={
                      fieldError("name") ? "name-error" : undefined
                    }
                    className={
                      fieldError("name")
                        ? "border-destructive"
                        : "border-input"
                    }
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
                  <Label
                    htmlFor="email"
                    className="block text-sm text-muted-foreground px-1"
                  >
                    Work Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="john@company.com"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    aria-invalid={!!fieldError("email")}
                    aria-describedby={
                      fieldError("email") ? "email-error" : undefined
                    }
                    className={
                      fieldError("email")
                        ? "border-destructive"
                        : "border-input"
                    }
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="company"
                    className="block text-sm text-muted-foreground px-1"
                  >
                    Company <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="company"
                    required
                    autoComplete="organization"
                    placeholder="Acme Construction"
                    value={form.company}
                    onChange={(e) => handleChange("company", e.target.value)}
                    aria-invalid={!!fieldError("company")}
                    aria-describedby={
                      fieldError("company") ? "company-error" : undefined
                    }
                    className={
                      fieldError("company")
                        ? "border-destructive"
                        : "border-input"
                    }
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
                  <Label
                    htmlFor="role"
                    className="block text-sm text-muted-foreground px-1"
                  >
                    Job Title
                  </Label>
                  <Input
                    id="role"
                    autoComplete="organization-title"
                    placeholder="VP of Operations"
                    value={form.role}
                    onChange={(e) => handleChange("role", e.target.value)}
                    className="border-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="phone"
                    className="block text-sm text-muted-foreground px-1"
                  >
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+1 (555) 000-0000"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    aria-invalid={!!fieldError("phone")}
                    aria-describedby={
                      fieldError("phone") ? "phone-error" : undefined
                    }
                    className={
                      fieldError("phone")
                        ? "border-destructive"
                        : "border-input"
                    }
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
                  <Label
                    htmlFor="category"
                    className="block text-sm text-muted-foreground px-1"
                  >
                    Industry <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    required
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
                        fieldError("category")
                          ? "border-destructive"
                          : "border-input"
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
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="captcha"
                  className="block text-sm text-muted-foreground px-1"
                >
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
                  className={
                    errors.captcha ? "border-destructive" : "border-input"
                  }
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

              <Button
                type="submit"
                size="lg"
                disabled={submitDemo.isPending}
                className="w-full gradient-primary text-primary-foreground shadow-glow hover:opacity-90 text-base px-8 py-6 animate-pulse-glow"
              >
                {submitDemo.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Book a Demo
                    <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
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
