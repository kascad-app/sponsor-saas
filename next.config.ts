import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: ["storage.googleapis.com", "storage.googleapis.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/kascad-staging-bucket/**",
      },
    ],
  },
};

export default nextConfig;
