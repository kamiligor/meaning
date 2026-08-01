import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["@resvg/resvg-js"],
  // Flutter web (fiszki) w /public/words — czysty adres /words/ -> index.html.
  async rewrites() {
    return [
      { source: "/words", destination: "/words/index.html" },
      { source: "/words/", destination: "/words/index.html" },
    ];
  },
};

export default nextConfig;
