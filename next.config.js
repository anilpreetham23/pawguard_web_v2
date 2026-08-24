// next.config.js – Vercel production configuration
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  transpilePackages: [
    "gsap",
    "lenis",
    "motion",
    "lottie-react",
    "react-awesome-reveal",
    "react-type-animation",
  ],
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://pawguard-backend-mqri.onrender.com/api/v1/:path*",
      },
    ];
  },
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
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};
module.exports = nextConfig;
