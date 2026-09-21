import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { getProjects } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { LeadershipList } from "@/components/LeadershipList";

export const metadata: Metadata = pageMetadata({
  title: "Leadership",
  description:
    "Leadership and community: founding the CS Student Association, launching hackNMSU, and service across NMSU.",
  path: "/leadership",
});

export default function LeadershipPage() {
  const leadership = getProjects().filter((p) => p.meta.tier === "leadership");

  return (
    <>
      <PageHeader
        title="Leadership & Community"
        lead="Building more than just projects: leading teams, strengthening communities, and creating opportunities."
      />
      <Reveal>
        <Section className="py-4">
          <div className="sd-rise">
            <LeadershipList items={leadership} />
          </div>
        </Section>
      </Reveal>
    </>
  );
}
