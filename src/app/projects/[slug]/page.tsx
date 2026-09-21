import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/site";
import {
  getProject,
  getProjectsWithPages,
  getResearchThreads,
  projectHasPage,
} from "@/lib/content";
import { formatPeriod } from "@/lib/format";
import { DetailArticle } from "@/components/DetailArticle";
import { ArticleJsonLd } from "@/components/ArticleJsonLd";
import { externalRow } from "@/components/metaRows";

// Detail pages exist for flagship work and for any project that has opted in
// (see projectHasPage). Gated on the content being worth the click, not on
// tier, so pages appear as each project's write-up is finished.
export function generateStaticParams() {
  return getProjectsWithPages().map((p) => ({ slug: p.meta.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return pageMetadata({
    title: project.meta.title,
    description: project.meta.summary,
    path: `/projects/${slug}`,
    publishedTime: `${project.meta.period.start}-01`,
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || !projectHasPage(project.meta)) notFound();

  const { meta, body } = project;

  // Onward link: the next project that has a page, in display order.
  // Deliberately does not wrap. It used to cycle with a modulo, so the last
  // project sent the reader back to the first with nothing signalling they had
  // come full circle, and projects were the only place the sequence could go.
  // Running off the end now hands over to the research thread instead, so the
  // path always moves forward and eventually leaves the section.
  const withPages = getProjectsWithPages();
  const here = withPages.findIndex((p) => p.meta.slug === slug);
  const following = here >= 0 ? withPages[here + 1] : undefined;
  const featuredThread = getResearchThreads().find((t) => t.meta.featured);
  const next = following
    ? {
        href: `/projects/${following.meta.slug}`,
        eyebrow: following.meta.tier === "flagship" ? "Engineering" : "Project",
        title: following.meta.title,
      }
    : featuredThread
      ? {
          href: `/research/${featuredThread.meta.slug}`,
          eyebrow: "Research",
          title: featuredThread.meta.title,
        }
      : undefined;

  const metaRows = [
    ...(meta.role ? [{ label: "Role", value: meta.role }] : []),
    {
      label: "Period",
      value: formatPeriod({ start: meta.period.start, end: meta.period.end }),
    },
    // The award was rendering on the card but not here, so the page dedicated
    // to a project was the one place its headline credential was missing.
    ...(meta.award ? [{ label: "Award", value: meta.award }] : []),
    // External destinations. Shown as host and path rather than a bare URL,
    // reusing the site-wide external-link arrow. The repository was reachable
    // from the card but not from the page, which is backwards.
    ...externalRow("Live site", meta.links?.demo),
    ...externalRow("Repository", meta.links?.github),
  ];

  return (
    <>
      <ArticleJsonLd
        title={meta.title}
        description={meta.summary}
        path={`/projects/${slug}`}
        sectionName="Projects"
        sectionPath="/projects"
      />
      <DetailArticle
        eyebrow="Engineering"
        title={meta.title}
        meta={metaRows}
        chips={meta.skills}
        chipsLabel="Skills"
        backHref="/projects"
        backLabel="Projects"
        body={body}
        next={next}
      />
    </>
  );
}
