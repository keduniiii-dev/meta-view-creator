import type { InsightArticle } from "./types";
import { interactive3dPropertyDevelopment } from "./interactive-3d-property-development";

export const insightArticles: InsightArticle[] = [interactive3dPropertyDevelopment];

export function getInsightBySlug(slug?: string) {
  return insightArticles.find((a) => a.slug === slug);
}

// Only published insights may be indexed or listed in public navigation.
export function isInsightIndexable(article: InsightArticle) {
  return article.status === "published";
}
