import type { IncomingMessage, ServerResponse } from "http";
import type { Lead, Pagination } from "../../lib/types";

const leads: Lead[] = [];

let nextId = 1;

export function listLeads(page = 1, limit = 20): { leads: Lead[]; pagination: Pagination } {
  const total = leads.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const paged = leads.slice(start, start + limit);
  return { leads: paged, pagination: { page, limit, total, pages } };
}

export function getLead(id: string): Lead | undefined {
  return leads.find((l) => l.id === id);
}

export function createLead(data: Partial<Omit<Lead, "id" | "created_at" | "updated_at">>): Lead {
  const now = new Date().toISOString();
  const lead: Lead = {
    id: `lead-${nextId++}`,
    full_name: data.full_name || "",
    email: data.email || "",
    company: data.company || null,
    job_title: data.job_title || null,
    phone: data.phone || null,
    category: data.category || null,
    applications: data.applications ?? 0,
    score: data.score ?? 0,
    status: (data.status as Lead["status"]) || "new",
    assigned_to: data.assigned_to ?? null,
    created_at: now,
    updated_at: now,
  };
  leads.push(lead);
  return lead;
}

export function updateLead(id: string, data: Partial<Omit<Lead, "id" | "created_at">>): Lead | undefined {
  const idx = leads.findIndex((l) => l.id === id);
  if (idx === -1) return undefined;
  leads[idx] = { ...leads[idx], ...data, updated_at: new Date().toISOString() };
  return leads[idx];
}

export function deleteLead(id: string): boolean {
  const idx = leads.findIndex((l) => l.id === id);
  if (idx === -1) return false;
  leads.splice(idx, 1);
  return true;
}

export function assignLead(id: string, assigned_to: string): Lead | undefined {
  const idx = leads.findIndex((l) => l.id === id);
  if (idx === -1) return undefined;
  leads[idx] = { ...leads[idx], assigned_to: Number(assigned_to), updated_at: new Date().toISOString() };
  return leads[idx];
}

export function getAllLeads(): Lead[] {
  return [...leads];
}

export function handleLeads(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");
  if (req.method === "GET" && !req.url?.includes("/")) {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 20;
    res.end(JSON.stringify({ success: true, data: listLeads(page, limit) }));
  } else if (req.method === "POST") {
    const lead = createLead(req.body);
    res.statusCode = 201;
    res.end(JSON.stringify({ success: true, data: { lead } }));
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ success: false, message: "Not found" }));
  }
}

export function handleLeadById(req: IncomingMessage, res: ServerResponse, id: string) {
  res.setHeader("Content-Type", "application/json");
  if (req.method === "GET") {
    const lead = getLead(id);
    if (!lead) { res.statusCode = 404; res.end(JSON.stringify({ success: false, message: "Lead not found" })); return; }
    res.end(JSON.stringify({ success: true, data: { lead } }));
  } else if (req.method === "PATCH") {
    const lead = updateLead(id, req.body);
    if (!lead) { res.statusCode = 404; res.end(JSON.stringify({ success: false, message: "Lead not found" })); return; }
    res.end(JSON.stringify({ success: true, data: { lead } }));
  } else if (req.method === "DELETE") {
    const deleted = deleteLead(id);
    if (!deleted) { res.statusCode = 404; res.end(JSON.stringify({ success: false, message: "Lead not found" })); return; }
    res.end(JSON.stringify({ success: true, data: null }));
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ success: false, message: "Not found" }));
  }
}

export function handleLeadAssign(req: IncomingMessage, res: ServerResponse, body: any) {
  res.setHeader("Content-Type", "application/json");
  const id = req.url?.split("/")[1] || "";
  const lead = assignLead(id, body.assigned_to);
  if (!lead) { res.statusCode = 404; res.end(JSON.stringify({ success: false, message: "Lead not found" })); return; }
  res.end(JSON.stringify({ success: true, data: { lead } }));
}
