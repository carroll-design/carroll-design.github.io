import Link from "next/link";
import { MetaChips } from "./MetaChips";
import { ArrowRightIcon } from "./icons";

// Full-width split card for flagship work, the loudest unit in the card
// system, visually distinct from regular ProjectCards so the importance
// hierarchy is legible at a glance. Left column: identity (eyebrow, display
// title, meta line, link affordance). The photo placeholder sits to the right
// of the title, with the substance below it.
export function FlagshipCard({
  href,
  eyebrow,
  title,
  metaLine,
  summary,
  chips,
  chipsLabel,
  coverImage,
}: {
  href: string;
  eyebrow: string;
  title: string;
  metaLine: string;
  summary: string;
  chips: readonly string[];
  chipsLabel: string;
  coverImage?: string;
}) {
  return (
    // The scroll-driven animation (.sd-cards) scrubs this outer link's
    // transform; the hover lift lives on the inner surface so the two never
    // fight over the same property (see the place-print fill-mode incident).
    <Link href={href} className="group block">
      <div className="rounded-md border border-line bg-paper-raised p-6 transition-all duration-[--duration-base] ease-[--ease-out-expo] group-hover:-translate-y-0.5 group-hover:border-[color-mix(in_srgb,var(--accent)_40%,var(--line))] group-hover:bg-paper-raised-hover group-hover:shadow-[var(--shadow-card-hover)] sm:p-8">
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(7rem,30%)] items-start gap-5 sm:gap-10">
          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-accent uppercase">
              {eyebrow}
            </p>
            <h3 className="flagship-title font-serif text-2xl font-medium tracking-tight text-balance text-ink-strong transition-colors duration-[--duration-fast] sm:text-3xl">
              {title}
            </h3>
            <p className="mt-3 text-sm text-ink-faint">{metaLine}</p>
          </div>
          {coverImage ? (
            <img
              src={coverImage}
              alt={title}
              className="aspect-[4/3] w-full rounded-sm border border-line object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div
              aria-hidden="true"
              className="aspect-[4/3] rounded-sm border border-line bg-paper-sunken/40"
            />
          )}
        </div>
        <div className="mt-6 sm:mt-8">
          <p className="leading-relaxed text-pretty text-ink">{summary}</p>
          <div className="mt-5">
            <MetaChips items={chips} label={chipsLabel} />
          </div>
          <p className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
            Read the write-up
            <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-[--duration-fast] group-hover:translate-x-0.5" />
          </p>
        </div>
      </div>
    </Link>
  );
}
