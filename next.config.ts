import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/highlights",
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
        source: "/courses",
        destination: "/",
      },
      {
        source: "/placements",
        destination: "/",
      },
      {
        source: "/testimonials",
        destination: "/",
      },
      {
        source: "/faq",
        destination: "/",
      },
      {
        source: "/noida/highlights",
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
        source: "/noida/courses",
        destination: "/noida",
      },
      {
        source: "/noida/placements",
        destination: "/noida",
      },
      {
        source: "/noida/testimonials",
        destination: "/noida",
      },
      {
        source: "/noida/faq",
        destination: "/noida",
      },
      {
        source: "/gurgaon/highlights",
        destination: "/gurgaon",
      },
      {
        source: "/gurgaon/curriculum",
        destination: "/gurgaon",
      },
      {
        source: "/gurgaon/pricing",
        destination: "/gurgaon",
      },
      {
        source: "/gurgaon/courses",
        destination: "/gurgaon",
      },
      {
        source: "/gurgaon/placements",
        destination: "/gurgaon",
      },
      {
        source: "/gurgaon/testimonials",
        destination: "/gurgaon",
      },
      {
        source: "/gurgaon/faq",
        destination: "/gurgaon",
      },
    ];
  },
};

export default nextConfig;
