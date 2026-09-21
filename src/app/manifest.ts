import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cameron Carroll",
    short_name: "Cameron Carroll",
    description:
      "Cameron Carroll: aerospace and mechanical engineering student, NMSU. ROVs, avionics, and flight systems.",
    start_url: "/",
    display: "browser",
    background_color: "#bfd0d8",
    theme_color: "#3a2418",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
