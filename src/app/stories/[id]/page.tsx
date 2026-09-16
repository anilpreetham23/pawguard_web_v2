import type { Metadata } from "next";
import SuccessStoryDetailPage from "../../pages/SuccessStoryDetailPage";
import { rescueService } from "@/services/api/rescue";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pawguard-web-v2.vercel.app";

  try {
    const story = await rescueService.getSuccessStory(id);
    if (story) {
      const title = story.title || "Rescue Success Story";
      const description = story.summary || "Read real adoption and rescue stories from PawGuard.";
      const primaryPhoto = story.hero_image_url || story.cover_image_url || null;

      return {
        title: `${title} — Success Story`,
        description,
        alternates: {
          canonical: `/stories/${id}`,
        },
        openGraph: {
          title: `${title} — PawGuard Success Story`,
          description,
          url: `${baseUrl}/stories/${id}`,
          siteName: "PawGuard",
          type: "article",
          images: primaryPhoto ? [{ url: primaryPhoto, alt: title }] : undefined,
        },
        twitter: {
          card: "summary_large_image",
          title: `${title} — PawGuard Success Story`,
          description,
          images: primaryPhoto ? [primaryPhoto] : undefined,
        },
      };
    }
  } catch {
    // Fall back gracefully if backend fetching fails
  }

  return {
    title: "Success Story — PawGuard",
    description: "Read real adoption and rescue stories from PawGuard.",
    alternates: {
      canonical: `/stories/${id}`,
    },
    openGraph: {
      title: "Success Story — PawGuard",
      description: "Read real adoption and rescue stories from PawGuard.",
      url: `${baseUrl}/stories/${id}`,
      siteName: "PawGuard",
      type: "website",
    },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SuccessStoryDetailPage id={id} />;
}
