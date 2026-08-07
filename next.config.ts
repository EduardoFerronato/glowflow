import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["recharts", "framer-motion", "@dnd-kit/core"],
  },
};

export default nextConfig;
