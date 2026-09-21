"use client";

// Pending indicator for an in-flight navigation, rendered inside the <Link>
// it reports on: useLinkStatus reads the nearest enclosing Link's transition,
// so this cannot be hoisted to a sibling.
//
// Almost always invisible, and that is the point. Every route on this site
// has a prefetch payload and next/link fetches it on viewport entry, so a
// click is normally instant and this renders nothing. It exists for the case
// prefetching does not cover, a cold or throttled connection, where the old
// behaviour was a click that produced no feedback at all until the new page
// simply appeared.

import { useLinkStatus } from "next/link";

export function LinkPending({ className = "" }: { className?: string }) {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`ml-2 inline-block h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-accent align-middle ${className}`}
    />
  );
}
