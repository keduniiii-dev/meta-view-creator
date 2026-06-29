import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categories = ["Construction", "Architecture", "Urban Development", "Infrastructure"];

const LeadCaptureForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", company: "", role: "", category: "", phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stored = JSON.parse(localStorage.getItem("crm_captured_leads") || "[]");
    stored.unshift({ ...form, id: Date.now(), createdAt: new Date().toISOString() });
    localStorage.setItem("crm_captured_leads", JSON.stringify(stored));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-lg mx-auto text-center p-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-foreground mb-2">Lead Captured</h3>
          <p className="text-muted-foreground">The new lead has been saved to your local pipeline.</p>
          <Button className="mt-6" variant="outline" onClick={() => { setSubmitted(false); setForm({ name: "", email: "", company: "", role: "", category: "", phone: "" }); }}>
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
          <p className="text-muted-foreground">Manually log a prospect into the CRM pipeline.</p>
        </div>

        <Card>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Full Name</Label>
                  <Input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="mt-1" placeholder="John Smith" />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Work Email</Label>
                  <Input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="mt-1" placeholder="john@company.com" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Company</Label>
                  <Input required value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} className="mt-1" placeholder="Acme Construction" />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Job Title</Label>
                  <Input value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className="mt-1" placeholder="VP of Operations" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Phone</Label>
                  <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="mt-1" placeholder="+1 (555) 000-0000" />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Industry</Label>
                  <Select required value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full py-6 text-base">
                <Send className="w-4 h-4 mr-2" />
                Save Lead to Pipeline
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeadCaptureForm;
