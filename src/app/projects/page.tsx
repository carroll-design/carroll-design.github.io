import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { getProjects } from "@/lib/content";
import { formatPeriod } from "@/lib/format";
import type { Project } from "@/content/schema";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { FlagshipCard } from "@/components/FlagshipCard";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { ProjectCard } from "@/components/ProjectCard";

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description:
    "Software engineering and projects: ELSA for NASA's Planetary Data System, plus hackathon and coursework builds.",
  path: "/projects",
});

// Project-tier cards are grouped by where the work came from, so a reader can
// tell a weekend build from a semester of coursework without reading five
// cards to find out. Hackathon and independent share a section: both are work
// chosen rather than assigned, and independent has no entries yet, so its own
// heading would render empty.
//
// Order is deliberate. The hackathon group leads because it is the strongest
// single card (an award, and a full-width spotlight), and coursework follows
// as a block.
const GROUPS: { title: string; origins: readonly Project["origin"][] }[] = [
  {
    title: "More projects",
    origins: ["hackathon", "independent"],
  },
  { title: "Course projects", origins: ["course"] },
];

export default function ProjectsPage() {
  const projects = getProjects();
  const flagship = projects.filter((p) => p.meta.tier === "flagship");
  const regular = projects.filter((p) => p.meta.tier === "project");

  const grouped = GROUPS.map((group) => ({
    ...group,
    items: regular.filter((p) => group.origins.includes(p.meta.origin)),
  }));

  // The schema guarantees every displayed project-tier entry has an origin,
  // but not that GROUPS covers it. Professional entries are displayed on the
  // dedicated /experience page instead. Fail the build for any other orphan.
  const placed = new Set(
    grouped.flatMap((g) => g.items.map((i) => i.meta.slug)),
  );
  const orphans = regular.filter((p) => !placed.has(p.meta.slug));
  if (orphans.length > 0) {
    throw new Error(
      `/projects: no group matches origin for ${orphans
        .map((p) => `${p.meta.slug} (origin: ${p.meta.origin})`)
        .join(", ")}. Add the origin to GROUPS in src/app/projects/page.tsx.`,
    );
  }

  return (
    <>
      <PageHeader
        title="Projects"
        lead="Everything from design, fabrication, and implementation to analysis and technical research."
      />

      {flagship.length > 0 && (
        <Section className="py-4">
          <SectionHeading title="Selected work" />
          <div className="sd-cards grid gap-5">
            {flagship.map((p) => (
              <FlagshipCard
                key={p.meta.slug}
                href={`/projects/${p.meta.slug}`}
                eyebrow="Flagship"
                title={p.meta.title}
                metaLine={`${p.meta.role ?? "Software"} · ${formatPeriod(p.meta.period)}`}
                summary={p.meta.summary}
                chips={p.meta.cardSkills}
                chipsLabel="Skills"
                coverImage={p.meta.coverImage}
              />
            ))}
          </div>
        </Section>
      )}

      {grouped.map(
        (group) =>
          group.items.length > 0 && (
            <Reveal key={group.title}>
              <Section className="py-8">
                <SectionHeading title={group.title} />
                <div className="sd-cards card-grid grid gap-5 sm:grid-cols-2">
                  {group.items.map((p) => (
                    <ProjectCard
                      key={p.meta.slug}
                      project={p.meta}
                      // A lone card would otherwise sit half-width beside an
                      // empty column.
                      spotlight={group.items.length === 1}
                    />
                  ))}
                </div>
              </Section>
            </Reveal>
          ),
      )}
    </>
  );
}
