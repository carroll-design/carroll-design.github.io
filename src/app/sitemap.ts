import type { MetadataRoute } from "next";
import {
  getLeadershipWithPages,
  getNews,
  getExperienceWithPages,
  getProjectsWithPages,
} from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const buildDate = new Date();
  const news = getNews();
  // Newest item's date stands in for the pages that change when news does.
  const latestNews = news.length
    ? new Date(`${news[0].meta.date}T12:00:00Z`)
    : buildDate;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}`, lastModified: latestNews },
    { url: `${SITE_URL}/experience`, lastModified: buildDate },
    { url: `${SITE_URL}/projects`, lastModified: buildDate },
    { url: `${SITE_URL}/leadership`, lastModified: buildDate },
    { url: `${SITE_URL}/news`, lastModified: latestNews },
    { url: `${SITE_URL}/resume`, lastModified: buildDate },
  ];

  const projectPages: MetadataRoute.Sitemap = getProjectsWithPages().map(
    (p) => ({
      url: `${SITE_URL}/projects/${p.meta.slug}`,
      lastModified: buildDate,
    }),
  );

  const experiencePages: MetadataRoute.Sitemap = getExperienceWithPages().map(
    (e) => ({
      url: `${SITE_URL}/experience/${e.meta.slug}`,
      lastModified: buildDate,
    }),
  );

  const leadershipPages: MetadataRoute.Sitemap = getLeadershipWithPages().map(
    (p) => ({
      url: `${SITE_URL}/leadership/${p.meta.slug}`,
      lastModified: buildDate,
    }),
  );

  // News permalinks carry their true publication date.
  const newsRoutes: MetadataRoute.Sitemap = news.map((n) => ({
    url: `${SITE_URL}/news/${n.meta.slug}`,
    lastModified: new Date(`${n.meta.date}T12:00:00Z`),
  }));

  return [
    ...staticRoutes,
    ...projectPages,
    ...experiencePages,
    ...leadershipPages,
    ...newsRoutes,
  ];
}
