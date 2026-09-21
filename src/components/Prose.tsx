// Typographic container for rendered MDX bodies. Caps measure for readability
// and provides the base text color; element rhythm comes from mdx-components.

import type { ReactNode } from "react";

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-[var(--measure)] text-ink [text-wrap:pretty]">
      {children}
    </div>
  );
}
