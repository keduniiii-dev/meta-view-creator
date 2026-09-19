import type { Bid, Lead, Project } from "./types";

export interface PipelineStage {
  name: "Discovery" | "Qualified" | "Proposal" | "Negotiation" | "Closed Won";
  count: number;
  value: number | null;
  currency?: string | null;
  leads: Lead[];
  bids: Array<Bid & { lead_id?: string | null }>;
}

export interface PipelineApiResponse {
  stages: PipelineStage[];
  active_bids: Bid[];
  inflight_projects: Project[];
  summary?: {
    total_bids: number;
    total_projects: number;
    total_bid_value: number;
  };
}

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

export function getPipelineData(): PipelineResponse {
  return { bids: [...bids], projects: [...projects] };
}
