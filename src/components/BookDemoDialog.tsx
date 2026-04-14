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

const countries = [
  "United Kingdom", "United States", "Australia", "Canada", "Germany",
  "France", "India", "Ireland", "Netherlands", "Singapore", "South Africa",
  "Spain", "Sweden", "Switzerland", "United Arab Emirates", "Other",
];

interface BookDemoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BookDemoDialog = ({ open, onOpenChange }: BookDemoDialogProps) => {
  const { toast } = useToast();
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
    onOpenChange(false);
    setForm({ firstName: "", lastName: "", email: "", phone: "", company: "", jobTitle: "", country: "", consent: false });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Request a demo</DialogTitle>
          <DialogDescription>Fill in your details and we'll get back to you.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input id="firstName" placeholder="First Name" value={form.firstName} onChange={(e) => handleChange("firstName", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" placeholder="Last Name" value={form.lastName} onChange={(e) => handleChange("lastName", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="email">Work Email *</Label>
            <Input id="email" type="email" placeholder="Work Email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" placeholder="Phone" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="company">Company *</Label>
            <Input id="company" placeholder="Company" value={form.company} onChange={(e) => handleChange("company", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input id="jobTitle" placeholder="Job Title" value={form.jobTitle} onChange={(e) => handleChange("jobTitle", e.target.value)} />
          </div>
          <div>
            <Label>Country</Label>
            <Select value={form.country} onValueChange={(v) => handleChange("country", v)}>
              <SelectTrigger><SelectValue placeholder="Country" /></SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-start gap-2">
            <Checkbox id="consent" checked={form.consent} onCheckedChange={(v) => handleChange("consent", !!v)} className="mt-1" />
            <Label htmlFor="consent" className="text-xs text-muted-foreground leading-snug">
              Yes, I'd like to receive emails about Meta-Verse's products, events, and promotions. I understand I can unsubscribe at any time.
            </Label>
          </div>
          <Button type="submit" size="lg" className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-base">
            Request Demo
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookDemoDialog;
