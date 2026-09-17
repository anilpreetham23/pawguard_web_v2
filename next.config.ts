import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* ── React & Compiler ─────────────────────────────────────────────── */
  reactStrictMode: true,

  /* ── Image optimisation ───────────────────────────────────────────── */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "pawguard-backend-mqri.onrender.com",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
    ],
  },

  /* ── ESM-only packages that need transpilation ────────────────────── */
  transpilePackages: [
    "gsap",
    "lenis",
    "motion",
    "lottie-react",
    "react-awesome-reveal",
  ],

  /* ── API Rewrites (Same-origin HttpOnly Cookie Proxy) ─────────────── */
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://pawguard-backend-mqri.onrender.com/api/v1/:path*",
      },
    ];
  },

  /* ── Security & cache headers (migrated from vercel.json) ─────────── */
  async headers() {
    const cspHeader = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://*.razorpay.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://pawguard-backend-mqri.onrender.com https://*.razorpay.com wss:",
      "frame-src 'self' https://api.razorpay.com https://*.razorpay.com",
      "media-src 'self' blob: data:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: cspHeader },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=(self)" },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  /* ── Webpack customisation (handles raw video + Lottie JSON) ──────── */
  webpack(config) {
    // Video files → asset/resource (returns a URL)
    config.module.rules.push({
      test: /\.(mp4|webm|ogg)$/,
      type: "asset/resource",
      generator: {
        filename: "static/media/[name].[hash:8][ext]",
      },
    });

    return config;
  },
};

export default nextConfig;
