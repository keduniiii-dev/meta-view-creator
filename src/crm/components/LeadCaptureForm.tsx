import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const categories = ["Construction", "Architecture", "Urban Development", "Infrastructure"];

const LeadCaptureForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", company: "", role: "", category: "", phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission - stores locally only
    const stored = JSON.parse(localStorage.getItem("crm_captured_leads") || "[]");
    stored.unshift({ ...form, id: Date.now(), createdAt: new Date().toISOString() });
    localStorage.setItem("crm_captured_leads", JSON.stringify(stored));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center gradient-card rounded-2xl border border-border p-12 shadow-elevated"
          >
            <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">Lead Captured</h3>
            <p className="text-muted-foreground">The new lead has been saved to your local pipeline.</p>
            <Button className="mt-6" variant="outline" onClick={() => { setSubmitted(false); setForm({ name: "", email: "", company: "", role: "", category: "", phone: "" }); }}>
              Add another
            </Button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-4xl font-bold mb-3">
              Capture a <span className="text-gradient">New Lead</span>
            </h2>
            <p className="text-muted-foreground">Manually log a prospect into the CRM pipeline.</p>
          </div>

          <form onSubmit={handleSubmit} className="gradient-card rounded-2xl border border-border p-8 shadow-elevated space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Full Name</Label>
                <Input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="mt-1 bg-secondary border-border focus:border-primary" placeholder="John Smith" />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Work Email</Label>
                <Input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="mt-1 bg-secondary border-border focus:border-primary" placeholder="john@company.com" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Company</Label>
                <Input required value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} className="mt-1 bg-secondary border-border focus:border-primary" placeholder="Acme Construction" />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Job Title</Label>
                <Input value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className="mt-1 bg-secondary border-border focus:border-primary" placeholder="VP of Operations" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Phone</Label>
                <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="mt-1 bg-secondary border-border focus:border-primary" placeholder="+1 (555) 000-0000" />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Industry</Label>
                <select required value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="mt-1 w-full h-10 rounded-md border border-border bg-secondary px-3 text-sm text-foreground focus:outline-none focus:border-primary">
                  <option value="">Select industry</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <Button type="submit" className="w-full gradient-primary text-primary-foreground shadow-glow py-6 text-base hover:opacity-90">
              <Send className="w-4 h-4 mr-2" />
              Save Lead to Pipeline
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LeadCaptureForm;
