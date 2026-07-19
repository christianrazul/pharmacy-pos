import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(process.cwd(), "../.."),
  },
  async rewrites() {
    const apiUrl = process.env.API_INTERNAL_URL?.trim();

    if (!apiUrl) {
      throw new Error("Missing required environment variable: API_INTERNAL_URL");
    }

    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
