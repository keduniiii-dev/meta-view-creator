import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateLead } from "@/hooks/use-leads";
import { useIndustries } from "@/hooks/use-industries";
import { resolveServerErrors } from "@/lib/server-errors";
import { ServerErrorBanner } from "@/crm/components/ServerErrorBanner";

const fallbackCategories = [
  "Construction",
  "Architecture",
  "Urban Development",
  "Infrastructure",
];

// Field paths the backend reports in VALIDATION_ERROR fields[] (see
// twinblueprint-server createLeadSchema).
const leadFields = ["full_name", "email", "company", "job_title", "phone", "industry"] as const;

const LeadCaptureForm = () => {
  const createLead = useCreateLead();
  const { data: industriesData } = useIndustries();
  const categories = industriesData?.industries ?? fallbackCategories;
  const [submitted, setSubmitted] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [serverBanner, setServerBanner] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    category: "",
    phone: "",
  });

  const update = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setServerErrors((prev) => ({ ...prev, [field]: undefined }));
    setServerBanner(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLead.mutate(
      {
        full_name: form.name,
        email: form.email,
        company: form.company,
        job_title: form.role,
        phone: form.phone,
        industry: form.category,
        send_confirmation_email: true,
      },
      {
        onSuccess: () => setSubmitted(true),
        onError: (error) => {
          const resolved = resolveServerErrors(error, leadFields);
          setServerErrors(resolved.fieldErrors);
          setServerBanner(resolved.bannerMessage);
        },
      },
    );
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-lg mx-auto text-center p-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Lead Captured
          </h3>
<p className="text-muted-foreground">
            The new lead has been added to Leads. A confirmation email is sent
            to <span className="text-foreground">{form.email}</span>.
          </p>
          <Button
            className="mt-6"
            variant="outline"
            onClick={() => {
              setSubmitted(false);
              setForm({
                name: "",
                email: "",
                company: "",
                role: "",
                category: "",
                phone: "",
              });
            }}
          >
            Add another
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <div className="w-full max-w-xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-bold mb-3">
            Capture a <span className="text-primary">New Lead</span>
          </h2>
          <p className="text-muted-foreground">
            Manually add a prospect to the CRM.
          </p>
        </div>

        <Card>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <ServerErrorBanner message={serverBanner} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Full Name
                  </Label>
                  <Input
                    required
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    aria-invalid={!!serverErrors.name}
                    className={"mt-1" + (serverErrors.name ? " border-destructive" : "")}
                    placeholder="John Smith"
                  />
                  {serverErrors.name && (
                    <p role="alert" className="text-xs text-destructive mt-1">
                      {serverErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Work Email
                  </Label>
                  <Input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    aria-invalid={!!serverErrors.email}
                    className={"mt-1" + (serverErrors.email ? " border-destructive" : "")}
                    placeholder="john@company.com"
                  />
                  {serverErrors.email && (
                    <p role="alert" className="text-xs text-destructive mt-1">
                      {serverErrors.email}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Company
                  </Label>
                  <Input
                    required
                    value={form.company}
                    onChange={(e) => update("company", e.target.value)}
                    aria-invalid={!!serverErrors.company}
                    className={"mt-1" + (serverErrors.company ? " border-destructive" : "")}
                    placeholder="Acme Construction"
                  />
                  {serverErrors.company && (
                    <p role="alert" className="text-xs text-destructive mt-1">
                      {serverErrors.company}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Job Title
                  </Label>
                  <Input
                    value={form.role}
                    onChange={(e) => update("role", e.target.value)}
                    aria-invalid={!!serverErrors.role}
                    className={"mt-1" + (serverErrors.role ? " border-destructive" : "")}
                    placeholder="VP of Operations"
                  />
                  {serverErrors.role && (
                    <p role="alert" className="text-xs text-destructive mt-1">
                      {serverErrors.role}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Phone
                  </Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    aria-invalid={!!serverErrors.phone}
                    className={"mt-1" + (serverErrors.phone ? " border-destructive" : "")}
                    placeholder="+1 (555) 000-0000"
                  />
                  {serverErrors.phone && (
                    <p role="alert" className="text-xs text-destructive mt-1">
                      {serverErrors.phone}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Industry
                  </Label>
                  <Select
                    required
                    value={form.category}
                    onValueChange={(v) => update("category", v)}
                  >
                    <SelectTrigger className={"mt-1" + (serverErrors.category ? " border-destructive" : "")}>
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
                  {serverErrors.category && (
                    <p role="alert" className="text-xs text-destructive mt-1">
                      {serverErrors.category}
                    </p>
                  )}
                </div>
              </div>
              <Button
                type="submit"
                className="w-full py-6 text-base"
                disabled={createLead.isPending}
              >
                <Send className="w-4 h-4 mr-2" />
                {createLead.isPending ? "Adding..." : "Add Lead"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeadCaptureForm;
