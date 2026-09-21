import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { getNews } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { NewsList } from "@/components/NewsList";

export const metadata: Metadata = pageMetadata({
  title: "News",
  description: "Milestones and updates: research, awards, and events.",
  path: "/news",
});

export default function NewsPage() {
  const news = getNews();

  // Group by year, newest first (getNews is already date-desc).
  const byYear = new Map<string, typeof news>();
  for (const item of news) {
    const year = item.meta.date.slice(0, 4);
    const bucket = byYear.get(year);
    if (bucket) bucket.push(item);
    else byYear.set(year, [item]);
  }

  return (
    <>
      <PageHeader title="News" lead="Milestones and updates, newest first." />
      {[...byYear.entries()].map(([year, items]) => (
        <Reveal key={year}>
          <Section className="py-6">
            <SectionHeading title={year} />
            <div className="sd-rise">
              <NewsList items={items} />
            </div>
          </Section>
        </Reveal>
      ))}
    </>
  );
}
