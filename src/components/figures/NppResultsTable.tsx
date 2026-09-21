// Results ladder for the biomass research write-up, registered in
// mdx-components so content/research/npp-lstm.mdx can place it. It lives as
// TSX for the same reason the architecture sketch does: the MDX pipeline here
// has no remark-gfm, so a markdown pipe table renders as a literal paragraph
// of pipe characters. Keeping it in TSX also means the figures can never
// drift from each other stylistically, and the numbers sit under type review
// rather than in prose.
//
// Every figure is the pooled metric over the full held-out test split (14,747
// records, 3,687 pixels) for the biomass-change target, quoted to three
// decimals from per_model_metrics.csv. The best row is the one WITHOUT the
// collar branch, which is the point of the table.

const ROWS = [
  { inputs: "Biomass history only", mae: "1.165", r2: "0.364" },
  { inputs: "Plus precipitation", mae: "0.550", r2: "0.888" },
  { inputs: "Plus grazing pressure", mae: "0.524", r2: "0.900" },
  {
    inputs: "Plus land cover, no collar",
    mae: "0.447",
    r2: "0.932",
    best: true,
  },
  { inputs: "All four inputs", mae: "0.489", r2: "0.921" },
];

export function NppResultsTable() {
  return (
    <div className="my-8 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <caption className="mb-3 text-left text-sm text-ink-muted">
          Biomass-change accuracy on the held-out test split, by input
          combination. Lower MAE and higher R² are better.
        </caption>
        <thead>
          <tr className="border-b border-line-strong">
            <th
              scope="col"
              className="py-2 pr-4 text-left text-xs font-semibold tracking-[0.12em] text-ink-faint uppercase"
            >
              Inputs
            </th>
            <th
              scope="col"
              className="py-2 pr-4 text-right text-xs font-semibold tracking-[0.12em] text-ink-faint uppercase"
            >
              MAE
            </th>
            <th
              scope="col"
              className="py-2 text-right text-xs font-semibold tracking-[0.12em] text-ink-faint uppercase"
            >
              R²
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {ROWS.map((row) => (
            <tr key={row.inputs} className={row.best ? "text-ink-strong" : ""}>
              <th
                scope="row"
                className={`py-2.5 pr-4 text-left font-normal ${
                  row.best ? "font-medium text-accent" : "text-ink"
                }`}
              >
                {row.inputs}
              </th>
              <td className="py-2.5 pr-4 text-right tabular-nums text-ink-muted">
                {row.mae}
              </td>
              <td
                className={`py-2.5 text-right tabular-nums ${
                  row.best ? "font-medium text-accent" : "text-ink-muted"
                }`}
              >
                {row.r2}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
