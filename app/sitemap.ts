import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { caseStudies } from "@/lib/case-studies";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = siteConfig.url.replace(/\/$/, "");

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/#about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/#experience`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/#projects`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/#architecture`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/#contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const caseStudyUrls: MetadataRoute.Sitemap = caseStudies.map((cs) => ({
    url: `${base}/case-studies/${cs.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  return [...staticUrls, ...caseStudyUrls];
}
