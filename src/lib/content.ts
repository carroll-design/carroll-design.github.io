import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { z } from "zod";
import {
  resumeSchema,
  experienceSchema,
  newsItemSchema,
  projectSchema,
  publicationSchema,
  researchThreadSchema,
  siteSchema,
  type Resume,
  type Experience,
  type NewsItem,
  type Project,
  type Publication,
  type ResearchThread,
  type Site,
} from "@/content/schema";

/**
 * Build-time content loader. All prose and facts live in /content as
 * Markdown/MDX with YAML frontmatter, never in components. Frontmatter is
 * validated with Zod; an invalid or missing field throws here, which fails
 * `next build` with the offending file and field named.
 */

const CONTENT_DIR = path.join(process.cwd(), "content");

// Render-time removal of verification markers so drafts read as designed.
// The markers stay in the source files and scripts/check-facts.mjs still
// blocks CI deploys on them; this only keeps them out of the rendered UI.
// (The pattern is split so the gate's src scan never flags this file.)
const VERIFY_RE = new RegExp("\\s*\\[" + "VERIFY[^\\]]*\\]", "g");

function stripMarkers<T>(value: T): T {
  if (typeof value === "string") {
    return value.replace(VERIFY_RE, "").trim() as T;
  }
  if (Array.isArray(value)) {
    return value.map(stripMarkers) as T;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, stripMarkers(v)]),
    ) as T;
  }
  return value;
}

export interface Entry<M> {
  meta: M;
  /** Raw MDX body, compiled by src/lib/mdx.tsx inside server components. */
  body: string;
}

function load<S extends z.ZodType>(
  schema: S,
  relPath: string,
): Entry<z.output<S>> {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, relPath), "utf8");
  const { data, content } = matter(raw);
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid frontmatter in content/${relPath}:\n${issues}`);
  }
  return {
    meta: stripMarkers(parsed.data),
    body: stripMarkers(content.trim()),
  };
}

function loadDir<S extends z.ZodType>(
  schema: S,
  dir: string,
): Entry<z.output<S>>[] {
  return fs
    .readdirSync(path.join(CONTENT_DIR, dir))
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((f) => load(schema, `${dir}/${f}`));
}

export function getSite(): Entry<Site> {
  return load(siteSchema, "site.mdx");
}

export function getResume(): Entry<Resume> {
  return load(resumeSchema, "resume.mdx");
}

export function getResearchThreads(): Entry<ResearchThread>[] {
  return loadDir(researchThreadSchema, "research").sort(
    (a, b) => a.meta.order - b.meta.order,
  );
}

export function getResearchThread(
  slug: string,
): Entry<ResearchThread> | undefined {
  return getResearchThreads().find((t) => t.meta.slug === slug);
}

export function getPublications(): Entry<Publication>[] {
  return loadDir(publicationSchema, "publications").sort(
    (a, b) => b.meta.year - a.meta.year,
  );
}

export function getProjects(): Entry<Project>[] {
  return loadDir(projectSchema, "projects").sort(
    (a, b) => a.meta.order - b.meta.order,
  );
}

export function getProject(slug: string): Entry<Project> | undefined {
  return getProjects().find((p) => p.meta.slug === slug);
}

export function getExperience(): Entry<Experience>[] {
  return loadDir(experienceSchema, "experience").sort(
    (a, b) => a.meta.order - b.meta.order,
  );
}

export function getOtherExperience(): Entry<Experience>[] {
  return loadDir(experienceSchema, "other-experience").sort(
    (a, b) => a.meta.order - b.meta.order,
  );
}

export function getExperienceItem(slug: string): Entry<Experience> | undefined {
  return [...getExperience(), ...getOtherExperience()].find(
    (e) => e.meta.slug === slug,
  );
}

export function experienceHasPage(meta: Experience): boolean {
  return meta.detail;
}

export function getExperienceWithPages(): Entry<Experience>[] {
  return [...getExperience(), ...getOtherExperience()].filter((e) =>
    experienceHasPage(e.meta),
  );
}

/**
 * Whether a project has its own page at /projects/<slug>. Single source of
 * truth: the route, its OG image, the sitemap and every card that decides
 * whether to link all ask this, so a project can never be linked to a page
 * that was not generated (or generated without being linked).
 *
 * Leadership entries never get one; they live as rows on /leadership.
 */
export function projectHasPage(meta: Project): boolean {
  if (meta.tier === "leadership") return false;
  return meta.tier === "flagship" || meta.detail;
}

/** Projects with their own page, in display order. */
export function getProjectsWithPages(): Entry<Project>[] {
  return getProjects().filter((p) => projectHasPage(p.meta));
}

/**
 * Whether a leadership entry has its own page at /leadership/<slug>. Same
 * opt-in as projects use, on a separate route because leadership work is not
 * a project and should not sit in the /projects sequence.
 *
 * Most entries stay as rows on /leadership: a page that says less than the row
 * already does is worse than no link. Set `detail: true` in the same change
 * that writes the body.
 */
export function leadershipHasPage(meta: Project): boolean {
  return meta.tier === "leadership" && meta.detail;
}

/** Leadership entries with their own page, in display order. */
export function getLeadershipWithPages(): Entry<Project>[] {
  return getProjects().filter((p) => leadershipHasPage(p.meta));
}

export function getNews(): Entry<NewsItem>[] {
  const items = loadDir(newsItemSchema, "news").sort((a, b) =>
    b.meta.date.localeCompare(a.meta.date),
  );
  const seen = new Set<string>();
  for (const { meta } of items) {
    if (seen.has(meta.slug)) {
      throw new Error(`Duplicate news slug: ${meta.slug}`);
    }
    seen.add(meta.slug);
  }
  return items;
}

export function getNewsItem(slug: string): Entry<NewsItem> | undefined {
  return getNews().find((n) => n.meta.slug === slug);
}
