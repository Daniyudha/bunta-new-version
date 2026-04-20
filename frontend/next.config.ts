import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "irigasibunta.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "192.168.1.106",
      },
    ],
    formats: ["image/webp", "image/avif"],
  },
  rewrites: async () => [
    {
      source: '/api/auth/:path*',
      destination: '/api/auth/:path*',
    },
    {
      source: '/api/:path*',
      destination: 'http://localhost:5001/api/:path*',
    },
  ],
};

export default nextConfig;
