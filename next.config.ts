import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Required allowlist since Next.js 16. 75 = default, 90 = hero/editorial imagery.
    qualities: [75, 90],
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Sample photography (Unsplash License) — replaced once real project imagery is supplied.
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
