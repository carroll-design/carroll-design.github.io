import Link from "next/link";
import type { Experience, Project } from "@/content/schema";
import { projectHasPage } from "@/lib/content";
import { formatPeriod } from "@/lib/format";
import { MetaChips } from "./MetaChips";
import { ArrowRightIcon } from "./icons";

// Card for regular (non-flagship) projects, self-contained, with optional
// external links. Flagship work renders as FlagshipCard; leadership entries
// as LeadershipList.
export function ProjectCard({
  project,
  eyebrow,
  href: hrefOverride,
  spotlight = false,
}: {
  project: Project | Experience;
  eyebrow?: string;
  href?: string | null;
  /**
   * Render full-width with larger type (see .card-spotlight in globals.css).
   * Passed explicitly by the caller rather than inferred from the card's
   * position: this used to be a :first-child:nth-last-child(odd) rule, so
   * whether a section had a spotlight depended on whether its project count
   * happened to be odd, and adding one project silently changed the layout of
   * a section nobody had touched.
   */
  spotlight?: boolean;
}) {
  // A card links to its own page only once that page exists. The link is on
  // the title and stretches over the whole card via ::after, rather than
  // wrapping the card in an anchor: the GitHub and demo links live inside,
  // and nesting anchors is invalid. Those sit above the overlay on z-10.
  const href =
    hrefOverride !== undefined
      ? hrefOverride
      : "tier" in project && projectHasPage(project)
        ? `/projects/${project.slug}`
        : null;

  return (
    <div
      className={`relative flex flex-col rounded-md border border-line bg-paper-raised p-6 transition-all duration-[--duration-base] ease-[--ease-out-expo] sm:p-7 ${
        spotlight ? "card-spotlight" : ""
      } ${
        href
          ? "group hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--accent)_40%,var(--line))] hover:bg-paper-raised-hover hover:shadow-[var(--shadow-card-hover)]"
          : ""
      }`}
    >
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-accent uppercase">
          {eyebrow}
        </p>
      )}
      {/* Two groups, so a full-width card can lay them side by side (see
          .card-grid in globals.css). In a normal two-up cell .card-split is a
          column that absorbs the row's spare height; the spotlight rule
          overrides display to grid, where flex-1 still applies but the
          bottom-anchoring below goes inert because the columns are centred. */}
      <div className="card-split flex flex-1 flex-col">
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <h3 className="font-serif text-2xl font-medium tracking-tight text-balance text-ink-strong">
              {href ? (
                <Link
                  href={href}
                  className="transition-colors duration-[--duration-fast] after:absolute after:inset-0 after:content-[''] hover:text-accent"
                >
                  {project.title}
                </Link>
              ) : (
                project.title
              )}
            </h3>
            {project.award && (
              <span className="rounded-sm bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
                {project.award}
              </span>
            )}
          </div>
          {/* Circumstances only. The role used to sit above this line in the
              same size and a near-identical grey, so the card stacked three
              undifferentiated meta lines and a role like "The requirements
              documentation, and the front end views and routing" read as a
              description of the project rather than a statement of what
              the site owner did. The role now lives in a labelled row above the chips;
              this line is left as the one "when and in what setting" fact.

              The period lives here rather than on its own line because it is
              part of the same statement as the context. Cards carried no date
              at all before this, so a reader could not tell recent work from
              work three years old. */}
          <p className="mt-2 text-sm text-ink-faint">
            {project.context && `${project.context} · `}
            {formatPeriod(project.period)}
          </p>
        </div>
        <div className="flex flex-1 flex-col">
          {/* Capped so a wide card keeps a readable line length instead of
              stretching edge to edge. No effect in a two-up cell, which is
              already narrower than this. */}
          <p className="mt-3 max-w-[var(--measure)] leading-relaxed text-pretty text-ink">
            {project.summary}
          </p>
          {/* Anchored to the bottom rather than trailing the summary. Cards in
              a row are stretched to the tallest, so a shorter one used to end
              its content early and leave the remainder blank. Sending the
              slack above this block instead lines the footers up across the
              row. mt-auto collapses to zero when there is no slack, so pt-5
              carries the spacing that mt-5 used to.

              A definition list, the same ROLE / SKILLS grammar the detail page
              header uses, so a labelled row means the same thing on the card
              and on the page it links to. Pulling the role down here also
              fills the gap a short summary used to leave above the chips. */}
          <dl className="mt-auto grid grid-cols-[max-content_1fr] items-center gap-x-4 gap-y-2 pt-5 text-sm">
            {project.role && (
              <div className="contents">
                <dt className="text-[0.6875rem] font-medium tracking-[0.08em] text-ink-faint uppercase">
                  Role
                </dt>
                <dd className="text-ink-muted">{project.role}</dd>
              </div>
            )}
            {project.cardSkills.length > 0 && (
              <div className="contents">
                <dt className="text-[0.6875rem] font-medium tracking-[0.08em] text-ink-faint uppercase">
                  Skills
                </dt>
                <dd>
                  <MetaChips items={project.cardSkills} label="Skills" />
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
      {project.links && (
        <div className="relative z-10 mt-5 flex gap-4 text-sm font-medium">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent transition-colors duration-[--duration-fast] hover:text-accent-strong"
            >
              GitHub
            </a>
          )}
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent transition-colors duration-[--duration-fast] hover:text-accent-strong"
            >
              Demo
            </a>
          )}
        </div>
      )}
      {project.coverImage ? (
        <img
          src={project.coverImage}
          alt={project.title}
          className="mt-5 aspect-[4/3] w-full rounded-sm border border-line object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div
          aria-hidden="true"
          className="mt-5 aspect-[16/9] rounded-sm border border-line bg-paper-sunken/40"
        />
      )}
      {/* Same affordance and wording as FlagshipCard, so "there is more to
          read" looks identical wherever it appears. Not a link itself: the
          title's stretched ::after already covers the card, and a second
          anchor to the same page would just add a duplicate tab stop. */}
      {href && (
        <p className="mt-5 inline-flex items-center gap-1.5 self-start text-sm font-medium text-accent">
          Read the write-up
          <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-[--duration-fast] group-hover:translate-x-0.5" />
        </p>
      )}
    </div>
  );
}
