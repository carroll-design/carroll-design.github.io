import { ImageResponse } from "next/og";

// Shared OG-card system: warm paper, hairline print-mat frame, and the site's
// brand at link-preview size. Two layouts:
//   brandCard()             site-wide default (name + tagline)
//   articleCard({ ... })    per-write-up (eyebrow + title)
// Keep generation self-contained so static builds do not depend on font hosts.

export const OG_SIZE = { width: 1200, height: 630 };

const PAPER = "#fbfaf7";
const RAISED = "#ffffff";
const INK_STRONG = "#1a1815";
const INK_MUTED = "#6b6660";
const INK_FAINT = "#767065";
const LINE = "#e2ddd3";
const LINE_STRONG = "#cfc9bd";
const ACCENT = "#b4552d";

// Takes explicit top/bottom nodes (not a fragment), satori flattens
// fragments unpredictably inside flex containers.
function frame(top: React.ReactNode, bottom: React.ReactNode) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: PAPER,
        padding: "44px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          border: `1px solid ${LINE_STRONG}`,
          borderRadius: 4,
          background: RAISED,
          padding: "64px 72px",
          boxShadow: "0 16px 40px -24px rgba(0,0,0,0.35)",
        }}
      >
        {top}
        {bottom}
      </div>
    </div>
  );
}

function footer(left: string) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        borderTop: `1px solid ${LINE}`,
        paddingTop: 28,
        fontSize: 27,
        color: INK_FAINT,
      }}
    >
      <span>{left}</span>
      <span style={{ color: ACCENT, fontWeight: 600 }}>
        carroll-design.github.io
      </span>
    </div>
  );
}

function toResponse(node: React.ReactElement) {
  return new ImageResponse(node, OG_SIZE);
}

export function brandCard() {
  const NAME = "Cameron Carroll";
  return toResponse(
    frame(
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            width: 90,
            height: 6,
            background: ACCENT,
            borderRadius: 3,
            marginBottom: 36,
          }}
        />
        <div
          style={{
            fontSize: 96,
            fontWeight: 500,
            color: INK_STRONG,
            letterSpacing: "-0.02em",
          }}
        >
          {NAME}
        </div>
        <div
          style={{
            fontSize: 36,
            color: INK_MUTED,
            marginTop: 24,
            maxWidth: 880,
            lineHeight: 1.35,
          }}
        >
          Aerospace and mechanical engineering · hardware and flight systems
        </div>
      </div>,
      footer("New Mexico State University"),
    ),
  );
}

export function articleCard({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return toResponse(
    frame(
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginBottom: 34,
          }}
        >
          <div
            style={{
              width: 56,
              height: 6,
              background: ACCENT,
              borderRadius: 3,
            }}
          />
          <div
            style={{
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: ACCENT,
            }}
          >
            {eyebrow}
          </div>
        </div>
        <div
          style={{
            fontSize: 62,
            fontWeight: 500,
            color: INK_STRONG,
            letterSpacing: "-0.02em",
            lineHeight: 1.12,
            maxWidth: 990,
          }}
        >
          {title}
        </div>
      </div>,
      footer("Cameron Carroll"),
    ),
  );
}
