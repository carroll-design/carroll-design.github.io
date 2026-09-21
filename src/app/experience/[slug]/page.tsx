import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/site";
import {
  experienceHasPage,
  getExperienceItem,
  getExperienceWithPages,
} from "@/lib/content";
import { formatPeriod } from "@/lib/format";
import { DetailArticle } from "@/components/DetailArticle";
import { ArticleJsonLd } from "@/components/ArticleJsonLd";
import { externalRow } from "@/components/metaRows";

export function generateStaticParams() {
  return getExperienceWithPages().map((e) => ({ slug: e.meta.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const experience = getExperienceItem(slug);
  if (!experience) return {};
  return pageMetadata({
    title: experience.meta.title,
    description: experience.meta.summary,
    path: `/experience/${slug}`,
    publishedTime: `${experience.meta.period.start}-01`,
  });
}

export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const experience = getExperienceItem(slug);
  if (!experience || !experienceHasPage(experience.meta)) notFound();

  const { meta, body } = experience;
  const withPages = getExperienceWithPages();
  const here = withPages.findIndex((e) => e.meta.slug === slug);
  const following = here >= 0 ? withPages[here + 1] : undefined;
  const next = following
    ? {
        href: `/experience/${following.meta.slug}`,
        eyebrow: "Professional Experience",
        title: following.meta.title,
      }
    : undefined;
  const metaRows = [
    ...(meta.role ? [{ label: "Role", value: meta.role }] : []),
    { label: "Period", value: formatPeriod(meta.period) },
    ...externalRow("Live site", meta.links?.demo),
    ...externalRow("Repository", meta.links?.github),
  ];

  return (
    <>
      <ArticleJsonLd
        title={meta.title}
        description={meta.summary}
        path={`/experience/${slug}`}
        sectionName="Professional Experience"
        sectionPath="/experience"
      />
      <DetailArticle
        eyebrow="Professional Experience"
        title={meta.title}
        meta={metaRows}
        chips={meta.skills}
        chipsLabel="Skills"
        backHref="/experience"
        backLabel="Professional Experience"
        body={body}
        next={next}
      />
    </>
  );
}
