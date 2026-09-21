"use client";

// Client component #2 (PLAN §2.3): open/close state for the small-screen menu.
// On desktop (sm+) the nav is plain server-rendered links and this component
// is display:none, so it contributes no interaction cost there.
//
// Still a disclosure rather than a modal: the panel is a dropdown under the
// header, not a full-screen sheet, so it takes no focus trap and no inert on
// the rest of the page. Tab order continues into the content below, which is
// what a reader expects from a menu they can see past. The scrim dims and
// catches taps; it does not make this a dialog.
//
// The scrim MUST be portalled to <body>. The header sets backdrop-blur, and
// backdrop-filter makes an element a containing block for position: fixed
// descendants, so a scrim rendered in place covered the header's own 69px box
// instead of the viewport. That put it on top of the toggle: tapping the close
// icon hit the scrim, which dismissed on pointerdown and unmounted, so the
// click that followed landed on the newly exposed button and reopened the
// menu. Portalling it out of the header is what makes inset-0 mean the screen.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { NAV_LINKS } from "@/lib/nav";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Dismissal that the user drove (Escape, tapping away). Focus goes back to
  // the trigger, because it is where they were and the panel that had focus
  // is now gone.
  const dismiss = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  // Escape only. Outside-tap dismissal belongs to the scrim, which is a real
  // element receiving a real tap; a second document-level listener doing the
  // same job raced it, closing on pointerdown so the following click fell
  // through to whatever was underneath.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") dismiss();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  // Close on any route change, not just on a tap inside this panel. The
  // command palette navigates without touching this component, which used to
  // leave the menu sitting open on top of the page it had moved to. No focus
  // return here: the destination page should receive it, not the toggle.
  //
  // Adjusted during render rather than in an effect (React's documented
  // "resetting state when a prop changes" pattern). An effect would paint the
  // open panel over the new route for a frame before closing it, and would
  // trip react-hooks/set-state-in-effect.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <div className="sm:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-ink-muted transition-colors duration-[--duration-fast] hover:bg-paper-sunken hover:text-ink-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {open && (
        <>
          {/* Portalled to <body>: see the note at the top of this file. z-30
              keeps it under the header and panel (both z-40), so the toggle
              stays tappable and closing works, while every tap on the page
              lands here.

              onClick, not onPointerDown. The scrim unmounts the moment it
              dismisses, so closing on pointerdown left the click to land on
              whatever was underneath, which on this site is usually a project
              card. Waiting for the click means the scrim consumes it. */}
          {createPortal(
            <div
              aria-hidden="true"
              onClick={dismiss}
              className="fixed inset-0 z-30 bg-black/25"
            />,
            document.body,
          )}
          <div
            id="mobile-nav-panel"
            className="panel-rise absolute inset-x-0 top-full z-40 border-b border-line bg-paper-raised"
          >
            <nav
              aria-label="Primary, mobile"
              className="mx-auto flex max-w-4xl flex-col px-6 py-2"
            >
              {NAV_LINKS.map((link) => {
                // Same active test as the desktop NavLinks, which had the
                // current-page state and this panel did not, so on a phone
                // there was no indication of where you already were.
                const active =
                  pathname === link.href ||
                  pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={`border-b border-line py-3 transition-colors duration-[--duration-fast] last:border-0 hover:text-accent ${
                      active ? "font-medium text-accent" : "text-ink"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
