import Link from "next/link";
import type { Project } from "@/content/schema";
import { leadershipHasPage } from "@/lib/content";
import { formatPeriod } from "@/lib/format";
import { ArrowRightIcon } from "./icons";

// Compact list for leadership-tier entries, supporting detail, not cards that
// compete with the technical work for attention. An entry that has opted into
// its own write-up (detail: true) links to it; the rest are plain rows.
export function LeadershipList({ items }: { items: { meta: Project }[] }) {
  if (items.length === 0) return null;
  return (
    <ul data-animate="rows" className="divide-y divide-line">
      {items.map(({ meta }) => {
        const href = leadershipHasPage(meta)
          ? `/leadership/${meta.slug}`
          : null;
        return (
          <li
            key={meta.slug}
            className={`relative py-6 first:pt-0 ${href ? "group" : ""}`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              {/* h2, not h3: these rows sit directly under the page h1 with no
                  intervening heading, and an h1 -> h3 jump was the only
                  heading-order violation on the site. */}
              <h2 className="text-ink-strong">
                {/* Stretched ::after rather than wrapping the row in an anchor,
                    matching ProjectCard: the body can carry its own links. */}
                {href ? (
                  <Link
                    href={href}
                    className="transition-colors duration-[--duration-fast] after:absolute after:inset-0 after:content-[''] hover:text-accent"
                  >
                    {meta.role && (
                      <span className="font-semibold">{meta.role}</span>
                    )}
                    {meta.role && " · "}
                    <span
                      className={meta.role ? "text-ink-muted" : "font-semibold"}
                    >
                      {meta.title}
                    </span>
                  </Link>
                ) : (
                  <>
                    {meta.role && (
                      <span className="font-semibold">{meta.role}</span>
                    )}
                    {meta.role && " · "}
                    <span
                      className={meta.role ? "text-ink-muted" : "font-semibold"}
                    >
                      {meta.title}
                    </span>
                  </>
                )}
              </h2>
              <span className="text-xs font-medium tracking-[0.08em] text-ink-faint uppercase tabular-nums">
                {formatPeriod({
                  start: meta.period.start,
                  end: meta.period.end,
                })}
              </span>
            </div>
            <p className="mt-2 max-w-[var(--measure)] leading-relaxed text-pretty text-ink">
              {meta.summary}
            </p>
            {/* Same wording and affordance as the project cards, so "there is
                more to read" looks identical wherever it appears. */}
            {href && (
              <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                Read the write-up
                <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-[--duration-fast] group-hover:translate-x-0.5" />
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
