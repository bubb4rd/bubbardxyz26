import type { NextConfig } from "next";

const unsplashQuery = "?w=1200&q=80&auto=format&fit=crop";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
        search: unsplashQuery,
      },
    ],
  },
};

export default nextConfig;
