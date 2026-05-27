import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
        pathname: "/Itsmeakash248.png",
        search: "?size=200",
      },
    ],
  },
};

export default nextConfig;
