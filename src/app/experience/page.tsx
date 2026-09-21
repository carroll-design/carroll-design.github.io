import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { getExperience, getOtherExperience } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { ProjectCard } from "@/components/ProjectCard";

export const metadata: Metadata = pageMetadata({
  title: "Professional Experience",
  description:
    "Professional aerospace, mechanical engineering, and technical experience from Cameron Carroll.",
  path: "/experience",
});

export default function ExperiencePage() {
  const experience = getExperience();
  const otherExperience = getOtherExperience();

  return (
    <>
      <PageHeader
        title="Professional Experience"
        lead="Engineering internships and technical work across both aerospace and mechanical design, manufacturing, and testing."
      />

      <Reveal>
        <Section id="professional-experience" className="py-4">
          <SectionHeading index="01" title="Professional Experience" />
          <div className="sd-cards card-grid grid gap-5 sm:grid-cols-2">
            {experience.map((item) => (
              <ProjectCard
                key={item.meta.slug}
                project={item.meta}
                href={`/experience/${item.meta.slug}`}
              />
            ))}
          </div>
        </Section>
      </Reveal>

      {otherExperience.length > 0 && (
        <Reveal>
          <Section id="other-experience" className="py-8">
            <SectionHeading index="02" title="Other Experience" />
            <div className="sd-cards card-grid grid gap-5 sm:grid-cols-2">
              {otherExperience.map((item) => (
                <ProjectCard
                  key={item.meta.slug}
                  project={item.meta}
                  href={
                    item.meta.detail
                      ? `/experience/${item.meta.slug}`
                      : undefined
                  }
                />
              ))}
            </div>
          </Section>
        </Reveal>
      )}
    </>
  );
}
