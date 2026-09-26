import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, Layers3, Send, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSubmitDemo } from "@/hooks/use-demo";
import { useIndustries } from "@/hooks/use-industries";
import { crmPath } from "@/lib/crm-base";

const metrics = [
  ["12,847", "Leads Generated", "+23%"],
  ["34.2%", "Conversion Rate", "+5.1%"],
  ["$4.2M", "Revenue Pipeline", "+18%"],
  ["48", "Active Campaigns", "+12"],
  ["$87K", "Avg. Deal Size", "+6K"],
];

const Home = () => {
  const navigate = useNavigate();
  const submitDemo = useSubmitDemo();
  const industriesQuery = useIndustries();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", role: "", phone: "", category: "" });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    submitDemo.mutate({
      fullName: form.name,
      workEmail: form.email,
      company: form.company || undefined,
      jobTitle: form.role || undefined,
      phone: form.phone || undefined,
      industry: form.category || undefined,
      confirmationEmail: true,
    }, { onSuccess: () => setSubmitted(true) });
  };

  return (
    <div className="bg-hero">
      <section className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-5 py-16 text-center sm:px-8 sm:py-24">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-4 py-1.5 text-xs text-primary">
          <Sparkles className="h-3 w-3" /> Twinblueprint-Powered Lead Intelligence
        </div>
        <h1 className="min-w-0 max-w-5xl text-3xl min-[400px]:text-4xl font-extrabold leading-[1.02] text-foreground sm:text-7xl lg:text-8xl">
          Dominate the <span className="text-primary">Construction</span><br />
          &amp; Architecture Market
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Identify, qualify, and convert high-value metaverse visualisation leads with metaverse-powered prospecting. Track bids, manage deals and close faster with Twinblueprint CRM.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button size="lg" onClick={() => document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" })}>Start Generating Leads <span className="ml-2">→</span></Button>
          <Button size="lg" variant="outline" onClick={() => navigate(crmPath("/dashboard"))}>View Demo Dashboard</Button>
        </div>
        <div className="mt-14 grid w-full max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3">
          {[
            [Users, "2,400+", "Construction Leads"],
            [Layers3, "840", "Active Projects"],
            [BarChart3, "150", "AI Matches/Day"],
          ].map(([Icon, value, label]) => (
            <div key={label as string} className="rounded-xl border border-border bg-card/70 px-6 py-7 shadow-card">
              <Icon className="mx-auto h-5 w-5 text-primary" />
              <p className="mt-3 text-2xl font-bold">{value as string}</p>
              <p className="text-sm text-muted-foreground">{label as string}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card/50 px-4 py-6">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 text-center sm:grid-cols-5">
          {metrics.map(([value, label, change]) => <div key={label}><p className="text-2xl font-bold">{value}</p><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 text-xs text-success">{change}</p></div>)}
        </div>
      </section>

      <section id="lead-form" className="px-5 py-24 text-center sm:px-8 sm:py-32">
        <h2 className="text-4xl font-bold sm:text-5xl">Start <span className="text-primary">Generating Leads</span></h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">Join 500+ construction firms using Twinblueprint metaverse to win more contracts.</p>
        {submitted ? (
          <div className="mx-auto mt-8 max-w-md rounded-xl border border-primary/30 bg-card p-8"><h3 className="text-xl font-bold">Demo request received</h3><p className="mt-2 text-sm text-muted-foreground">Your request has been added to the CRM pipeline. A confirmation with your lead report is on its way to <span className="text-foreground">{form.email}</span>.</p><Button className="mt-5" onClick={() => setSubmitted(false)}>Add another</Button></div>
        ) : (
          <form onSubmit={submit} className="mx-auto mt-10 max-w-2xl rounded-2xl border border-border bg-card p-4 text-left shadow-elevated sm:p-9">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[["name", "Full Name", "John Smith", "text"], ["email", "Work Email", "john@company.com", "email"], ["company", "Company", "Acme Construction", "text"], ["role", "Job Title", "VP of Operations", "text"], ["phone", "Phone", "+1 (555) 000-0000", "tel"]].map(([key, label, placeholder, type]) => <div key={key} className="space-y-1.5"><Label className="text-xs text-muted-foreground">{label}</Label><Input required={key === "name" || key === "email"} type={type} placeholder={placeholder} value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} /></div>)}
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Industry</Label><Select value={form.category} onValueChange={(category) => setForm({ ...form, category })}><SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger><SelectContent>{(industriesQuery.data?.industries ?? ["Construction", "Architecture", "Urban Development", "Infrastructure"]).map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <Button type="submit" size="lg" className="mt-6 h-auto min-h-11 w-full whitespace-normal px-3" disabled={submitDemo.isPending}><Send className="mr-2 h-4 w-4" />{submitDemo.isPending ? "Submitting…" : "Request Demo & Lead Report"}</Button>
            <p className="mt-3 text-center text-[10px] text-muted-foreground">No credit card required. Get your personalised lead report in 24h.</p>
          </form>
        )}
      </section>
    </div>
  );
};

export default Home;
