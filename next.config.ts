import type { NextConfig } from "next";

// 'unsafe-inline' scripts: static pages carry Next's inline bootstrap without a nonce. Keystatic talks to GitHub from the browser.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  // Site fonts are self-hosted by next/font; the Keystatic editor links Inter from Google Fonts.
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://avatars.githubusercontent.com https://raw.githubusercontent.com",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self' https://api.github.com https://raw.githubusercontent.com",
  // Event pages embed a Google Maps pin.
  "frame-src https://www.google.com",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://github.com",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Production only: next dev needs 'unsafe-eval' for fast refresh.
  async headers() {
    return process.env.NODE_ENV === "production" ? [{ source: "/:path*", headers: securityHeaders }] : [];
  },
  // Dynamic and hourly-revalidated routes read the MDX files at runtime. Keys are picomatch globs, so no [slug] brackets.
  outputFileTracingIncludes: {
    "/**": ["./src/content/**/*"],
  },
};

export default nextConfig;
