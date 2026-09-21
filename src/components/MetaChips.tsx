// Small tag row for methods / skills lists.

export function MetaChips({
  items,
  label,
}: {
  items: readonly string[];
  label?: string;
}) {
  if (items.length === 0) return null;
  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-sm border border-line bg-paper-sunken px-2 py-0.5 text-xs text-ink-muted"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
