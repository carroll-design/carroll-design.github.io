"use client";

// Client component #3 (PLAN §2.3): an IntersectionObserver that reveals a
// section as it scrolls into view. Fail-open by construction, the server
// renders no reveal classes, so a visitor without JS sees everything in its
// visible resting state. Only after mount (JS active) does the effect add
// `is-hidden` (pre-enter) and later `is-visible` (animate in).
//
// State is applied imperatively via classList, this synchronizes the DOM
// with an external system (the viewport), which is what effects are for, and
// avoids setState-in-effect.

import { useEffect, useRef, type ReactNode } from "react";

export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If GSAP owns the site's motion (SiteAnimations adds .gsap-active in a
    // layout effect, which runs before this passive effect), stand down.
    if (document.documentElement.classList.contains("gsap-active")) {
      return;
    }

    // If the browser supports CSS scroll-driven animations, the .sd-* classes
    // in globals.css own scroll motion, this fallback stands down entirely.
    if (
      typeof CSS !== "undefined" &&
      CSS.supports("animation-timeline: view()")
    ) {
      return;
    }

    // Arm: now that JS is running, hide the element pre-enter.
    el.classList.add("reveal", "is-hidden");

    const reveal = () => {
      el.classList.remove("is-hidden");
      el.classList.add("is-visible");
    };

    if (typeof IntersectionObserver === "undefined") {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal();
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
