import type { Metadata } from "next";
import AnimalDetailPage from "../../pages/AnimalDetailPage";

export const metadata: Metadata = {
  title: "Adopt",
  description:
    "Meet the introduction, health, and story of a PawGuard dog waiting for a home.",
};

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <AnimalDetailPage slug={slug} />;
}
