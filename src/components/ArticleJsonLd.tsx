import { getSite } from "@/lib/content";
import { SITE_URL, absoluteUrl } from "@/lib/site";
import { JsonLd } from "./JsonLd";

// schema.org TechArticle + BreadcrumbList for the flagship write-ups, so
// search engines understand both the article and where it sits in the site.
export function ArticleJsonLd({
  title,
  description,
  path,
  sectionName,
  sectionPath,
}: {
  title: string;
  description: string;
  path: string;
  sectionName: string;
  sectionPath: string;
}) {
  const site = getSite().meta;
  const url = absoluteUrl(path);
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: title,
        description,
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
            name: sectionName,
            item: absoluteUrl(sectionPath),
          },
          { "@type": "ListItem", position: 3, name: title },
        ],
      },
    ],
  };
  return <JsonLd data={data} />;
}
