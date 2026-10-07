// Server shell. Sticky glass header: translucent paper + backdrop blur so
// content scrolls beneath it. Client islands: NavLinks (active route),
// ThemeToggle, MobileNav, CommandMenu (data built here, server-side).

import Link from "next/link";
import {
  getLeadershipWithPages,
  getNews,
  getProjectsWithPages,
  getSite,
} from "@/lib/content";
import { NAV_LINKS } from "@/lib/nav";
import { NavLinks } from "./NavLinks";
import { MobileNav } from "./MobileNav";
import { ThemeToggle } from "./ThemeToggle";
import { CommandMenu, type Command } from "./CommandMenu";

function buildCommands(): Command[] {
  const site = getSite().meta;
  return [
    { group: "Navigate", label: "Home", href: "/" },
    ...NAV_LINKS.map((l) => ({
      group: "Navigate",
      label: l.label,
      href: l.href,
    })),
    // Every project with a page, not just the flagship. Deriving from the same
    // helper as the route and sitemap means it cannot drift again.
    ...getProjectsWithPages().map((p) => ({
      group: "Work",
      label: p.meta.title,
      href: `/projects/${p.meta.slug}`,
    })),
    ...getLeadershipWithPages().map((p) => ({
      group: "Work",
      label: p.meta.title,
      href: `/leadership/${p.meta.slug}`,
    })),
    ...getNews().map((n) => ({
      group: "News",
      label: n.meta.text,
      href: `/news/${n.meta.slug}`,
    })),
    // Email is deliberately absent: it is entity-obfuscated in the DOM
    // (PLAN §2.5) and would ship as plain text in client props here.
    { group: "Links", label: "GitHub", href: site.links.github },
    { group: "Links", label: "LinkedIn", href: site.links.linkedin },
    { group: "Links", label: "RSS feed", href: "/feed.xml" },
  ];
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-[color-mix(in_srgb,var(--paper)_86%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4 lg:max-w-5xl lg:px-8">
        <Link
          href="/"
          className="font-serif text-lg font-medium tracking-tight text-ink-strong transition-colors duration-[--duration-fast] hover:text-accent"
        >
          Cameron Carroll
        </Link>

        <div className="flex items-center gap-1">
          <nav
            aria-label="Primary"
            className="hidden items-center gap-7 sm:flex"
          >
            <NavLinks />
          </nav>
          <div className="ml-3 flex items-center gap-1">
            <CommandMenu commands={buildCommands()} />
            <ThemeToggle />
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
