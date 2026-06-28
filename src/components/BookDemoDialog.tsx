import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
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
import { useDemoDialogStore } from "@/stores/demoDialogStore";

const categories = ["Construction", "Architecture", "Urban Development", "Infrastructure"];

const BookDemoDialog = () => {
  const { open, setOpen } = useDemoDialogStore();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    phone: "",
    category: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setTimeout(() => {
        setSubmitted(false);
        setForm({ name: "", email: "", company: "", role: "", phone: "", category: "" });
      }, 200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[95vw] max-w-xl bg-background max-h-[90vh] overflow-hidden flex flex-col p-8">
        <DialogHeader className="sr-only">
          <DialogTitle>Book a Demo</DialogTitle>
          <DialogDescription>Book a demo with our team.</DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
            <CheckCircle className="w-14 h-14 text-primary mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">You're In!</h3>
            <p className="text-muted-foreground max-w-sm">
              Our team will reach out within 24 hours with a tailored Immersive Property Visualisation strategy for your project.
            </p>
            <Button className="mt-6" onClick={() => handleOpenChange(false)}>Close</Button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-1 hide-scrollbar">
            <form onSubmit={handleSubmit} className="space-y-5 pr-2 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <Label htmlFor="name" className="block text-sm text-muted-foreground text-left px-1">Full Name</Label>
                  <Input id="name" required placeholder="John Smith" value={form.name} onChange={(e) => handleChange("name", e.target.value)} className="border border-input text-left" />
                </div>
                <div className="space-y-1.5 text-left">
                  <Label htmlFor="email" className="block text-sm text-muted-foreground text-left px-1">Work Email</Label>
                  <Input id="email" type="email" required placeholder="john@company.com" value={form.email} onChange={(e) => handleChange("email", e.target.value)} className="border border-input text-left" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <Label htmlFor="company" className="block text-sm text-muted-foreground text-left px-1">Company</Label>
                  <Input id="company" required placeholder="Acme Construction" value={form.company} onChange={(e) => handleChange("company", e.target.value)} className="border border-input text-left" />
                </div>
                <div className="space-y-1.5 text-left">
                  <Label htmlFor="role" className="block text-sm text-muted-foreground text-left px-1">Job Title</Label>
                  <Input id="role" placeholder="VP of Operations" value={form.role} onChange={(e) => handleChange("role", e.target.value)} className="border border-input text-left" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <Label htmlFor="phone" className="block text-sm text-muted-foreground text-left px-1">Phone</Label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} className="border border-input text-left" />
                </div>
                <div className="space-y-1.5 text-left">
                  <Label htmlFor="category" className="block text-sm text-muted-foreground text-left px-1">Industry</Label>
                  <select
                    id="category"
                    required
                    value={form.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground text-left focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ring-offset-background"
                  >
                    <option value="">Select industry</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full gradient-primary text-primary-foreground shadow-glow hover:opacity-90 text-base px-8 py-6 animate-pulse-glow"
              >
                Book a Demo
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
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
