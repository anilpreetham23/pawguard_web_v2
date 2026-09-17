import type { Metadata } from "next";
import { fetchServerCachedSuccessStoryById } from "@/lib/api/server-public-data";
import SuccessStoryDetailPageView from "./SuccessStoryDetailPageView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const story = await fetchServerCachedSuccessStoryById(id);
    if (!story) return { title: "Rescue Success Story — PawGuard" };
    const title = `${story.title} — Rescue Success Story | PawGuard`;
    const description = story.summary || story.body?.slice(0, 160) || "Read about how PawGuard rescued and rehomed this pet.";
    const image = story.hero_image_url || story.cover_image_url || "/images/hero/hero-dog.jpg";
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: image }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
    };
  } catch {
    return { title: "Rescue Success Story — PawGuard" };
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const initialStory = await fetchServerCachedSuccessStoryById(id);
  return <SuccessStoryDetailPageView id={id} initialStory={initialStory} />;
}
