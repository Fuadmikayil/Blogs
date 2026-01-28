import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: '/api2/:path*',
        destination: 'http://45.94.209.96/api2/:path*',
      },
    ];
  },
};

export default nextConfig;
