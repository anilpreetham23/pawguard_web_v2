import type { Metadata } from "next";
import { fetchServerCachedPublicStats } from "@/lib/api/server-public-data";
import AboutPageView from "./AboutPageView";

export const metadata: Metadata = {
  title: "About Us | PawGuard",
  description: "PawGuard coordinates emergency rescue, adoption, and veterinary care. Founded by veterinarians.",
};

export default async function Page() {
  const initialStats = await fetchServerCachedPublicStats();
  return <AboutPageView initialStats={initialStats} />;
}
