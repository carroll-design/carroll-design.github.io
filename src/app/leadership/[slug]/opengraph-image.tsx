import { getLeadershipWithPages, getProject } from "@/lib/content";
import { articleCard, OG_SIZE } from "@/lib/og-card";

// Per-entry OG card for leadership write-ups, on the same print-mat frame as
// the project and research cards.

export const dynamic = "force-static";

// Required alongside `output: export`, same params as the page route.
export function generateStaticParams() {
  return getLeadershipWithPages().map((p) => ({ slug: p.meta.slug }));
}

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Leadership write-up by Cameron Carroll";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getProject(slug);
  return articleCard({
    eyebrow: "Leadership",
    title: entry?.meta.title ?? "Leadership",
  });
}
