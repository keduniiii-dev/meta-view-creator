import type { IncomingMessage, ServerResponse } from "http";
import type { Campaign, CampaignStats, Pagination } from "../../lib/types";

const campaigns: Campaign[] = [];

let nextCampId = 1;

export function listCampaigns(page = 1, limit = 20): { campaigns: Campaign[]; pagination: Pagination } {
  const total = campaigns.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const paged = campaigns.slice(start, start + limit);
  return { campaigns: paged, pagination: { page, limit, total, pages } };
}

export function getCampaign(id: string): Campaign | undefined {
  return campaigns.find((c) => c.id === id);
}

export function getCampaignStats(): CampaignStats {
  const total_sent = campaigns.reduce((sum, c) => sum + c.sent, 0);
  const total_opens = campaigns.reduce((sum, c) => sum + c.opened, 0);
  const total_clicks = campaigns.reduce((sum, c) => sum + c.clicked, 0);
  const avg_ctr = total_sent > 0 ? (total_clicks / total_sent) * 100 : 0;
  return { total_sent, total_opens, total_clicks, avg_ctr };
}

export function createCampaign(data: Omit<Campaign, "id" | "created_at">): Campaign {
  const campaign: Campaign = { ...data, id: `camp-${nextCampId++}`, created_at: new Date().toISOString() };
  campaigns.push(campaign);
  return campaign;
}

export function updateCampaign(id: string, data: Partial<Omit<Campaign, "id" | "created_at">>): Campaign | undefined {
  const idx = campaigns.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  campaigns[idx] = { ...campaigns[idx], ...data };
  return campaigns[idx];
}

export function deleteCampaign(id: string): boolean {
  const idx = campaigns.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  campaigns.splice(idx, 1);
  return true;
}

export function handleCampaigns(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");
  if (req.url === "/stats" && req.method === "GET") {
    res.end(JSON.stringify({ success: true, data: getCampaignStats() }));
  } else if (req.method === "GET" && !req.url?.includes("/")) {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 20;
    res.end(JSON.stringify({ success: true, data: listCampaigns(page, limit) }));
  } else if (req.method === "POST") {
    const campaign = createCampaign(req.body);
    res.statusCode = 201;
    res.end(JSON.stringify({ success: true, data: { campaign } }));
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ success: false, message: "Not found" }));
  }
}

export function handleCampaignById(req: IncomingMessage, res: ServerResponse, id: string) {
  res.setHeader("Content-Type", "application/json");
  if (!id) {
    res.statusCode = 404;
    res.end(JSON.stringify({ success: false, message: "Not found" }));
    return;
  }
  if (req.method === "GET") {
    const campaign = getCampaign(id);
    if (!campaign) { res.statusCode = 404; res.end(JSON.stringify({ success: false, message: "Campaign not found" })); return; }
    res.end(JSON.stringify({ success: true, data: { campaign } }));
  } else if (req.method === "PATCH") {
    const campaign = updateCampaign(id, req.body);
    if (!campaign) { res.statusCode = 404; res.end(JSON.stringify({ success: false, message: "Campaign not found" })); return; }
    res.end(JSON.stringify({ success: true, data: { campaign } }));
  } else if (req.method === "DELETE") {
    const deleted = deleteCampaign(id);
    if (!deleted) { res.statusCode = 404; res.end(JSON.stringify({ success: false, message: "Campaign not found" })); return; }
    res.end(JSON.stringify({ success: true, data: null }));
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ success: false, message: "Not found" }));
  }
}
