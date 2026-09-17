import type { Metadata } from "next";
import { fetchServerCachedSuccessStories } from "@/lib/api/server-public-data";
import SuccessStoriesPageView from "./SuccessStoriesPageView";

export const metadata: Metadata = {
  title: "Rescue & Adoption Success Stories | PawGuard",
  description: "Read inspiring stories of rescued dogs finding forever homes through PawGuard.",
};

export default async function Page() {
  const initialStories = await fetchServerCachedSuccessStories();
  return <SuccessStoriesPageView initialStories={initialStories} />;
}
