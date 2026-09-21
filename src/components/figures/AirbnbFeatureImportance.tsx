// Decision-tree feature importance for the Airbnb price write-up, registered
// in mdx-components so content/projects/airbnb-knn.mdx can place it.
//
// TSX rather than the notebook's matplotlib PNG for three reasons: the export
// is a light-background raster that looks wrong in dark mode, its labels are
// raw dataframe column names, and text in an image is not selectable or
// readable by a screen reader. Inline SVG in MDX is not safe in this repo
// either (children get wrapped in <p>), so the bars are plain divs.
//
// Scores are the sklearn feature_importances_ of a DecisionTreeRegressor fit
// on the training split, quoted to three decimals from the notebook output.
// Bar widths are relative to the largest score, not to 1.0, so the shape of
// the drop-off is visible rather than everything hugging the left edge.

const ROWS = [
  { label: "Private room (vs entire home)", score: 0.161 },
  { label: "Longitude", score: 0.132 },
  { label: "Latitude", score: 0.131 },
  { label: "Days available per year", score: 0.084 },
  { label: "Reviews per month", score: 0.077 },
  { label: "Listings by the same host", score: 0.076 },
  { label: "Minimum nights", score: 0.061 },
  { label: "Total reviews", score: 0.059 },
  { label: "Reviews in the last 12 months", score: 0.035 },
  { label: "Shared room", score: 0.017 },
];

const MAX = Math.max(...ROWS.map((r) => r.score));

export function AirbnbFeatureImportance() {
  return (
    <figure className="my-8">
      <figcaption className="mb-4 max-w-[var(--measure)] text-sm text-ink-muted">
        What the decision tree actually used, out of 1,475 columns. These ten
        carry 83% of the total importance; the remaining 1,465 share the rest.
      </figcaption>
      <dl className="space-y-2.5">
        {ROWS.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[minmax(0,1fr)_3.25rem] items-center gap-x-3 sm:grid-cols-[13rem_minmax(0,1fr)_3.25rem]"
          >
            <dt className="col-span-2 text-sm text-ink sm:col-span-1 sm:pr-1 sm:text-right">
              {row.label}
            </dt>
            <div
              aria-hidden="true"
              className="h-2 rounded-full bg-[color-mix(in_srgb,var(--line)_70%,transparent)]"
            >
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${(row.score / MAX) * 100}%` }}
              />
            </div>
            <dd className="text-right text-sm tabular-nums text-ink-muted">
              {row.score.toFixed(3)}
            </dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}
