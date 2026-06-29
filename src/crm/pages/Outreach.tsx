import { useState } from "react";
import { motion } from "framer-motion";
import { Linkedin, Mail, Send, Copy, CheckCircle, Eye, MousePointerClick } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const linkedInTemplate = `Hi [Name],

I noticed [Company] is leading some impressive projects in [sector]. At Twinblueprint, we help firms like yours cut design review cycles by 40% and win more bids with Immersive Property Visualisation.

Worth a quick 15-min call this week?

Best,
[Your Name]
Twinblueprint`;

const emailTemplate = `Subject: How [Company] Can Win More Bids with Immersive Property Visualisation

Dear [Name],

In today's competitive construction landscape, firms that leverage Immersive Property Visualisation win more contracts. Yet many still rely on outdated 2D presentations.

Twinblueprint helps construction and architecture leaders like [Company]:

- Reduce clash detection time
- Win more competitive bids
- Cut stakeholder review cycles
- Deliver photorealistic project walkthroughs

I'd love to schedule a 15-minute demo to show you what Twinblueprint could do for [current project].

Best regards,
[Your Name]
Twinblueprint`;

const campaigns = [
  { id: 1, name: "C-Suite LinkedIn Wave 1", type: "LinkedIn", sent: 245, opened: 187, clicked: 63, status: "Completed", date: "2026-03-15" },
  { id: 2, name: "Executive Email Blast", type: "Email", sent: 500, opened: 312, clicked: 89, status: "Completed", date: "2026-03-20" },
  { id: 3, name: "Follow-up LinkedIn Wave", type: "LinkedIn", sent: 180, opened: 142, clicked: 51, status: "Active", date: "2026-03-28" },
  { id: 4, name: "Follow-up Email Sequence", type: "Email", sent: 420, opened: 268, clicked: 74, status: "Active", date: "2026-04-01" },
];

const Outreach = () => {
  const [activeTab, setActiveTab] = useState<"linkedin" | "email" | "campaigns">("linkedin");
  const [copied, setCopied] = useState(false);
  const [linkedinMsg, setLinkedinMsg] = useState(linkedInTemplate);
  const [emailMsg, setEmailMsg] = useState(emailTemplate);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-foreground mb-2">Outreach Center</h1>
      <p className="text-muted-foreground mb-8">LinkedIn & email templates, campaign tracking, and engagement analytics</p>

      <div className="flex gap-1 mb-8 bg-secondary/50 rounded-lg p-1 w-fit">
        {[
          { key: "linkedin" as const, label: "LinkedIn", icon: Linkedin },
          { key: "email" as const, label: "Email", icon: Mail },
          { key: "campaigns" as const, label: "Campaigns", icon: Send },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            <tab.icon className="w-4 h-4" />{tab.label}
          </button>
        ))}
      </div>

      {activeTab === "linkedin" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl">
          <div className="gradient-card rounded-xl border border-border p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2"><Linkedin className="w-5 h-5 text-primary" /> LinkedIn Executive Message</h3>
              <Button variant="outline" size="sm" onClick={() => handleCopy(linkedinMsg)}>
                {copied ? <CheckCircle className="w-4 h-4 mr-1 text-success" /> : <Copy className="w-4 h-4 mr-1" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <Textarea value={linkedinMsg} onChange={(e) => setLinkedinMsg(e.target.value)} className="min-h-[280px] bg-secondary border-border font-mono text-sm text-foreground" />
            <p className="text-xs text-muted-foreground mt-3">Replace [Name], [Company], and [sector] with actual prospect details before sending.</p>
          </div>
        </motion.div>
      )}

      {activeTab === "email" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl">
          <div className="gradient-card rounded-xl border border-border p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2"><Mail className="w-5 h-5 text-primary" /> Executive Email Template</h3>
              <Button variant="outline" size="sm" onClick={() => handleCopy(emailMsg)}>
                {copied ? <CheckCircle className="w-4 h-4 mr-1 text-success" /> : <Copy className="w-4 h-4 mr-1" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <Textarea value={emailMsg} onChange={(e) => setEmailMsg(e.target.value)} className="min-h-[380px] bg-secondary border-border font-mono text-sm text-foreground" />
            <p className="text-xs text-muted-foreground mt-3">Personalise [Name], [Company], and [current project] before sending.</p>
          </div>
        </motion.div>
      )}

      {activeTab === "campaigns" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Sent", value: "1,345", icon: Send },
              { label: "Total Opens", value: "909", icon: Eye },
              { label: "Total Clicks", value: "277", icon: MousePointerClick },
              { label: "Avg CTR", value: "20.6%", icon: MousePointerClick },
            ].map((s, i) => (
              <div key={i} className="gradient-card rounded-xl border border-border p-5 shadow-card">
                <s.icon className="w-5 h-5 text-primary mb-2" />
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="gradient-card rounded-xl border border-border shadow-card overflow-hidden">
            <div className="p-5 border-b border-border"><h3 className="text-lg font-semibold text-foreground">Campaign History</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left py-3 px-5 font-medium">Campaign</th>
                    <th className="text-left py-3 px-5 font-medium">Type</th>
                    <th className="text-left py-3 px-5 font-medium">Sent</th>
                    <th className="text-left py-3 px-5 font-medium">Opened</th>
                    <th className="text-left py-3 px-5 font-medium">Clicked</th>
                    <th className="text-left py-3 px-5 font-medium">Open Rate</th>
                    <th className="text-left py-3 px-5 font-medium">CTR</th>
                    <th className="text-left py-3 px-5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c) => (
                    <tr key={c.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="py-3 px-5 font-medium text-foreground">{c.name}</td>
                      <td className="py-3 px-5"><span className="flex items-center gap-1 text-muted-foreground">{c.type === "LinkedIn" ? <Linkedin className="w-3 h-3" /> : <Mail className="w-3 h-3" />}{c.type}</span></td>
                      <td className="py-3 px-5 text-muted-foreground font-mono">{c.sent}</td>
                      <td className="py-3 px-5 text-muted-foreground font-mono">{c.opened}</td>
                      <td className="py-3 px-5 text-muted-foreground font-mono">{c.clicked}</td>
                      <td className="py-3 px-5 text-primary font-mono font-medium">{((c.opened / c.sent) * 100).toFixed(1)}%</td>
                      <td className="py-3 px-5 text-accent font-mono font-medium">{((c.clicked / c.sent) * 100).toFixed(1)}%</td>
                      <td className="py-3 px-5"><span className={`px-2 py-1 rounded-md text-xs font-medium ${c.status === "Active" ? "bg-success/20 text-success" : "bg-secondary text-muted-foreground"}`}>{c.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Outreach;
