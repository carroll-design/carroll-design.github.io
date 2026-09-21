// Skills frame layout for one activation of fib, registered in mdx-components
// so content/projects/compiler.mdx can place it.
//
// TSX rather than an ASCII diagram in a <pre>: the box-drawing version does
// not wrap, so it forces horizontal scroll on a phone, and the "two names for
// one slot" point (an argument spill slot doubling as a local) is the whole
// reason the diagram exists. A table can say that in a column.
//
// Offsets are from fp. After the prologue fp == sp, so the frame runs upward
// from fp and expression temporaries are pushed below it.

const ROWS: {
  offset: string;
  slot: string;
  alias?: string;
  tone?: "unused" | "saved" | "temp";
}[] = [
  { offset: "fp+124 … fp+32", slot: "96 bytes unused", tone: "unused" },
  { offset: "fp+28", slot: "a5 spill", tone: "unused" },
  { offset: "fp+24", slot: "a4 spill", tone: "unused" },
  { offset: "fp+20", slot: "a3 spill", tone: "unused" },
  { offset: "fp+16", slot: "a2 spill", alias: "local b" },
  { offset: "fp+12", slot: "a1 spill", alias: "local a" },
  { offset: "fp+8", slot: "a0 spill", alias: "param n" },
  { offset: "fp+4", slot: "saved fp", tone: "saved" },
  { offset: "fp+0", slot: "saved ra", alias: "fp == sp", tone: "saved" },
  { offset: "fp-4 and below", slot: "expression temporaries", tone: "temp" },
];

export function CompilerSkillsFrame() {
  return (
    <figure className="my-8">
      <figcaption className="mb-4 max-w-[var(--measure)] text-sm text-ink-muted">
        One activation of <code className="font-mono text-[0.9em]">fib</code>.
        Every frame is 128 bytes whatever the function needs, so 96 of them go
        unused here. The right column is the interesting part: the first six
        slots are argument spills and local variables at the same time.
      </figcaption>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-mono text-sm">
          <thead>
            <tr className="border-b border-line-strong">
              <th
                scope="col"
                className="py-2 pr-4 text-left text-xs font-semibold tracking-[0.12em] text-ink-faint uppercase"
              >
                Offset
              </th>
              <th
                scope="col"
                className="py-2 pr-4 text-left text-xs font-semibold tracking-[0.12em] text-ink-faint uppercase"
              >
                Slot
              </th>
              <th
                scope="col"
                className="py-2 text-left text-xs font-semibold tracking-[0.12em] text-ink-faint uppercase"
              >
                Also
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {ROWS.map((row) => (
              <tr
                key={row.offset}
                className={
                  row.tone === "unused" ? "text-ink-faint" : "text-ink"
                }
              >
                <td className="py-2 pr-4 whitespace-nowrap tabular-nums">
                  {row.offset}
                </td>
                <td className="py-2 pr-4">{row.slot}</td>
                <td className="py-2 text-accent">{row.alias ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
