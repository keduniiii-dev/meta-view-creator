import RegionalOverview, { type RegionalWorkflowSlot } from "@/crm/components/RegionalOverview";

const workflow: RegionalWorkflowSlot[] = [
  { time: "AM (08:00–12:00)", region: "Middle East & Africa", focus: "GCC mega-projects, African infrastructure" },
  { time: "Midday (12:00–15:00)", region: "Continental Europe", focus: "DACH sustainability, Southern regeneration" },
  { time: "PM (15:00–18:00)", region: "UK & Ireland", focus: "Retrofit programs, BIM specification" },
];
const focus: Record<string, string> = {
  "UK & Ireland": "Retrofit, Public Sector, BIM",
  "DACH / Northern Europe": "Sustainability, ESG-driven",
  "Middle East (GCC)": "Mega Projects, Smart Cities",
  "Africa": "Infrastructure, Urban Dev",
  "Southern Europe": "Regeneration, Tourism Infra",
};
const tools: Record<string, string[]> = {
  "UK & Ireland": ["Barbour ABI", "Cognism"],
  "DACH / Northern Europe": ["Building Radar", "Cognism"],
  "Middle East (GCC)": ["MEED", "Cognism"],
  Africa: ["ABiQ", "LinkedIn SN"],
  "Southern Europe": ["Building Radar", "LinkedIn"],
};
const strategy: Record<string, string> = {
  "DACH / Northern Europe": "Capture ESG-driven projects",
  "Middle East (GCC)": "Target contractors in delivery phase",
  Africa: "Influence consultants + financiers",
  "Southern Europe": "Target regeneration programs",
};

export default function Emea() {
  return <RegionalOverview region="emea" title="EMEA" description="Regional lead coverage and pipeline opportunities across Europe, the Middle East and Africa." workflow={workflow} focus={focus} tools={tools} strategy={strategy} />;
}