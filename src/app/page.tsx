import Image from "next/image";
import Link from "next/link";
import {
  getNews,
  getExperience,
  getProject,
  getProjects,
  getPublications,
  getSite,
} from "@/lib/content";
import { Mdx } from "@/lib/mdx";
import { formatPeriod } from "@/lib/format";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { FlagshipCard } from "@/components/FlagshipCard";
import { ProjectCard } from "@/components/ProjectCard";
import { NewsList } from "@/components/NewsList";
import { PublicationList } from "@/components/PublicationList";
import { ObfuscatedEmail } from "@/components/ObfuscatedEmail";
import { PersonJsonLd } from "@/components/PersonJsonLd";
import { WebSiteJsonLd } from "@/components/WebSiteJsonLd";
import {
  FileIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
} from "@/components/icons";

const heroLink =
  "inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors duration-[--duration-fast] hover:text-accent";

export default function Home() {
  const site = getSite();
  const flagshipProject = getProject("rov");
  const featuredProjects = getProjects().filter(
    (p) => p.meta.featured && p.meta.tier === "project",
  );
  const professionalExperience = getExperience();
  const publications = getPublications();
  const news = getNews();

  return (
    <>
      <PersonJsonLd />
      <WebSiteJsonLd />

      {/* Hero (magazine plate): portrait anchors the left column (rotated
          photo-credit caption on its edge, scroll parallax), serif display
          text on the right, entrance stagger + signature accent stroke. */}
      <Section className="pt-16 pb-10 sm:pt-24">
        <div className="flex flex-col items-start gap-8 sm:grid sm:grid-cols-[auto_1fr] sm:items-center sm:gap-14 lg:gap-20">
          {/* Editorial portrait plate (replaced the arch crop 2026-07): a
              straight 4:5 print on a hairline mat, which is what the rest of
              the print language already assumes (place-print, --shadow-print,
              the matted frame in og-card.tsx). The arch's radius was half the
              frame width, so its curve cut into the head's silhouette. Color
              is graded rather than stripped: the old grayscale bloomed to
              full color on hover only, so touch visitors never saw it. */}
          <figure className="relative shrink-0 pl-5 sm:pl-6">
            <div className="sd-drift">
              <div className="place-print relative w-56 rounded-[6px] border border-line-strong bg-paper-raised p-2.5 shadow-[var(--shadow-print)] sm:w-64 lg:w-72 xl:w-80">
                <Image
                  src="/images/headshot-1280.webp"
                  alt="Portrait of Cameron Carroll"
                  width={1280}
                  height={1707}
                  priority
                  className="aspect-[4/5] w-full rounded-[2px] object-cover object-[50%_18%] [filter:saturate(0.9)_contrast(1.03)]"
                />
              </div>
            </div>
            <figcaption
              data-gsap="caption"
              className="absolute bottom-1 left-0 text-[10px] font-semibold tracking-[0.22em] text-ink-faint uppercase [writing-mode:vertical-rl] rotate-180"
            >
              {site.meta.location}
            </figcaption>
          </figure>

          <div className="stagger">
            {site.meta.eyebrow && (
              <p
                data-gsap="eyebrow"
                className="mb-3 text-xs font-semibold tracking-[0.16em] text-ink-muted uppercase"
              >
                {site.meta.eyebrow}
              </p>
            )}
            <h1 className="font-serif text-5xl font-medium tracking-tight text-balance text-ink-strong sm:text-6xl lg:text-7xl">
              <span data-gsap="name" className="inline-block whitespace-nowrap">
                {site.meta.name}
              </span>
              <span
                aria-hidden="true"
                className="draw-underline mt-3 block h-[3px] w-24 rounded-full bg-accent"
              />
            </h1>
            <p
              data-gsap="tagline"
              className="mt-5 max-w-[var(--measure-lead)] text-lg leading-relaxed text-pretty text-ink-muted"
            >
              {site.meta.tagline}
            </p>
            {site.meta.availability && (
              <p
                data-gsap="pill"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--accent)_35%,var(--line))] bg-accent-soft/60 px-3.5 py-1.5 text-sm font-medium text-accent-strong"
              >
                <span
                  aria-hidden="true"
                  className="h-2 w-2 shrink-0 rounded-full bg-accent"
                />
                {site.meta.availability}
              </p>
            )}
            <div
              data-gsap="links"
              className="mt-8 flex max-w-[var(--measure-lead)] flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-6"
            >
              <a
                href={site.meta.links.github}
                target="_blank"
                rel="me noopener noreferrer"
                className={heroLink}
              >
                <GitHubIcon />
                GitHub
              </a>
              <a
                href={site.meta.links.linkedin}
                target="_blank"
                rel="me noopener noreferrer"
                className={heroLink}
              >
                <LinkedInIcon />
                LinkedIn
              </a>
              <ObfuscatedEmail email={site.meta.email} className={heroLink}>
                <MailIcon />
                Email
              </ObfuscatedEmail>
              <Link href="/resume" className={heroLink}>
                <FileIcon />
                Resume
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Research interest: the 30-second scan target, set as a serif lead.
          Scroll signature: rises as it enters. Major beat: extra air. */}
      <Reveal>
        <Section className="py-14 sm:py-20">
          <div
            data-gsap="lead"
            className="sd-rise max-w-[var(--measure-lead)] font-serif text-[1.35rem] leading-[1.6] text-ink-strong [&_p]:mb-5 [&_p]:text-pretty last:[&_p]:mb-0"
          >
            <Mdx source={site.body} />
          </div>
        </Section>
      </Reveal>

      {/* Selected work is the loudest unit on the page. */}
      <Reveal>
        <Section className="py-14 sm:py-16">
          <SectionHeading index="01" title="Selected work" />
          <div className="sd-cards grid gap-5">
            {flagshipProject && (
              <FlagshipCard
                href={`/projects/${flagshipProject.meta.slug}`}
                eyebrow="Engineering"
                title={flagshipProject.meta.title}
                metaLine={`${flagshipProject.meta.role ?? "Engineering"} · ${formatPeriod(flagshipProject.meta.period)}`}
                summary={flagshipProject.meta.summary}
                chips={flagshipProject.meta.cardSkills}
                chipsLabel="Skills"
                coverImage={flagshipProject.meta.coverImage}
              />
            )}
          </div>
        </Section>
      </Reveal>

      {/* Professional experience follows Selected work so the homepage moves
          from highlighted work into the broader career history. */}
      {professionalExperience.length > 0 && (
        <Reveal>
          <Section className="py-12">
            <SectionHeading
              index="02"
              title="Professional Experience"
              action={
                <Link
                  href="/experience"
                  className="text-sm font-medium text-accent transition-colors duration-[--duration-fast] hover:text-accent-strong"
                >
                  All experience →
                </Link>
              }
            />
            <div className="sd-cards card-grid grid gap-5 sm:grid-cols-2">
              {professionalExperience.map((item) => (
                <ProjectCard
                  key={item.meta.slug}
                  project={item.meta}
                  href={`/experience/${item.meta.slug}`}
                />
              ))}
            </div>
          </Section>
        </Reveal>
      )}

      {/* Publications, directly under Professional Experience. */}
      {publications.length > 0 && (
        <Reveal>
          <Section className="py-12">
            <SectionHeading index="03" title="Publications & Presentations" />
            <div className="sd-rise">
              <PublicationList publications={publications} />
            </div>
          </Section>
        </Reveal>
      )}

      {/* Featured projects strip, same grammar as Selected work. */}
      {featuredProjects.length > 0 && (
        <Reveal>
          <Section className="py-12">
            <SectionHeading
              index="03"
              title="Projects"
              action={
                <Link
                  href="/projects"
                  className="text-sm font-medium text-accent transition-colors duration-[--duration-fast] hover:text-accent-strong"
                >
                  All projects →
                </Link>
              }
            />
            <div className="sd-cards card-grid grid gap-5 sm:grid-cols-2">
              {featuredProjects.map((p) => (
                <ProjectCard key={p.meta.slug} project={p.meta} />
              ))}
            </div>
          </Section>
        </Reveal>
      )}

      {/* News: 5 most recent; the rest live at /news. Scroll signature:
          a recessed full-bleed band, rows rising into it. Deliberately the
          last section: this is a showcase site, so the page closes on recent
          activity, not a pitch; contact lives in the hero and the footer,
          and the hero availability pill is the only "seeking" signal. */}
      {news.length > 0 && (
        <Reveal>
          {/* -mb-28 cancels the footer's global mt-28 so the recessed band
              runs flush into the footer hairline; the footer's border-t is
              the band's bottom edge (no empty paper strip between them). */}
          {/* band-sunken retints the pinned section label to match this band
              (globals.css); without it the label keeps the page background and
              reads as a pale card sitting inside the recess. */}
          <div className="band-sunken mt-14 -mb-28 border-t border-line bg-paper-sunken/60">
            <Section className="py-12">
              <SectionHeading
                index="04"
                title="News"
                rule={false}
                action={
                  <Link
                    href="/news"
                    className="text-sm font-medium text-accent transition-colors duration-[--duration-fast] hover:text-accent-strong"
                  >
                    All news →
                  </Link>
                }
              />
              <div className="sd-rise">
                <NewsList items={news} limit={5} />
              </div>
            </Section>
          </div>
        </Reveal>
      )}
    </>
  );
}
