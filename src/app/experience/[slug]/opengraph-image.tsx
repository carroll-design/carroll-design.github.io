import { getExperienceItem, getExperienceWithPages } from "@/lib/content";
import { articleCard, OG_SIZE } from "@/lib/og-card";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getExperienceWithPages().map((e) => ({ slug: e.meta.slug }));
}

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Professional experience by Cameron Carroll";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const experience = getExperienceItem(slug);
  return articleCard({
    eyebrow: "Professional Experience",
    title: experience?.meta.title ?? "Professional Experience",
  });
}
