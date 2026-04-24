import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useDemoDialogStore } from "@/stores/demoDialogStore";

const countries = [
  "United Kingdom", "United States", "Australia", "Canada", "Germany",
  "France", "India", "Ireland", "Netherlands", "Singapore", "South Africa",
  "Spain", "Sweden", "Switzerland", "United Arab Emirates", "Other",
];

const BookDemoDialog = () => {
  const { toast } = useToast();
  const { open, setOpen } = useDemoDialogStore();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    country: "",
    consent: false,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.email || !form.company) {
      toast({ title: "Please fill in required fields", variant: "destructive" });
      return;
    }
    toast({ title: "Demo request sent!", description: "We'll be in touch shortly." });
    setOpen(false);
    setForm({ firstName: "", lastName: "", email: "", phone: "", company: "", jobTitle: "", country: "", consent: false });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[95vw] max-w-md bg-background [&>button]:hidden max-h-[85vh] overflow-hidden flex flex-col" hideClose>
        <DialogHeader className="flex-shrink-0 space-y-1">
          <DialogTitle className="text-xl font-bold">Request a demo</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Fill in your details and we'll get back to you within 24 hours.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-1 hide-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-3 pr-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                <Input id="firstName" placeholder="John" value={form.firstName} onChange={(e) => handleChange("firstName", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                <Input id="lastName" placeholder="Doe" value={form.lastName} onChange={(e) => handleChange("lastName", e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">Work Email *</Label>
              <Input id="email" type="email" placeholder="john@company.com" value={form.email} onChange={(e) => handleChange("email", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
              <Input id="phone" type="tel" placeholder="+1 234 567 890" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="company" className="text-sm font-medium">Company *</Label>
              <Input id="company" placeholder="Acme Developments" value={form.company} onChange={(e) => handleChange("company", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="jobTitle" className="text-sm font-medium">Job Title</Label>
              <Input id="jobTitle" placeholder="Development Manager" value={form.jobTitle} onChange={(e) => handleChange("jobTitle", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Country</Label>
              <Select value={form.country} onValueChange={(v) => handleChange("country", v)}>
                <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-start gap-2">
              <Checkbox id="consent" checked={form.consent} onCheckedChange={(v) => handleChange("consent", !!v)} className="mt-0.5" />
              <Label htmlFor="consent" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                I'd like to receive emails about Meta-Verse's products, events, and promotions. I can unsubscribe at any time.
              </Label>
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="button" className="flex-1 text-sm bg-muted text-foreground hover:bg-muted/80" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 text-sm">
                Request Demo
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookDemoDialog;