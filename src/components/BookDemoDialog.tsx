import { useState } from "react";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDemoDialogStore } from "@/stores/demoDialogStore";
import { demoService } from "@/services/demo";

const categories = ["Construction", "Architecture", "Urban Development", "Infrastructure"];

const BookDemoDialog = () => {
  const { open, setOpen } = useDemoDialogStore();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    workEmail: "",
    company: "",
    role: "",
    phone: "",
    category: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category) {
      setError("Please select an industry");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await demoService.submitRequest(form);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setTimeout(() => {
        setSubmitted(false);
        setForm({ fullName: "", workEmail: "", company: "", role: "", phone: "", category: "" });
      }, 200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[95vw] max-w-xl bg-background max-h-[90vh] overflow-hidden flex flex-col p-8">
        <DialogHeader className="flex-shrink-0 space-y-1">
          <DialogTitle className="text-xl font-bold">Request a demo</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Join 500+ construction firms using Meta-dology 3D to win more contracts.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
            <CheckCircle className="w-14 h-14 text-primary mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">You're In!</h3>
            <p className="text-muted-foreground max-w-sm">
              Our team will reach out within 24 hours with a tailored 3D lead strategy for your business.
            </p>
            <Button className="mt-6" onClick={() => handleOpenChange(false)}>Close</Button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-1 hide-scrollbar">
            <form onSubmit={handleSubmit} className="space-y-5 pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-sm text-muted-foreground">Full Name</Label>
                  <Input id="fullName" required placeholder="John Smith" value={form.fullName} onChange={(e) => handleChange("fullName", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm text-muted-foreground">Work Email</Label>
                  <Input id="workEmail" type="email" required placeholder="john@company.com" value={form.workEmail} onChange={(e) => handleChange("workEmail", e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="company" className="text-sm text-muted-foreground">Company</Label>
                  <Input id="company" required placeholder="Acme Construction" value={form.company} onChange={(e) => handleChange("company", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="role" className="text-sm text-muted-foreground">Job Title</Label>
                  <Input id="role" placeholder="VP of Operations" value={form.role} onChange={(e) => handleChange("role", e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-sm text-muted-foreground">Phone</Label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="category" className="text-sm text-muted-foreground">Industry</Label>
                  <Select value={form.category || undefined} onValueChange={(v) => handleChange("category", v)}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full gradient-primary text-primary-foreground shadow-glow hover:opacity-90 text-base px-8 py-6 animate-pulse-glow disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Start Generating Leads
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
              {error && (
                <p className="text-xs text-center text-red-500">{error}</p>
              )}
              <p className="text-xs text-center text-muted-foreground">
                No credit card required. Get your personalized lead report in 24h.
              </p>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookDemoDialog;
