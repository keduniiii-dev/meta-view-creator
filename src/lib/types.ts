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
  job_title: string | null;
  phone: string | null;
  category: string | null;
  applications: number;
  score: number;
  status: "new" | "contacted" | "qualified" | "lost" | "won";
  assigned_to: number | null;
  created_at: string;
  updated_at: string;
}

export interface Bid {
  id: string;
  project: string;
  client: string;
  phase: "RFP Review" | "Technical Eval" | "Shortlist";
  deadline: string;
  suppliers: string[];
  value: number | null;
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
  created_at: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: "LinkedIn" | "Email";
  sent: number;
  opened: number;
  clicked: number;
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
  lead_growth: string;
  qualified_rate: number;
  email_open_rate: number;
  click_through: number;
}
