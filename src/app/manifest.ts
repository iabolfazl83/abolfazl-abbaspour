import type { MetadataRoute } from "next";
import { profile } from "@/lib/content";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name} — ${profile.role}`,
    short_name: profile.name,
    description: profile.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#030308",
    theme_color: "#030308",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
