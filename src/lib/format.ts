export function formatMonth(ym: string): string {
  if (ym === "present") return "Present";
  return new Date(`${ym}-01T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

/**
 * Full month name, for prose that stands alone rather than sitting in a
 * period range ("Updated July 2026", not "Updated Jul 2026").
 */
export function formatMonthLong(ym: string): string {
  return new Date(`${ym}-01T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function formatPeriod(p: {
  start: string;
  end?: string | "present";
}): string {
  const start = formatMonth(p.start);
  const end = p.end ? formatMonth(p.end) : "Present";
  // Work that began and ended in one month is a month, not a range: a
  // hackathon build should read "Apr 2026", not "Apr 2026 - Apr 2026".
  if (start === end) return start;
  return `${start} – ${end}`;
}
