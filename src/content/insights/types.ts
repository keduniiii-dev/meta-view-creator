// Reusable data model for long-form Twinblueprint Insights articles.
// Works for any sector (Real Estate, Construction, Airports, Healthcare, Infrastructure).

export type InsightSector =
  | "Real Estate & Property Development"
  | "Construction"
  | "Airports"
  | "Healthcare"
  | "Infrastructure";

export type InsightStatus = "draft" | "review" | "published";

export type InsightBlock =
  | { type: "h2"; id: string; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "image"; src: string; alt: string; caption: string; width: number; height: number }
  | { type: "table"; caption: string; headers: string[]; rows: string[][] }
  | { type: "useCase"; title: string; challenge: string; approach: string; value: string }
  | { type: "checklist"; title: string; items: string[] }
  | { type: "faq"; items: { q: string; a: string }[] }
  | { type: "callout"; text: string };

export interface InsightSource {
  title: string;
  publisher: string;
  url: string;
}

export interface InsightArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: InsightSector;
  author: string;
  publishedAt: string; // ISO date
  readingTime: string;
  heroImage: { src: string; alt: string; caption?: string };
  keyTakeaways: string[];
  body: InsightBlock[];
  seo: { metaTitle: string; metaDescription: string };
  sources: InsightSource[];
  cta: { type: "explore" | "demo"; heading: string; copy: string; href?: string; label: string };
  relatedSlugs: { title: string; href: string }[];
  status: InsightStatus;
}
