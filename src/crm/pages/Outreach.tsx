import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Mail, Send, Copy, CheckCircle, Eye, MousePointerClick, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCampaigns, useCampaignStats } from "@/hooks/use-campaigns";

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

const Outreach = () => {
  const [copied, setCopied] = useState(false);
  const [linkedinMsg, setLinkedinMsg] = useState(linkedInTemplate);
  const [emailMsg, setEmailMsg] = useState(emailTemplate);

  const { data: campaignsData, isLoading: campaignsLoading } = useCampaigns(1, 50);
  const { data: statsData, isLoading: statsLoading } = useCampaignStats();

  const campaigns = campaignsData?.campaigns ?? [];
  const loading = campaignsLoading || statsLoading;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const campaignStats = [
    { label: "Total Sent", value: (statsData?.total_sent ?? 0).toLocaleString(), icon: Send },
    { label: "Total Opens", value: (statsData?.total_opens ?? 0).toLocaleString(), icon: Eye },
    { label: "Total Clicks", value: (statsData?.total_clicks ?? 0).toLocaleString(), icon: MousePointerClick },
    { label: "Avg CTR", value: `${(statsData?.avg_ctr ?? 0).toFixed(1)}%`, icon: MousePointerClick },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Outreach Center</h1>
        <p className="text-muted-foreground">LinkedIn & email templates, campaign tracking, and engagement analytics</p>
      </div>

      <Tabs defaultValue="linkedin" className="w-full">
        <TabsList>
          <TabsTrigger value="linkedin"><MessageSquare className="w-4 h-4 mr-2" />LinkedIn</TabsTrigger>
          <TabsTrigger value="email"><Mail className="w-4 h-4 mr-2" />Email</TabsTrigger>
          <TabsTrigger value="campaigns"><Send className="w-4 h-4 mr-2" />Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="linkedin">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="max-w-3xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2"><MessageSquare className="w-5 h-5 text-primary" /> LinkedIn Executive Message</CardTitle>
                <Button variant="outline" size="sm" onClick={() => handleCopy(linkedinMsg)}>
                  {copied ? <CheckCircle className="w-4 h-4 mr-1 text-green-500" /> : <Copy className="w-4 h-4 mr-1" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea value={linkedinMsg} onChange={(e) => setLinkedinMsg(e.target.value)} className="min-h-[280px] font-mono text-sm" />
                <p className="text-xs text-muted-foreground mt-3">Replace [Name], [Company], and [sector] with actual prospect details before sending.</p>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="email">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="max-w-3xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2"><Mail className="w-5 h-5 text-primary" /> Executive Email Template</CardTitle>
                <Button variant="outline" size="sm" onClick={() => handleCopy(emailMsg)}>
                  {copied ? <CheckCircle className="w-4 h-4 mr-1 text-green-500" /> : <Copy className="w-4 h-4 mr-1" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea value={emailMsg} onChange={(e) => setEmailMsg(e.target.value)} className="min-h-[380px] font-mono text-sm" />
                <p className="text-xs text-muted-foreground mt-3">Personalise [Name], [Company], and [current project] before sending.</p>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="campaigns">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {campaignStats.map((s, i) => (
                <Card key={i}>
                  <CardContent className="p-5">
                    <s.icon className="w-5 h-5 text-primary mb-2" />
                    <p className="text-2xl font-bold text-foreground">{s.value}</p>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Campaign History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {campaigns.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Campaign</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Sent</TableHead>
                        <TableHead>Opened</TableHead>
                        <TableHead>Clicked</TableHead>
                        <TableHead>Open Rate</TableHead>
                        <TableHead>CTR</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {campaigns.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell className="font-medium">{c.name}</TableCell>
                          <TableCell>
                            <span className="flex items-center gap-1 text-muted-foreground">
                              {c.type === "LinkedIn" ? <MessageSquare className="w-3 h-3" /> : <Mail className="w-3 h-3" />}{c.type}
                            </span>
                          </TableCell>
                          <TableCell className="font-mono text-muted-foreground">{c.sent}</TableCell>
                          <TableCell className="font-mono text-muted-foreground">{c.opened}</TableCell>
                          <TableCell className="font-mono text-muted-foreground">{c.clicked}</TableCell>
                          <TableCell className="font-mono font-medium text-primary">{c.sent > 0 ? ((c.opened / c.sent) * 100).toFixed(1) : 0}%</TableCell>
                          <TableCell className="font-mono font-medium text-accent">{c.sent > 0 ? ((c.clicked / c.sent) * 100).toFixed(1) : 0}%</TableCell>
                          <TableCell>
                            <Badge variant={c.status === "Active" ? "default" : "secondary"}>{c.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No campaigns yet</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Outreach;
