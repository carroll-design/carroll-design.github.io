import { getNews, getSite } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

// RSS 2.0 feed for the News stream, prerendered to a static file at build
// time (PLAN §2: everything ships static). Items come from /content/news.

export const dynamic = "force-static";

function esc(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function GET() {
  const site = getSite().meta;
  const news = getNews();
  const items = news
    .map(({ meta, body }) => {
      // Every item has its own page; the permalink doubles as the guid.
      const link = `${SITE_URL}/news/${meta.slug}`;
      // Description: the story body when one exists, else the headline, so
      // readers that render only descriptions never show an empty item.
      const description = body || meta.text;
      return [
        "    <item>",
        `      <title>${esc(meta.text)}</title>`,
        `      <link>${esc(link)}</link>`,
        `      <guid isPermaLink="true">${esc(link)}</guid>`,
        `      <description>${esc(description)}</description>`,
        `      <pubDate>${new Date(`${meta.date}T12:00:00Z`).toUTCString()}</pubDate>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  // Newest item's date; getNews() is sorted date-desc.
  const lastBuildDate = news.length
    ? new Date(`${news[0].meta.date}T12:00:00Z`).toUTCString()
    : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.name)} · News</title>
    <link>${SITE_URL}/news</link>
    <description>Milestones and updates from ${esc(site.name)}: research, awards, and events.</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
