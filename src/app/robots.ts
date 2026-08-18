import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://pawguard-public-web.vercel.app";

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
