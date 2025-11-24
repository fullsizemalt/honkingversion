import type { NextConfig } from "next";

const upstreamApi =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://api:8000";

const nextConfig: NextConfig = {
  // Force webpack (Turbopack hits port-binding restrictions in some environments).
  webpack: (config) => config,
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
