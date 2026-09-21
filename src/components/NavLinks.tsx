"use client";

// Client component #4 (PLAN §2.3): active-route indication in the header.
// The current pathname only exists at runtime under static export, so this
// tiny island (usePathname + a class swap) is the whole justification.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/nav";

export function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {NAV_LINKS.map((link) => {
        const active =
          pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`relative text-sm transition-colors duration-[--duration-fast] after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:bg-accent after:transition-transform after:duration-[--duration-base] after:ease-[--ease-out-expo] ${
              active
                ? "text-ink-strong after:scale-x-100"
                : "text-ink-muted after:scale-x-0 hover:text-ink-strong hover:after:scale-x-100"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
}
