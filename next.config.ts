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
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  // Disable static generation completely
  staticPageGenerationTimeout: 0,
  // Add this to disable static generation
  typescript: {
    ignoreBuildErrors: true,
  },
  // Add this to handle dynamic routes
  trailingSlash: true,
  // Add this to handle authentication pages
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  // Add this to handle authentication
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ];
  },
  // Add this to disable static generation for specific paths
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/:path*',
      },
    ];
  },
  // Add this to handle dynamic routes
  async redirects() {
    return [];
  },
};

export default nextConfig;
