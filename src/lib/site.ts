import type { Metadata } from "next";

// Canonical site constants. Every file that needs the production origin or
// the sitewide description imports it from here, so a domain change is a
// one-line edit instead of a grep across routes, feeds, and JSON-LD.

export const SITE_URL = "https://carroll-design.github.io";

export const SITE_NAME = "Cameron Carroll";

// The home page <title> is SITE_NAME, and so is the search-result site name
// above it. That repetition is correct here and not worth engineering around:
// on a platform the site and its subject are different things (LinkedIn, then
// whose profile), whereas this site's subject IS the site. Splitting them
// would cost the name in the browser tab and in bookmarks, which is the more
// expensive loss.

export const SITE_DESCRIPTION =
  "Aerospace and mechanical engineering student at New Mexico State University: ROVs, avionics, and flight systems.";

/** Absolute URL for a site-relative path ("/research/x" -> full URL). */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

/**
 * Page metadata with the Open Graph and Twitter fields filled in per page.
 * Next.js replaces a parent's `openGraph` wholesale rather than deep-merging
 * it, so a page that sets only `title` would otherwise ship the sitewide
 * og:title/og:description on its link previews.
 */
export function pageMetadata({
  title,
  description,
  path,
  publishedTime,
}: {
  title: string;
  description: string;
  path: string;
  /** ISO date; presence switches og:type from website to article. */
  publishedTime?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      ...(publishedTime
        ? { type: "article", publishedTime }
        : { type: "website" }),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
