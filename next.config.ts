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
    ],
  },

  /* ── ESM-only packages that need transpilation ────────────────────── */
  transpilePackages: [
    "gsap",
    "lenis",
    "motion",
    "lottie-react",
    "react-awesome-reveal",
    "react-type-animation",
  ],

  /* ── Security & cache headers (migrated from vercel.json) ─────────── */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
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
