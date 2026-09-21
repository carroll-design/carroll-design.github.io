// Two-tier sketch for the Aggie Find-It write-up, registered in
// mdx-components so content/projects/aggie-find-it.mdx can place it.
//
// The point of the figure is an absence: there is no server between the
// desktop client and the database, which is why every installed copy carries
// the database credential. A labelled empty gap argues that better than a
// sentence, because the reader sees the missing box.
//
// Lives in TSX rather than inline in the MDX for the reason documented in
// ElsaPipelineDiagram: MDX parses multi-line <text> content as markdown and
// silently compiles the labels into <p> elements, which render as nothing.

export function AggieArchitecture() {
  return (
    <svg
      viewBox="0 0 680 300"
      role="img"
      aria-labelledby="fig-aggie-title"
      style={{ width: "100%", height: "auto" }}
    >
      <title id="fig-aggie-title">
        Two-tier architecture: a JavaFX desktop client, holding eleven views and
        a single static data-access class, connects straight over the MongoDB
        driver to an Atlas database of four unlinked collections. No server tier
        exists between them.
      </title>
      <defs>
        <marker
          id="arr-aggie"
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

      {/* client tier */}
      <text
        x="134"
        y="28"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="var(--ink-strong)"
      >
        JavaFX desktop client
      </text>
      <rect
        x="8"
        y="40"
        width="252"
        height="210"
        rx="4"
        fill="var(--paper-sunken)"
        stroke="var(--line-strong)"
      />
      <rect
        x="24"
        y="56"
        width="220"
        height="48"
        rx="4"
        fill="var(--paper-raised)"
        stroke="var(--line-strong)"
      />
      <text x="134" y="76" textAnchor="middle" fontSize="12" fill="var(--ink)">
        shell, 11 FXML views,
      </text>
      <text x="134" y="92" textAnchor="middle" fontSize="12" fill="var(--ink)">
        11 controllers
      </text>

      <line
        x1="134"
        y1="106"
        x2="134"
        y2="136"
        stroke="var(--ink-faint)"
        markerEnd="url(#arr-aggie)"
      />
      <text x="144" y="118" fontSize="10.5" fill="var(--ink-muted)">
        static calls,
      </text>
      <text x="144" y="131" fontSize="10.5" fill="var(--ink-muted)">
        String results, no models
      </text>

      <rect
        x="24"
        y="142"
        width="220"
        height="48"
        rx="4"
        fill="var(--paper-raised)"
        stroke="var(--line-strong)"
      />
      <text
        x="134"
        y="162"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="var(--ink-strong)"
      >
        sql_link
      </text>
      <text
        x="134"
        y="179"
        textAnchor="middle"
        fontSize="11"
        fill="var(--ink-muted)"
      >
        14 static methods
      </text>
      <text
        x="134"
        y="216"
        textAnchor="middle"
        fontSize="11"
        fill="var(--ink-muted)"
      >
        ships with the
      </text>
      <text
        x="134"
        y="231"
        textAnchor="middle"
        fontSize="11"
        fill="var(--ink-muted)"
      >
        database credential
      </text>

      {/* the missing tier */}
      <text
        x="342"
        y="124"
        textAnchor="middle"
        fontSize="10.5"
        fill="var(--ink-muted)"
      >
        MongoDB driver over TLS
      </text>
      <line
        x1="260"
        y1="140"
        x2="424"
        y2="140"
        stroke="var(--ink-faint)"
        markerEnd="url(#arr-aggie)"
      />
      <text
        x="342"
        y="157"
        textAnchor="middle"
        fontSize="10.5"
        fill="var(--ink-muted)"
      >
        new connection per query
      </text>
      <rect
        x="282"
        y="174"
        width="120"
        height="32"
        rx="4"
        fill="none"
        stroke="var(--line-strong)"
        strokeDasharray="4 4"
      />
      <text
        x="342"
        y="194"
        textAnchor="middle"
        fontSize="10.5"
        fill="var(--ink-faint)"
      >
        no backend tier
      </text>

      {/* database tier */}
      <text
        x="548"
        y="28"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="var(--ink-strong)"
      >
        MongoDB Atlas
      </text>
      <rect
        x="424"
        y="40"
        width="248"
        height="210"
        rx="4"
        fill="var(--paper-sunken)"
        stroke="var(--line-strong)"
      />
      <text
        x="548"
        y="60"
        textAnchor="middle"
        fontSize="11"
        fill="var(--ink-muted)"
      >
        database CS371, no indexes
      </text>

      <rect
        x="442"
        y="72"
        width="212"
        height="30"
        rx="4"
        fill="var(--paper-raised)"
        stroke="var(--line-strong)"
      />
      <text x="548" y="92" textAnchor="middle" fontSize="12" fill="var(--ink)">
        Items
      </text>

      <line
        x1="548"
        y1="102"
        x2="548"
        y2="124"
        stroke="var(--line-strong)"
        strokeDasharray="3 3"
      />
      <text x="558" y="117" fontSize="10" fill="var(--ink-faint)">
        no matching
      </text>

      <rect
        x="442"
        y="124"
        width="212"
        height="30"
        rx="4"
        fill="var(--paper-raised)"
        stroke="var(--line-strong)"
      />
      <text x="548" y="144" textAnchor="middle" fontSize="12" fill="var(--ink)">
        Request
      </text>

      <rect
        x="442"
        y="162"
        width="212"
        height="30"
        rx="4"
        fill="var(--paper-raised)"
        stroke="var(--line-strong)"
      />
      <text x="548" y="182" textAnchor="middle" fontSize="12" fill="var(--ink)">
        AdminUser
      </text>

      <rect
        x="442"
        y="196"
        width="212"
        height="30"
        rx="4"
        fill="var(--paper-raised)"
        stroke="var(--line-strong)"
      />
      <text x="548" y="216" textAnchor="middle" fontSize="12" fill="var(--ink)">
        StudentUser
      </text>
    </svg>
  );
}
