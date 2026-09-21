// Editorial section heading: hairline rule, serif index numeral, small-caps
// label, optional trailing action. Replaces bare uppercase h2s.
//
// Pins beneath the site header while its section is on screen (.section-sticky
// in globals.css), so a reader always knows which section they are in without
// the page growing a rail or a tab bar. Padding moved from the outer margin
// into the box itself: mb-8 sat outside the sticky element, so content would
// have scrolled flush against the label once pinned. pb-3 + mb-5 keeps the
// same eight units of space below the label when it is not pinned.

import type { ReactNode } from "react";

export function SectionHeading({
  index,
  title,
  action,
  rule = true,
}: {
  index?: string;
  title: string;
  action?: ReactNode;
  rule?: boolean;
}) {
  return (
    <div className="section-sticky relative mb-5 flex items-baseline gap-4 pt-5 pb-3">
      {/* Hairline that draws across on scroll (static line when the browser
          lacks scroll-driven animations, see globals.css). */}
      {rule && (
        <span
          aria-hidden="true"
          className="rule-draw absolute top-0 left-0 h-px w-full bg-line-strong"
        />
      )}
      {index && (
        <span
          aria-hidden="true"
          className="sd-num font-serif text-sm text-accent italic tabular-nums"
        >
          {index}
        </span>
      )}
      <h2 className="font-sans text-xs font-semibold tracking-[0.16em] text-ink-muted uppercase">
        {title}
      </h2>
      {action && <div className="ml-auto">{action}</div>}
    </div>
  );
}
