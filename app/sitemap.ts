// app/sitemap.ts
import type { MetadataRoute } from "next";

/**
 * If you have dynamic routes (e.g., fetched from a DB/CMS),
 * fetch them here and map into the array below.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.BASE_URL;

  const routes = ["/", "/about", "/services", "/contact", "/booking"];

  const now = new Date();

  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
