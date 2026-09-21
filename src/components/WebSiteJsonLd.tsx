import { SITE_NAME, SITE_URL } from "@/lib/site";
import { JsonLd } from "./JsonLd";

// schema.org WebSite for the home page. This is what Google reads to choose
// the site name printed above the URL in a search result
// (developers.google.com/search/docs/appearance/site-names). Without it the
// bare domain is the fallback, which is why results read "carroll-design.github.io"
// rather than "Cameron Carroll".
//
// Three constraints worth knowing before moving this file:
//   - it only counts on the home page of a root domain, not on subpages;
//   - <title> and og:site_name are secondary signals that should agree with
//     it, and here all three resolve from SITE_NAME so they cannot drift;
//   - it is a hint, not a directive. Google may still show something else.
//
// Separate from PersonJsonLd because they are different entities: the Person
// is who the site is about, the WebSite is the publication itself.
export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  };
  return <JsonLd data={data} />;
}
