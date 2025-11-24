import type { NextConfig } from "next";

const upstreamApi =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://api:8000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/hv/:path*",
        destination: `${upstreamApi}/:path*`,
      },
    ];
  },
};

export default nextConfig;
