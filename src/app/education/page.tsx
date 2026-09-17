import type { Metadata } from "next";
import { fetchServerCachedBlogPosts } from "@/lib/api/server-public-data";
import EducationPageView from "./EducationPageView";

export const metadata: Metadata = {
  title: "Pet Care Education | PawGuard",
  description: "Guides, articles, and expert advice on dog health, training, and emergency care.",
};

export default async function Page() {
  const initialPosts = await fetchServerCachedBlogPosts();
  return <EducationPageView initialPosts={initialPosts} />;
}
