import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dynamic and hourly-revalidated routes read the MDX files at runtime. Keys are picomatch globs, so no [slug] brackets.
  outputFileTracingIncludes: {
    "/**": ["./src/content/**/*"],
  },
};

export default nextConfig;
