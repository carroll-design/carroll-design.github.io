import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: no SSR, no server runtime (PLAN §2.1).
  output: "export",
  // Image Optimization API needs a server; assets are pre-optimized by hand.
  images: { unoptimized: true },
};

export default nextConfig;
