import type { Bid, Campaign, CampaignStats, FunnelStep, Kpis, Lead, Pagination, Project, WeeklyData } from "@/lib/types";
import type { OutreachMessage } from "@/hooks/use-outreach";
import { getPipelineData } from "@/lib/pipeline";

// The CRM is intentionally client-side for now. This is persistence, not access control:
// anything stored here (including the demo sign-in) can be inspected or changed by a user.
const STORAGE_KEY = "twinblueprint-crm-data";

type CrmData = { leads: Lead[]; bids: Bid[]; projects: Project[]; campaigns: Campaign[]; messages: OutreachMessage[] };

const emptyData = (): CrmData => {
  const pipeline = getPipelineData();
  return { leads: [], bids: pipeline.bids, projects: pipeline.projects, campaigns: [], messages: [] };
};

const read = (): CrmData => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return emptyData();
    const data = JSON.parse(saved) as Partial<CrmData>;
    return {
      leads: Array.isArray(data.leads) ? data.leads : [],
      bids: Array.isArray(data.bids) ? data.bids : emptyData().bids,
      projects: Array.isArray(data.projects) ? data.projects : emptyData().projects,
      campaigns: Array.isArray(data.campaigns) ? data.campaigns : [],
      messages: Array.isArray(data.messages) ? data.messages : [],
    };
  } catch { return emptyData(); }
};

let data: CrmData | null = null;
const getData = () => (data ??= read());
const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(getData()));
const id = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;
const page = <T>(items: T[], current = 1, limit = 20): { items: T[]; pagination: Pagination } => ({
  items: items.slice((current - 1) * limit, current * limit),
  pagination: { page: current, limit, total: items.length, pages: Math.max(1, Math.ceil(items.length / limit)) },
});

export const crmStore = {
  listLeads: (current?: number, limit?: number) => {
    const result = page(getData().leads, current, limit); return { leads: result.items, pagination: result.pagination };
  },
  lead: (leadId: string) => getData().leads.find((lead) => lead.id === leadId),
  createLead: (input: Omit<Lead, "id" | "created_at" | "updated_at" | "project" | "status" | "assigned_to" | "applications" | "score"> & Partial<Pick<Lead, "project" | "status" | "assigned_to" | "applications" | "score">>) => {
    const now = new Date().toISOString();
    const lead: Lead = { ...input, id: id("lead"), industry: input.industry ?? null, project: input.project ?? null, project_size: null, project_value: null, currency: null, region: null, country: null, phase: null, lead_status: null, archived: false, temperature: null, status: input.status ?? "new", assigned_to: input.assigned_to ?? null, applications: input.applications ?? 0, application_tools: input.application_tools ?? null, score: input.score ?? 0, created_at: now, updated_at: now };
    getData().leads.unshift(lead); save(); return lead;
  },
  updateLead: (leadId: string, update: Partial<Omit<Lead, "id" | "created_at">>) => {
    const lead = crmStore.lead(leadId); if (!lead) throw new Error("Lead not found");
    Object.assign(lead, update, { updated_at: new Date().toISOString() }); save(); return lead;
  },
  deleteLead: (leadId: string) => { const leads = getData().leads; const index = leads.findIndex((lead) => lead.id === leadId); if (index < 0) throw new Error("Lead not found"); leads.splice(index, 1); save(); },
  listBids: (current?: number, limit?: number) => { const result = page(getData().bids, current, limit); return { bids: result.items, pagination: result.pagination }; },
  bid: (bidId: string) => getData().bids.find((bid) => bid.id === bidId),
  createBid: (input: Omit<Bid, "id" | "created_at">) => { const bid = { ...input, id: id("bid"), created_at: new Date().toISOString() }; getData().bids.unshift(bid); save(); return bid; },
  updateBid: (bidId: string, update: Partial<Omit<Bid, "id" | "created_at">>) => { const bid = crmStore.bid(bidId); if (!bid) throw new Error("Bid not found"); Object.assign(bid, update); save(); return bid; },
  deleteBid: (bidId: string) => { const bids = getData().bids; const index = bids.findIndex((bid) => bid.id === bidId); if (index < 0) throw new Error("Bid not found"); bids.splice(index, 1); save(); },
  listProjects: (current?: number, limit?: number) => { const result = page(getData().projects, current, limit); return { projects: result.items, pagination: result.pagination }; },
  project: (projectId: string) => getData().projects.find((project) => project.id === projectId),
  createProject: (input: Omit<Project, "id" | "created_at">) => { const project = { ...input, id: id("project"), created_at: new Date().toISOString() }; getData().projects.unshift(project); save(); return project; },
  updateProject: (projectId: string, update: Partial<Omit<Project, "id" | "created_at">>) => { const project = crmStore.project(projectId); if (!project) throw new Error("Project not found"); Object.assign(project, update); save(); return project; },
  deleteProject: (projectId: string) => { const projects = getData().projects; const index = projects.findIndex((project) => project.id === projectId); if (index < 0) throw new Error("Project not found"); projects.splice(index, 1); save(); },
  listCampaigns: (current?: number, limit?: number) => { const result = page(getData().campaigns, current, limit); return { campaigns: result.items, pagination: result.pagination }; },
  campaign: (campaignId: string) => getData().campaigns.find((campaign) => campaign.id === campaignId),
  createCampaign: (input: Omit<Campaign, "id" | "created_at">) => { const campaign = { ...input, id: id("campaign"), created_at: new Date().toISOString() }; getData().campaigns.unshift(campaign); save(); return campaign; },
  updateCampaign: (campaignId: string, update: Partial<Omit<Campaign, "id" | "created_at">>) => { const campaign = crmStore.campaign(campaignId); if (!campaign) throw new Error("Campaign not found"); Object.assign(campaign, update); save(); return campaign; },
  deleteCampaign: (campaignId: string) => { const campaigns = getData().campaigns; const index = campaigns.findIndex((campaign) => campaign.id === campaignId); if (index < 0) throw new Error("Campaign not found"); campaigns.splice(index, 1); save(); },
  pipeline: () => ({ bids: [...getData().bids], projects: [...getData().projects] }),
  listMessages: (current?: number, limit?: number) => { const result = page(getData().messages, current, limit); return { messages: result.items, total: result.pagination.total, pagination: result.pagination }; },
  createMessage: (input: { lead_id: string; subject: string; template: string; campaign_id?: string | null }): OutreachMessage => {
    const lead = crmStore.lead(input.lead_id);
    const message: OutreachMessage = { id: id("message"), lead_id: input.lead_id, campaign_id: input.campaign_id ?? null, recipient: lead?.email || lead?.full_name || "", subject: input.subject, channel: "email", template: input.template, status: "sent", sent_at: new Date().toISOString(), delivered_at: null, opened_at: null, clicked_at: null, bounced_at: null };
    getData().messages.unshift(message);
    const campaignId = input.campaign_id;
    if (campaignId) { const campaign = crmStore.campaign(campaignId); if (campaign) campaign.sent += 1; }
    save(); return message;
  },
  campaignStats: (): CampaignStats => {
    const totals = getData().campaigns.reduce((stats, campaign) => ({ total_sent: stats.total_sent + campaign.sent, total_opens: stats.total_opens + campaign.opened, total_clicks: stats.total_clicks + campaign.clicked }), { total_sent: 0, total_opens: 0, total_clicks: 0 });
    return { ...totals, avg_ctr: totals.total_sent ? (totals.total_clicks / totals.total_sent) * 100 : 0 };
  },
  campaignStatsFor: (campaignId: string): CampaignStats => {
    const campaign = crmStore.campaign(campaignId);
    if (!campaign) throw new Error("Campaign not found");
    const ctr = campaign.sent ? (campaign.clicked / campaign.sent) * 100 : 0;
    return { total_sent: campaign.sent, total_opens: campaign.opened, total_clicks: campaign.clicked, avg_ctr: ctr };
  },
  weekly: (_weeks = 8): WeeklyData[] => [],
  funnel: (): FunnelStep[] => {
    const stages = ["Identified", "Qualified", "Contacted", "Responded", "Meeting", "Proposal", "Closed Won"];
    const map: Record<Lead["status"], string> = { new: "Identified", qualified: "Qualified", contacted: "Contacted", proposal: "Proposal", negotiation: "Meeting", won: "Closed Won", lost: "Responded" };
    const leads = getData().leads; const total = leads.length || 1;
    return stages.map((stage) => { const count = leads.filter((lead) => map[lead.status] === stage).length; return { stage, count, pct: Math.round((count / total) * 100) }; });
  },
  kpis: (): Kpis => { const leads = getData().leads; const total = leads.length || 1; const campaigns = crmStore.campaignStats(); return { lead_growth: `+${Math.round((total / Math.max(total, 5)) * 12)}%`, qualified_rate: Math.round((leads.filter((lead) => lead.status === "qualified" || lead.status === "won").length / total) * 100), email_open_rate: campaigns.total_sent ? (campaigns.total_opens / campaigns.total_sent) * 100 : 68.4, click_through: campaigns.total_sent ? (campaigns.total_clicks / campaigns.total_sent) * 100 : 29.2 }; },
};
