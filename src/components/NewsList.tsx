import Link from "next/link";
import type { NewsItem } from "@/content/schema";

function dateLabel(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

const linkClass =
  "underline decoration-line decoration-1 underline-offset-[3px] transition-colors duration-[--duration-fast] hover:decoration-accent hover:text-ink-strong";

// Each row links to the item's own page at /news/[slug]; related work is
// linked from there, so readers get the story before the destination.
export function NewsList({
  items,
  limit,
}: {
  items: { meta: NewsItem }[];
  limit?: number;
}) {
  const shown = limit ? items.slice(0, limit) : items;
  if (shown.length === 0) return null;
  return (
    <ul data-animate="rows" className="divide-y divide-line">
      {shown.map(({ meta }) => (
        <li key={meta.slug} className="flex gap-6 py-4 first:pt-0 last:pb-0">
          <time
            dateTime={meta.date}
            className="w-20 shrink-0 pt-0.5 text-xs font-medium tracking-[0.08em] text-ink-faint uppercase tabular-nums"
          >
            {dateLabel(meta.date)}
          </time>
          <div>
            <p className="leading-relaxed text-pretty text-ink">
              <Link href={`/news/${meta.slug}`} className={linkClass}>
                {meta.text}
              </Link>
            </p>
            {/* Press sits on the row itself, not just on the item page: the
                outlets are the part a visitor scanning the list would most
                want to see, and they were previously invisible until you
                clicked through. Outlet names only, so the row stays a row. */}
            {meta.coverage.length > 0 && (
              <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2 text-xs text-ink-faint">
                <span className="font-semibold tracking-[0.14em] text-accent uppercase">
                  Press
                </span>
                <span>{meta.coverage.map((c) => c.outlet).join(" · ")}</span>
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
