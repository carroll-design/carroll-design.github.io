import {
  getNews,
  getExperience,
  getOtherExperience,
  getProjects,
  getPublications,
  getSite,
} from "@/lib/content";
import { SITE_URL } from "@/lib/site";

// /llms.txt, agent-readable site summary per the llmstxt.org convention.
// Generated from the content layer at build time so it can never drift from
// the pages (PLAN: content lives in /content, never in code).

export const dynamic = "force-static";

export function GET() {
  const site = getSite();
  const projects = getProjects();
  const experience = getExperience();
  const otherExperience = getOtherExperience();
  const flagships = projects.filter((p) => p.meta.tier === "flagship");
  const regular = projects.filter((p) => p.meta.tier === "project");
  const leadership = projects.filter((p) => p.meta.tier === "leadership");
  const publications = getPublications();
  const news = getNews();

  const lines: string[] = [
    `# ${site.meta.name}`,
    "",
    `> ${site.meta.tagline}`,
    "",
    site.body,
    "",
    ...(publications.length > 0
      ? [
          "",
          "## Publications & presentations",
          "",
          ...publications.map(
            ({ meta }) =>
              `- ${meta.authors.join("; ")}. ${meta.title}. ${meta.venue}, ${meta.year}. (${meta.type}, ${meta.status})`,
          ),
        ]
      : []),
    "",
    "## Engineering",
    "",
    ...flagships.map(
      ({ meta }) =>
        `- [${meta.title}](${SITE_URL}/projects/${meta.slug}): ${meta.summary}`,
    ),
    ...regular.map(
      ({ meta }) => `- ${meta.title} (${SITE_URL}/projects): ${meta.summary}`,
    ),
    "",
    "## Professional Experience",
    "",
    ...experience.map(
      ({ meta }) =>
        `- [${meta.title}](${SITE_URL}/experience/${meta.slug}): ${meta.summary}`,
    ),
    ...otherExperience.map(
      ({ meta }) =>
        `- [${meta.title}](${SITE_URL}/experience/${meta.slug}): ${meta.summary}`,
    ),
    "",
    "## Leadership & community",
    "",
    ...leadership.map(
      ({ meta }) =>
        `- ${meta.role ? `${meta.role}, ` : ""}${meta.title} (${SITE_URL}/leadership): ${meta.summary}`,
    ),
    "",
    "## News",
    "",
    ...news.map(
      ({ meta }) =>
        `- ${meta.date}: [${meta.text}](${SITE_URL}/news/${meta.slug})`,
    ),
    "",
    "## Contact",
    "",
    `- Website: ${SITE_URL}`,
    `- GitHub: ${site.meta.links.github}`,
    `- LinkedIn: ${site.meta.links.linkedin}`,
    `- Resume: ${SITE_URL}/resume`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
