import type { MetadataRoute } from "next";
import { siteUrl as base } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: base, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
