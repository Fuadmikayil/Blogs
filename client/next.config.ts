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
        source: '/api/:path*',       // frontend-də çağırdığın URL prefix
        destination: 'http://161.97.168.167/:path*' // backend IP + path
      }
    ]
  },
}


export default nextConfig;
