import type { Bid, Project, Pagination } from "./types";

export interface PipelineResponse {
  bids: Bid[];
  projects: Project[];
}

const bids: Bid[] = [
  {
    id: "bid-1",
    project: "Northwind Retail Expansion",
    client: "Northwind Traders",
    phase: "RFP Review",
    deadline: "2026-08-14",
    suppliers: ["Apex Build", "BluePeak Partners"],
    value: 1850000,
    created_at: "2026-07-01T00:00:00.000Z",
  },
  {
    id: "bid-2",
    project: "Contoso Workplace Fitout",
    client: "Contoso",
    phase: "Technical Eval",
    deadline: "2026-08-28",
    suppliers: ["Metro Studio", "Northstar Design"],
    value: 920000,
    created_at: "2026-07-05T00:00:00.000Z",
  },
];

const projects: Project[] = [
  {
    id: "project-1",
    project: "Contoso HQ Visualisation",
    client: "Contoso",
    start_date: "2026-07-10",
    end_date: "2026-10-10",
    progress: 68,
    suppliers: ["Apex Build", "BluePeak Partners"],
    uses_3d: true,
    competitor: "VividSpace",
    issue: null,
    created_at: "2026-07-02T00:00:00.000Z",
  },
  {
    id: "project-2",
    project: "Fabrikam Manufacturing Tour",
    client: "Fabrikam",
    start_date: "2026-08-01",
    end_date: "2026-11-15",
    progress: 24,
    suppliers: ["Northstar Design"],
    uses_3d: false,
    competitor: null,
    issue: "Awaiting sign-off on scope changes",
    created_at: "2026-07-08T00:00:00.000Z",
  },
];

let nextBidId = 3;
let nextProjectId = 3;

export function getPipelineData(): PipelineResponse {
  return { bids: [...bids], projects: [...projects] };
}

export function listBids(
  page = 1,
  limit = 20,
): { bids: Bid[]; pagination: Pagination } {
  const total = bids.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const paged = bids.slice(start, start + limit);
  return { bids: paged, pagination: { page, limit, total, pages } };
}

export function getBid(id: string): Bid | undefined {
  return bids.find((b) => b.id === id);
}

export function createBid(
  data: Omit<Bid, "id" | "created_at">,
): Bid {
  const bid: Bid = {
    ...data,
    id: `bid-${nextBidId++}`,
    created_at: new Date().toISOString(),
  };
  bids.push(bid);
  return bid;
}

export function updateBid(
  id: string,
  data: Partial<Omit<Bid, "id" | "created_at">>,
): Bid | undefined {
  const idx = bids.findIndex((b) => b.id === id);
  if (idx === -1) return undefined;
  bids[idx] = { ...bids[idx], ...data };
  return bids[idx];
}

export function deleteBid(id: string): boolean {
  const idx = bids.findIndex((b) => b.id === id);
  if (idx === -1) return false;
  bids.splice(idx, 1);
  return true;
}

export function listProjects(
  page = 1,
  limit = 20,
): { projects: Project[]; pagination: Pagination } {
  const total = projects.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const paged = projects.slice(start, start + limit);
  return { projects: paged, pagination: { page, limit, total, pages } };
}

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function createProject(
  data: Omit<Project, "id" | "created_at">,
): Project {
  const project: Project = {
    ...data,
    id: `project-${nextProjectId++}`,
    created_at: new Date().toISOString(),
  };
  projects.push(project);
  return project;
}

export function updateProject(
  id: string,
  data: Partial<Omit<Project, "id" | "created_at">>,
): Project | undefined {
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  projects[idx] = { ...projects[idx], ...data };
  return projects[idx];
}

export function deleteProject(id: string): boolean {
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  projects.splice(idx, 1);
  return true;
}
