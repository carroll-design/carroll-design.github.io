// Shared builders for DetailArticle's metadata grid. Lives here rather than
// in either route because /projects/[slug] and /leadership/[slug] both need
// the same external-link row and they must look identical.

/**
 * A metadata row pointing off-site, or nothing when there is no such link.
 * Returns an array so callers can spread it into the row list unconditionally.
 *
 * Shown as host and path rather than a bare URL, reusing the site-wide
 * external-link arrow. "www." is dropped: it is noise no reader needs, and
 * without it every host on the site reads the same way.
 */
export function externalRow(label: string, url?: string) {
  if (!url) return [];
  return [
    {
      label,
      value: (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="link-external text-ink transition-colors duration-[--duration-fast] hover:text-accent"
        >
          {url
            .replace(/^https?:\/\//, "")
            .replace(/^www\./, "")
            .replace(/\/$/, "")}
          <span aria-hidden="true" className="link-arrow ml-1 text-accent">
            ↗
          </span>
        </a>
      ),
    },
  ];
}
