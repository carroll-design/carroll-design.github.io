import { getSite } from "@/lib/content";
import { SITE_URL, absoluteUrl } from "@/lib/site";
import { JsonLd } from "./JsonLd";

// schema.org NewsArticle + BreadcrumbList for /news/[slug] permalinks, the
// same treatment the flagship write-ups get from ArticleJsonLd.
export function NewsJsonLd({
  headline,
  date,
  path,
}: {
  headline: string;
  date: string;
  path: string;
}) {
  const site = getSite().meta;
  const url = absoluteUrl(path);
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsArticle",
        headline,
        datePublished: date,
        url,
        mainEntityOfPage: url,
        author: {
          "@type": "Person",
          name: site.name,
          url: SITE_URL,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "News",
            item: absoluteUrl("/news"),
          },
          { "@type": "ListItem", position: 3, name: headline },
        ],
      },
    ],
  };
  return <JsonLd data={data} />;
}
