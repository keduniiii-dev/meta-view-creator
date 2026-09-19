import RegionalOverview, { type RegionalWorkflowSlot } from "@/crm/components/RegionalOverview";

const workflow: RegionalWorkflowSlot[] = [
  { time: "AM (09:00–12:00 ET)", region: "North America East", focus: "Northeast US architecture, Canada public sector" },
  { time: "Midday (12:00–15:00 ET)", region: "North America West / LATAM North", focus: "West Coast BIM, Mexico infrastructure" },
  { time: "PM (15:00–18:00 ET)", region: "Latin America South", focus: "Brazil construction, regional regeneration" },
];
const focus: Record<string, string> = {
  "North America": "Commercial, Data Centers, Infrastructure",
  "Latin America": "Infrastructure, urban regeneration",
  "Central America & Caribbean": "Tourism Infra, Residential, Energy",
  "Brazil & Southern Cone": "Urban Dev, Mining, Industrial",
  "Andean Region": "Mining, Energy, Transport",
};
const tools: Record<string, string[]> = {
  "North America": ["Dodge", "Cognism"],
  "Latin America": ["Building Radar", "Cognism"],
  "Central America & Caribbean": ["LinkedIn SN", "ABiQ"],
  "Brazil & Southern Cone": ["Building Radar", "LinkedIn"],
  "Andean Region": ["ABiQ", "Cognism"],
};

export default function Americas() {
  return <RegionalOverview region="americas" title="Americas" description="Regional lead coverage and pipeline opportunities across North, Central and South America." workflow={workflow} focus={focus} tools={tools} />;
}