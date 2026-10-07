import { z } from "zod";

/**
 * Frontmatter schemas for everything under /content.
 * Validation runs at build time; a bad field fails `next build` with the
 * offending file and field named (see src/lib/content.ts).
 */

const yearMonth = z
  .string()
  .regex(/^\d{4}-\d{2}$/, "expected YYYY-MM (e.g. 2025-09)");

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "expected YYYY-MM-DD");

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "expected kebab-case slug");

// content/site.mdx, singleton. Body: site introduction (MDX).
export const siteSchema = z.object({
  name: z.string().min(1),
  // Small-caps identity line above the name (degree · affiliation).
  eyebrow: z.string().min(1).optional(),
  // One-line availability signal (e.g. "Seeking PhD positions, Fall 20XX").
  availability: z.string().min(1).optional(),
  tagline: z.string().min(1),
  email: z.email(),
  location: z.string().min(1),
  links: z.object({
    github: z.url(),
    linkedin: z.url(),
    scholar: z.url().optional(),
    orcid: z.url().optional(),
  }),
  resumePdf: z
    .string()
    .startsWith("/", "path under /public, e.g. /resume/file.pdf"),
});
export type Site = z.infer<typeof siteSchema>;

// content/publications/*.mdx, frontmatter only.
export const publicationSchema = z.object({
  authors: z.array(z.string().min(1)).min(1),
  title: z.string().min(1),
  venue: z.string().min(1),
  year: z.number().int(),
  type: z.enum(["poster", "paper", "abstract", "talk"]),
  status: z.enum(["accepted", "published", "in-review"]),
  href: z.url().optional(),
});
export type Publication = z.infer<typeof publicationSchema>;

// content/projects/*.mdx, body required when a detail page is enabled.
export const projectSchema = z
  .object({
    title: z.string().min(1),
    slug,
    role: z.string().min(1).optional(),
    period: z.object({
      start: yearMonth,
      end: z.union([yearMonth, z.literal("present")]).optional(),
    }),
    summary: z.string().min(1),
    coverImage: z.string().startsWith("/", "path under /public").optional(),
    cardSkills: z.array(z.string().min(1)).default([]),
    skills: z.array(z.string().min(1)).default([]),
    award: z.string().min(1).optional(),
    context: z.string().min(1).optional(), // e.g. "Built at a hackathon"
    links: z
      .object({
        github: z.url().optional(),
        demo: z.url().optional(),
        // Public account for an organization, used by leadership entries. Its
        // own field rather than reusing `demo`, which renders as "Live site"
        // and would mislabel a social account.
        instagram: z.url().optional(),
      })
      .optional(),
    flagship: z.boolean().default(false),
    order: z.number().int().nonnegative(),
    featured: z.boolean(),
    // Opt a project into its own page at /projects/<slug>. Flagship work always
    // has one; other projects get one when the body is worth the click.
    detail: z.boolean().default(false),
    // Where non-flagship work came from; /projects groups these cards by origin.
    origin: z.enum(["course", "hackathon", "independent"]).optional(),
  })
  .refine((p) => p.flagship || p.origin !== undefined, {
    // Without this the failure is silent and nasty: a project missing an origin
    // matches no group on /projects and simply does not render, with nothing
    // anywhere saying so. Fail the build instead.
    path: ["origin"],
    message:
      'non-flagship projects require an origin ("course", "hackathon", "independent"), ' +
      "because /projects groups cards by it and an unmatched project " +
      "renders in no section at all",
  });
export type Project = z.infer<typeof projectSchema>;

// content/leadership/*.mdx, separate from project entries.
export const leadershipSchema = z.object({
  title: z.string().min(1),
  slug,
  role: z.string().min(1).optional(),
  period: z.object({
    start: yearMonth,
    end: z.union([yearMonth, z.literal("present")]).optional(),
  }),
  summary: z.string().min(1),
  coverImage: z.string().startsWith("/", "path under /public").optional(),
  links: z
    .object({
      demo: z.url().optional(),
      instagram: z.url().optional(),
    })
    .optional(),
  order: z.number().int().nonnegative(),
  detail: z.boolean().default(false),
});
export type Leadership = z.infer<typeof leadershipSchema>;

// content/experience/*.mdx, body rendered at /experience/[slug].
export const experienceSchema = z.object({
  title: z.string().min(1),
  slug,
  role: z.string().min(1).optional(),
  period: z.object({
    start: yearMonth,
    end: z.union([yearMonth, z.literal("present")]).optional(),
  }),
  summary: z.string().min(1),
  coverImage: z.string().startsWith("/", "path under /public").optional(),
  cardSkills: z.array(z.string().min(1)).default([]),
  skills: z.array(z.string().min(1)).default([]),
  award: z.string().min(1).optional(),
  context: z.string().min(1).optional(),
  links: z
    .object({
      github: z.url().optional(),
      demo: z.url().optional(),
    })
    .optional(),
  order: z.number().int().nonnegative(),
  detail: z.boolean().default(false),
});
export type Experience = z.infer<typeof experienceSchema>;

// content/resume.mdx, singleton. Body: the HTML resume facts (education, summary).
export const resumeSchema = z.object({
  // YYYY-MM, not free text: the page runs it through formatMonthLong, and a
  // string Date cannot parse renders a literal "Invalid Date" on the page.
  updated: yearMonth.optional(),
});
export type Resume = z.infer<typeof resumeSchema>;

// content/news/*.md, one item per file, sorted by date desc. The body
// (optional) is the story shown on the item's own page at /news/[slug];
// href points at related work and renders there as a "Related" link.
export const newsItemSchema = z.object({
  date: isoDate,
  slug,
  text: z.string().min(1),
  href: z.string().min(1).optional(), // related resource: internal path or external URL
  linkLabel: z.string().min(1).optional(), // label for the related link
  // Press that covered the item. Structured rather than prose so the outlets
  // can surface on the list row and as their own block on the item page,
  // instead of hiding in a trailing sentence only click-through readers see.
  coverage: z
    .array(
      z.object({
        outlet: z.string().min(1),
        href: z.url(),
      }),
    )
    .default([]),
});
export type NewsItem = z.infer<typeof newsItemSchema>;
