import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    optimizePackageImports: ["recharts", "framer-motion", "@dnd-kit/core"],
  },
};

export default nextConfig;
