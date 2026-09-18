import type { Metadata } from "next";
import {
  fetchServerCachedPublicStats,
  fetchServerCachedAdoptableDogs,
  fetchServerCachedSuccessStories,
  fetchServerCachedBlogPosts,
} from "@/lib/api/server-public-data";
import HomePageView from "./HomePageView";

export const metadata: Metadata = {
  title: "PawGuard — Emergency Pet Rescue, Adoption & Safety Network",
  description: "PawGuard coordinates emergency rescue, adoption, and veterinary care.",
};

export default async function Page() {
  const [initialStats, initialDogs, initialStories, initialBlogPosts] = await Promise.all([
    fetchServerCachedPublicStats(),
    fetchServerCachedAdoptableDogs(),
    fetchServerCachedSuccessStories(),
    fetchServerCachedBlogPosts(),
  ]);

  return (
    <HomePageView
      initialStats={initialStats}
      initialDogs={initialDogs}
      initialStories={initialStories}
      initialBlogPosts={initialBlogPosts}
    />
  );
}
