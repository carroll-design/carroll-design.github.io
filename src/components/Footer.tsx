// Server component. Single-band footer: the page's quiet closing line, not a
// second navigation. The header is sticky, so the wordmark and every nav
// target sit in the viewport at all times; anything the footer restated (a
// sitemap, the name, the tagline) was redundant against something already on
// screen. What survives is the contact set, which lives nowhere else on the
// page, plus the legal line. Email stays entity-obfuscated at render
// (PLAN §2.5). The hairline is a footer-owned scroll-driven draw
// (globals.css .footer-rule): the GSAP scan is scoped to #main, so it keeps
// animating while .gsap-active stands the shared classes down.

import { getSite } from "@/lib/content";
import { ObfuscatedEmail } from "./ObfuscatedEmail";
import { LocalTime } from "./LocalTime";

// TODO: point at your fork once you have a GitHub username set.
const REPO_URL = "https://github.com/";

const footerLink =
  "text-ink-muted transition-colors duration-[--duration-fast] hover:text-accent";

// Hidden until the link is hovered or keyboard-focused, then it flies into
// place from below-left. Motion lives in globals.css (.link-arrow), keyed off
// the .link-external parent.
function ExternalArrow() {
  return (
    <span aria-hidden="true" className="link-arrow ml-1 text-accent">
      ↗
    </span>
  );
}

export function Footer() {
  const site = getSite().meta;
  return (
    <footer className="mt-32">
      <div aria-hidden="true" className="footer-rule h-px bg-line" />
      <div className="mx-auto max-w-4xl px-6 pb-14 pt-10 lg:max-w-5xl lg:px-8">
        {/* Sizes differ by one step (meta 13px, links 15px); baseline
            alignment keeps the two sides sitting on one line. */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="text-xs text-ink-faint">
            © {new Date().getFullYear()} {site.name} · {site.location}
            <LocalTime />
          </p>
          <nav
            aria-label="Contact"
            className="flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm"
          >
            <ObfuscatedEmail email={site.email} className={footerLink}>
              Email
            </ObfuscatedEmail>
            <a
              href={site.links.github}
              target="_blank"
              rel="me noopener noreferrer"
              className={`link-external ${footerLink}`}
            >
              GitHub
              <ExternalArrow />
            </a>
            <a
              href={site.links.linkedin}
              target="_blank"
              rel="me noopener noreferrer"
              className={`link-external ${footerLink}`}
            >
              LinkedIn
              <ExternalArrow />
            </a>
            {site.links.orcid && (
              <a
                href={site.links.orcid}
                target="_blank"
                rel="me noopener noreferrer"
                className={`link-external ${footerLink}`}
              >
                ORCID
                <ExternalArrow />
              </a>
            )}
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`link-external ${footerLink}`}
            >
              Source
              <ExternalArrow />
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
