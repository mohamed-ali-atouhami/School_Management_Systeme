import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "utfs.io",
        protocol: "https",
      },
      {
        hostname: "images.pexels.com",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
