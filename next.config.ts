import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
    staticGenerationRetryCount: 3,
    staticGenerationMaxConcurrency: 1,
    staticGenerationMinPagesPerWorker: 100,
  },
  reactCompiler: false,
};

export default nextConfig;
