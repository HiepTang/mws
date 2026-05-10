import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    // Default is 1 MB; review submissions include a wedding photo up to 10 MB
    // (validated server-side too in the action). 12 MB gives ~2 MB of multipart
    // overhead margin. Caddy's request_body cap should match or exceed this.
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;
