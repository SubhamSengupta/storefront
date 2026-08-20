import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // DummyJSON serves all product imagery from this CDN host.
    // Scoped as tightly as the provider allows to avoid an open image proxy.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
