import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
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
