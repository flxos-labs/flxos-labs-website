import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
        pathname: "/Itsmeakash248.png",
      },
      {
        protocol: "https",
        hostname: "github.com",
        pathname: "/rekha290907.png",
      },
    ],
  },
};

export default nextConfig;
