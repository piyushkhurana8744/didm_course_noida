import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/heighlights",
        destination: "/",
      },
      {
        source: "/curriculum",
        destination: "/",
      },
      {
        source: "/pricing",
        destination: "/",
      },
      {
        source: "/placements",
        destination: "/",
      },
      {
        source: "/faq",
        destination: "/",
      },
      {
        source: "/noida/heighlights",
        destination: "/noida",
      },
      {
        source: "/noida/curriculum",
        destination: "/noida",
      },
      {
        source: "/noida/pricing",
        destination: "/noida",
      },
      {
        source: "/noida/placements",
        destination: "/noida",
      },
      {
        source: "/noida/faq",
        destination: "/noida",
      },
    ];
  },
};

export default nextConfig;
