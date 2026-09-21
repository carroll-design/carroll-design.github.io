// Pipeline sketch for the ELSA write-up, registered in mdx-components so
// content/projects/elsa-pds.mdx can place it.
//
// This lived as inline SVG inside the MDX body until 2026-07-31, where it was
// silently broken: MDX treats the multi-line text inside each <text> element
// as a markdown block, so every label was compiled to
// <text><p class="my-4 ...">Label</p></text>. A <p> is not valid SVG content,
// so browsers rendered nothing for it and the diagram came out blank. The
// same pass also dropped the style={{...}} prop (so the svg fell back to the
// browser default 300x150 box) and reduced <title> to "[object Object]".
//
// That is the identical failure the architecture diagram documents, and the
// identical fix: complex JSX lives in typechecked TSX where markdown parsing
// can never touch it. Do not move this back inline.

export function ElsaPipelineDiagram() {
  return (
    <svg
      viewBox="0 0 680 240"
      role="img"
      aria-labelledby="fig-elsa-title"
      style={{ width: "100%", height: "auto" }}
    >
      <title id="fig-elsa-title">
        ELSA pipeline: mission and atmospheric-model data flow through ELSA
        guided metadata generation and are routed to the PDS Atmospheres Node
        for review.
      </title>
      <defs>
        <marker
          id="arr-elsa"
          viewBox="0 0 8 8"
          refX="7"
          refY="4"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0L8 4L0 8z" fill="var(--ink-faint)" />
        </marker>
      </defs>

      {/* data sources */}
      <rect
        x="10"
        y="48"
        width="180"
        height="44"
        rx="4"
        fill="var(--paper-sunken)"
        stroke="var(--line-strong)"
      />
      <text x="100" y="74" textAnchor="middle" fontSize="14" fill="var(--ink)">
        Mission &amp; instrument data
      </text>
      <rect
        x="10"
        y="148"
        width="180"
        height="44"
        rx="4"
        fill="var(--paper-sunken)"
        stroke="var(--line-strong)"
      />
      <text x="100" y="167" textAnchor="middle" fontSize="14" fill="var(--ink)">
        Atmospheric model data
      </text>
      <text
        x="100"
        y="184"
        textAnchor="middle"
        fontSize="12"
        fill="var(--ink-muted)"
      >
        (Annex)
      </text>

      {/* sources → ELSA */}
      <line
        x1="190"
        y1="70"
        x2="244"
        y2="102"
        stroke="var(--ink-faint)"
        markerEnd="url(#arr-elsa)"
      />
      <line
        x1="190"
        y1="170"
        x2="244"
        y2="138"
        stroke="var(--ink-faint)"
        markerEnd="url(#arr-elsa)"
      />

      {/* ELSA */}
      <rect
        x="250"
        y="73"
        width="170"
        height="94"
        rx="4"
        fill="var(--paper-raised)"
        stroke="var(--accent)"
      />
      <text
        x="335"
        y="103"
        textAnchor="middle"
        fontSize="16"
        fontWeight="600"
        fill="var(--ink-strong)"
      >
        ELSA
      </text>
      <text
        x="335"
        y="124"
        textAnchor="middle"
        fontSize="12"
        fill="var(--ink-muted)"
      >
        guided metadata generation
      </text>
      <text
        x="335"
        y="141"
        textAnchor="middle"
        fontSize="12"
        fill="var(--ink-muted)"
      >
        validation &amp; review
      </text>

      {/* ELSA → node */}
      <line
        x1="420"
        y1="120"
        x2="474"
        y2="120"
        stroke="var(--ink-faint)"
        markerEnd="url(#arr-elsa)"
      />
      <rect
        x="480"
        y="86"
        width="190"
        height="68"
        rx="4"
        fill="var(--accent-soft)"
        stroke="var(--accent)"
      />
      <text
        x="575"
        y="114"
        textAnchor="middle"
        fontSize="14"
        fontWeight="600"
        fill="var(--accent)"
      >
        PDS Atmospheres Node
      </text>
      <text
        x="575"
        y="134"
        textAnchor="middle"
        fontSize="12"
        fill="var(--accent)"
      >
        review, then archiving
      </text>
    </svg>
  );
}
