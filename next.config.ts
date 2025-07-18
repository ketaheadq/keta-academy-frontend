// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        // Optional: Restrict to specific paths
      },
    ],
  },
  // Other Next.js config options can go here
};

export default nextConfig;
