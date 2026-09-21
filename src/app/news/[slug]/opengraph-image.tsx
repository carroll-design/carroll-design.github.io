import { getNews, getNewsItem } from "@/lib/content";
import { articleCard, OG_SIZE } from "@/lib/og-card";

// Per-item OG card so news permalinks shared on LinkedIn/X/Slack get the
// headline on the brand print-mat frame instead of the generic site card.

export const dynamic = "force-static";

// Required alongside `output: export`, same params as the page route.
export function generateStaticParams() {
  return getNews().map((n) => ({ slug: n.meta.slug }));
}

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "News from Cameron Carroll";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getNewsItem(slug);
  return articleCard({
    eyebrow: "News",
    title: item?.meta.text ?? "News",
  });
}
