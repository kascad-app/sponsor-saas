import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: ["storage.googleapis.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/kascad-staging-bucket/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/kascad-production-bucket/**",
      },
    ],
  },
};

export default nextConfig;
