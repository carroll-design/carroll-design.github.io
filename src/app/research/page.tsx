import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { getPublications, getResearchThreads, getSite } from "@/lib/content";
import { formatPeriod } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { FlagshipCard } from "@/components/FlagshipCard";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { PublicationList } from "@/components/PublicationList";
import { OrcidIcon } from "@/components/icons";

export const metadata: Metadata = pageMetadata({
  title: "Research",
  description:
    "Research and academic presentations from Cameron Carroll, aerospace and mechanical engineering, NMSU.",
  path: "/research",
});

export default function ResearchPage() {
  const threads = getResearchThreads();
  const publications = getPublications();
  const site = getSite().meta;

  return (
    <>
      <PageHeader
        title="Research"
        lead="Academic research and presentations will be listed here as they develop."
      />

      {/* Two numbered sections of equal weight. Publications used to sit at
          the bottom under a small unnumbered heading, below a full-width card,
          which read as an appendix: for an academic reader the citations are
          half of what this page is for. Numbering both makes them peers. */}
      <Section className="py-4">
        <SectionHeading index="01" title="Research" />
        <div className="sd-cards grid gap-5">
          {threads.map((t) => (
            <FlagshipCard
              key={t.meta.slug}
              href={`/research/${t.meta.slug}`}
              // Not "Research": on this page that word already appears as the
              // page title and the section heading directly above, so the card
              // said it a third time and carried no information. The thread's
              // standing (senior thesis) is what a reader does not already
              // know. On the homepage the eyebrow stays "Research", where it
              // is doing real work distinguishing the card from "Engineering".
              eyebrow="Senior thesis"
              title={t.meta.title}
              metaLine={`${t.meta.org} · ${formatPeriod(t.meta.period)}`}
              summary={t.meta.summary}
              chips={t.meta.methods}
              chipsLabel="Methods"
            />
          ))}
        </div>
      </Section>

      {publications.length > 0 && (
        <Reveal>
          {/* id so /research#publications is a stable deep link: the homepage
              block and any external reference point here. */}
          <Section id="publications" className="scroll-mt-24 py-12">
            <SectionHeading index="02" title="Publications & Presentations" />
            <div className="sd-rise">
              <PublicationList publications={publications} />
              {/* The full iD with its mark, per ORCID's display guidelines.
                  This is where it earns its place: a reader who just looked at
                  a citation is exactly the one who wants the full record. */}
              {site.links.orcid && (
                <a
                  href={site.links.orcid}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="link-external mt-8 inline-flex items-center gap-2 text-sm text-ink-muted transition-colors duration-[--duration-fast] hover:text-accent"
                >
                  <OrcidIcon className="h-4 w-4 shrink-0" />
                  <span className="tabular-nums">
                    {site.links.orcid.replace(/^https?:\/\//, "")}
                  </span>
                  <span aria-hidden="true" className="link-arrow text-accent">
                    ↗
                  </span>
                </a>
              )}
            </div>
          </Section>
        </Reveal>
      )}
    </>
  );
}
