import type { MetadataRoute } from "next";
import { adoptionService } from "@/services/api/adoption";
import { lostFoundService } from "@/services/api/lost-found";
import { rescueService } from "@/services/api/rescue";
import { communityService } from "@/services/api/community";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pawguard-web-v2.vercel.app";

  const publicRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/emergency`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/adopt`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/lost-found`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/veterinary`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/stories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/education`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/foster`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/volunteer`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/donate`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/data-usage`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/adoption-agreement`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Safely fetch dynamic content entries using Promise.allSettled
  const [dogsResult, lostResult, foundResult, storiesResult, blogResult] =
    await Promise.allSettled([
      adoptionService.listDogs({ page_size: 100 }),
      lostFoundService.listLost({ page_size: 100 }),
      lostFoundService.listFound({ page_size: 100 }),
      rescueService.getSuccessStories(),
      communityService.getBlogPosts(),
    ]);

  const seenUrls = new Set<string>(publicRoutes.map((r) => r.url));

  // Dynamic adoptable dog entries
  if (dogsResult.status === "fulfilled" && Array.isArray(dogsResult.value?.items)) {
    for (const dog of dogsResult.value.items) {
      if (dog?.id) {
        const url = `${baseUrl}/adopt/${dog.id}`;
        if (!seenUrls.has(url)) {
          seenUrls.add(url);
          publicRoutes.push({
            url,
            lastModified: dog.updated_at ? new Date(dog.updated_at) : new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
          });
        }
      }
    }
  }

  // Dynamic lost pet report entries
  if (lostResult.status === "fulfilled" && Array.isArray(lostResult.value?.items)) {
    for (const report of lostResult.value.items) {
      if (report?.id) {
        const url = `${baseUrl}/lost-found/${report.id}`;
        if (!seenUrls.has(url)) {
          seenUrls.add(url);
          publicRoutes.push({
            url,
            lastModified: report.created_at ? new Date(report.created_at) : new Date(),
            changeFrequency: "daily",
            priority: 0.7,
          });
        }
      }
    }
  }

  // Dynamic found pet report entries
  if (foundResult.status === "fulfilled" && Array.isArray(foundResult.value?.items)) {
    for (const report of foundResult.value.items) {
      if (report?.id) {
        const url = `${baseUrl}/lost-found/${report.id}`;
        if (!seenUrls.has(url)) {
          seenUrls.add(url);
          publicRoutes.push({
            url,
            lastModified: report.created_at ? new Date(report.created_at) : new Date(),
            changeFrequency: "daily",
            priority: 0.7,
          });
        }
      }
    }
  }

  // Dynamic rescue success stories
  if (storiesResult.status === "fulfilled" && Array.isArray(storiesResult.value)) {
    for (const story of storiesResult.value) {
      const identifier = story.slug || story.id;
      if (identifier) {
        const url = `${baseUrl}/stories/${identifier}`;
        if (!seenUrls.has(url)) {
          seenUrls.add(url);
          publicRoutes.push({
            url,
            lastModified: story.published_at ? new Date(story.published_at) : new Date(),
            changeFrequency: "weekly",
            priority: 0.6,
          });
        }
      }
    }
  }

  // Dynamic education article entries
  if (blogResult.status === "fulfilled" && Array.isArray(blogResult.value)) {
    for (const post of blogResult.value) {
      if (post?.slug) {
        const url = `${baseUrl}/education/${post.slug}`;
        if (!seenUrls.has(url)) {
          seenUrls.add(url);
          publicRoutes.push({
            url,
            lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
            changeFrequency: "monthly",
            priority: 0.6,
          });
        }
      }
    }
  }

  return publicRoutes;
}
