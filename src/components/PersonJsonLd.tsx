import { getSite } from "@/lib/content";
import { SITE_URL, absoluteUrl } from "@/lib/site";
import { JsonLd } from "./JsonLd";

// schema.org Person for the home page. Helps search engines and knowledge
// panels resolve who this is. Email is deliberately omitted (PLAN §2.5).
export function PersonJsonLd() {
  const site = getSite().meta;
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: SITE_URL,
    description: site.tagline,
    image: absoluteUrl("/images/headshot-1280.webp"),
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "New Mexico State University",
    },
    sameAs: [
      site.links.github,
      site.links.linkedin,
      site.links.scholar,
      site.links.orcid,
    ].filter(Boolean),
    knowsAbout: [
      "Machine Learning",
      "Deep Learning",
      "Applied Artificial Intelligence",
      "Software Engineering",
    ],
  };
  return <JsonLd data={data} />;
}
