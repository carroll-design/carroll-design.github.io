import { brandCard, OG_SIZE } from "@/lib/og-card";

// Build-time OG card (prerendered to a static PNG for the static export).
// Site-wide default; pages with their own opengraph-image override it.

// Required for image routes under `output: export`, prerender to a file.
export const dynamic = "force-static";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Cameron Carroll: aerospace and mechanical engineering";

export default function OgImage() {
  return brandCard();
}
