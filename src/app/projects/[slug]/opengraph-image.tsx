import { getProject, getProjectsWithPages } from "@/lib/content";
import { articleCard, OG_SIZE } from "@/lib/og-card";

// Per-write-up OG card: the project title on the brand print-mat frame.

export const dynamic = "force-static";

// Required alongside `output: export`, same params as the page route.
export function generateStaticParams() {
  return getProjectsWithPages().map((p) => ({ slug: p.meta.slug }));
}

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Engineering write-up by Cameron Carroll";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  return articleCard({
    eyebrow: "Engineering",
    title: project?.meta.title ?? "Projects",
  });
}
