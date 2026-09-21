// Model comparison for the Airbnb price write-up, registered in
// mdx-components so content/projects/airbnb-knn.mdx can place it. TSX because
// the MDX pipeline here has no remark-gfm, so a markdown pipe table renders
// as a literal paragraph of pipe characters (see NppResultsTable).
//
// Every row is the same held-out 20% split (random_state=42) over the same
// ten selected features, so the numbers are comparable across rows. Quoted
// from the notebook output: R² to three decimals, MAE to the cent. Linear
// regression is its test score, not its training score.
//
// The best row is the random forest, which is NOT the model in the project
// title. That is the point of the table and should not be quietly reordered.

const ROWS = [
  {
    model: "Random forest (100 trees, depth 15)",
    r2: "0.443",
    mae: "$53.73",
    best: true,
  },
  { model: "Decision tree (depth 10)", r2: "0.343", mae: "$59.39" },
  { model: "K-nearest neighbours (k = 9)", r2: "0.321", mae: "$59.85" },
  { model: "Support vector regression (RBF)", r2: "0.266", mae: "$59.49" },
  { model: "Linear regression", r2: "0.214", mae: "$67.30" },
];

export function AirbnbModelTable() {
  return (
    <div className="my-8 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <caption className="mb-3 text-left text-sm text-ink-muted">
          All five regressors on the same held-out split and the same ten
          features. Higher R² and lower MAE are better.
        </caption>
        <thead>
          <tr className="border-b border-line-strong">
            <th
              scope="col"
              className="py-2 pr-4 text-left text-xs font-semibold tracking-[0.12em] text-ink-faint uppercase"
            >
              Model
            </th>
            <th
              scope="col"
              className="py-2 pr-4 text-right text-xs font-semibold tracking-[0.12em] text-ink-faint uppercase"
            >
              R²
            </th>
            <th
              scope="col"
              className="py-2 text-right text-xs font-semibold tracking-[0.12em] text-ink-faint uppercase"
            >
              MAE
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {ROWS.map((row) => (
            <tr key={row.model} className={row.best ? "text-ink-strong" : ""}>
              <th
                scope="row"
                className={`py-2.5 pr-4 text-left font-normal ${
                  row.best ? "font-medium text-accent" : "text-ink"
                }`}
              >
                {row.model}
              </th>
              <td
                className={`py-2.5 pr-4 text-right tabular-nums ${
                  row.best ? "font-medium text-accent" : "text-ink-muted"
                }`}
              >
                {row.r2}
              </td>
              <td
                className={`py-2.5 text-right tabular-nums ${
                  row.best ? "font-medium text-accent" : "text-ink-muted"
                }`}
              >
                {row.mae}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
