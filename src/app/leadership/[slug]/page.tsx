import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/site";
import {
  getLeadershipWithPages,
  getProject,
  leadershipHasPage,
} from "@/lib/content";
import { formatPeriod } from "@/lib/format";
import { DetailArticle } from "@/components/DetailArticle";
import { ArticleJsonLd } from "@/components/ArticleJsonLd";
import { externalRow } from "@/components/metaRows";

// Leadership write-ups live on their own route rather than under /projects:
// founding an organization is not a project, and putting it in that sequence
// would make it the "up next" card after a compiler. Only entries that opt in
// with `detail: true` get a page (see leadershipHasPage).
export function generateStaticParams() {
  return getLeadershipWithPages().map((p) => ({ slug: p.meta.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getProject(slug);
  if (!entry) return {};
  return pageMetadata({
    title: entry.meta.title,
    description: entry.meta.summary,
    path: `/leadership/${slug}`,
    publishedTime: `${entry.meta.period.start}-01`,
  });
}

export default async function LeadershipDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getProject(slug);
  if (!entry || !leadershipHasPage(entry.meta)) notFound();

  const { meta, body } = entry;

  const metaRows = [
    ...(meta.role ? [{ label: "Role", value: meta.role }] : []),
    {
      label: "Period",
      value: formatPeriod({ start: meta.period.start, end: meta.period.end }),
    },
    // The organization's own public account. It is the evidence for this
    // page's closing claim that the club outlasted the term, which is
    // otherwise just an assertion by the person making it.
    ...externalRow("Instagram", meta.links?.instagram),
    ...externalRow("Site", meta.links?.demo),
  ];

  return (
    <>
      <ArticleJsonLd
        title={meta.title}
        description={meta.summary}
        path={`/leadership/${slug}`}
        sectionName="Leadership"
        sectionPath="/leadership"
      />
      <DetailArticle
        eyebrow="Leadership"
        title={meta.title}
        meta={metaRows}
        backHref="/leadership"
        backLabel="Leadership"
        body={body}
      />
    </>
  );
}
