import type { Publication } from "@/content/schema";

// Formats publications as citations, bolding the author whose surname matches
// `authorSurname` (the site owner) at whatever position it appears.
export function PublicationList({
  publications,
  authorSurname = "Carroll",
  limit,
}: {
  publications: { meta: Publication }[];
  authorSurname?: string;
  /**
   * Cap for the home page strip, same contract as NewsList: show the most
   * recent few and let "All publications" carry the rest. Citations are tall
   * (three or four wrapped lines each), so an uncapped list would take over
   * the page as the record grows.
   */
  limit?: number;
}) {
  const shown = limit ? publications.slice(0, limit) : publications;
  if (shown.length === 0) return null;
  return (
    <ol data-animate="rows" className="space-y-6">
      {shown.map(({ meta }, i) => (
        // Academic register: hanging indent, first line flush, wrapped
        // lines indented (padding-left + negative text-indent).
        <li key={i} className="pl-6 -indent-6 text-ink">
          <p className="leading-relaxed">
            {meta.authors.map((author, j) => {
              const isSelf = author.startsWith(`${authorSurname},`);
              return (
                <span key={j}>
                  {isSelf ? (
                    <strong className="text-ink-strong">{author}</strong>
                  ) : (
                    author
                  )}
                  {/* Author names in this format already end in an initial's
                      period ("Miller, N."), so appending the separator's own
                      period rendered "Miller, N.. Title". Only supply one when
                      the name does not carry it. */}
                  {j < meta.authors.length - 1
                    ? "; "
                    : author.endsWith(".")
                      ? " "
                      : ". "}
                </span>
              );
            })}
            {meta.href ? (
              <a
                href={meta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline decoration-1 underline-offset-2 hover:text-accent-strong"
              >
                {meta.title}
              </a>
            ) : (
              <span className="italic">{meta.title}</span>
            )}
            . {meta.venue}, {meta.year}.
          </p>
          <p className="mt-1 indent-0 text-sm text-ink-muted capitalize">
            {meta.type} · {meta.status}
          </p>
        </li>
      ))}
    </ol>
  );
}
