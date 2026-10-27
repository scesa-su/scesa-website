import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // /events renders per request (search params) and reads the MDX files at runtime.
  outputFileTracingIncludes: {
    "/events": ["./src/content/events/**/*"],
  },
};

export default nextConfig;
