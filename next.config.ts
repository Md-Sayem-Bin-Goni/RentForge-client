import type { NextConfig } from "next";

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const backendUrl = rawApiUrl.trim().replace(/\/+$/, "");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/equipment/:path*",
        destination: `${backendUrl}/api/equipment/:path*`,
      },
      {
        source: "/api/favorites/:path*",
        destination: `${backendUrl}/api/favorites/:path*`,
      },
      {
        source: "/api/bookings/:path*",
        destination: `${backendUrl}/api/bookings/:path*`,
      },
      {
        source: "/api/payments/:path*",
        destination: `${backendUrl}/api/payments/:path*`,
      },
      {
        source: "/api/users/:path*",
        destination: `${backendUrl}/api/users/:path*`,
      },
      {
        source: "/api/analytics/:path*",
        destination: `${backendUrl}/api/analytics/:path*`,
      },
      {
        source: "/api/jwt",
        destination: `${backendUrl}/api/jwt`,
      },
    ];
  },
  experimental: {
    agentFeedback: true,
    staticGenerationRetryCount: 3,
    staticGenerationMaxConcurrency: 1,
    staticGenerationMinPagesPerWorker: 100,
  },
  reactCompiler: false,
};

export default nextConfig;
