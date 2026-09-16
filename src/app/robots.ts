import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pawguard-web-v2.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/account",
          "/account/*",
          "/applications",
          "/appointments",
          "/notifications",
          "/reminders",
          "/scan?*", // Protect tokenized scan query params from search index exposition
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
