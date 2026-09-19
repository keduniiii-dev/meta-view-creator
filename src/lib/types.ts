export interface User {
  id: number;
  username: string;
  full_name: string;
  email: string;
  role: "user" | "admin";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthLoginResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: unknown;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface Lead {
  id: string;
  full_name: string;
  email: string;
  company: string | null;
  project: string | null;
  project_size: string | null;
  project_value: number | null;
  currency: string | null;
  region: string | null;
  country: string | null;
  phase: "Discovery" | "Bid" | "In-flight" | null;
  lead_status: "New" | "Identified" | "Bidding" | "Inflight" | "Closed" | null;
  archived: boolean;
  temperature: "hot" | "warm" | "cool" | null;
  job_title: string | null;
  phone: string | null;
  industry: string | null;
  applications: number;
  application_tools: string[] | null;
  score: number;
  status: "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "lost" | "won";
  assigned_to: number | null;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  role: string | null;
  tools: string[];
  temperature: "hot" | "warm" | "cool" | null;
  contact: { name: string | null; job_title: string | null; email: string | null };
  visualisation_tool: string | null;
  uses_3d: boolean | null;
  opportunity: string | null;
  pain_points: string[];
}
export interface Bid {
  supplier_details?: Supplier[];
  id: string;
  project: string;
  client: string;
  phase: "RFP Review" | "Technical Eval" | "Shortlist";
  deadline: string;
  suppliers: string[];
  value: number | null;
  currency?: string | null;
  status?: string | null;
  lead_id?: string | null;
  created_at: string;
}

export interface Project {
  id: string;
  project: string;
  client: string;
  start_date: string;
  end_date: string;
  progress: number;
  suppliers: string[];
  uses_3d: boolean;
  competitor: string | null;
  issue: string | null;
  status?: string | null;
  phase?: "Planning" | "Design" | "Construction" | "In Progress" | "Completed" | null;
  value?: number | null;
  currency?: string | null;
  created_at: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: "LinkedIn" | "Email";
  sent: number;
  opened: number;
  clicked: number;
  open_rate?: number;
  ctr?: number;
  status: "Completed" | "Active";
  campaign_date: string;
  created_at: string;
}

export interface CampaignStats {
  total_sent: number;
  total_opens: number;
  total_clicks: number;
  avg_ctr: number;
}

export interface WeeklyData {
  week: string;
  leads: number;
  emails: number;
  opens: number;
  clicks: number;
}

export interface FunnelStep {
  stage: string;
  count: number;
  pct: number;
}

export interface IndustriesResponse {
  industries: string[];
}

export interface Kpis {
  lead_growth: number | string;
  qualified_rate: number;
  email_open_rate: number;
  click_through: number;
}

