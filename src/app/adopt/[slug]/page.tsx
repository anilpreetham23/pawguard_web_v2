import type { Metadata } from "next";
import AnimalDetailPageView from "./AnimalDetailPageView";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${title} — Adoption Profile`,
    description: `Learn more about adopting ${title} through PawGuard.`,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <AnimalDetailPageView slug={slug} />;
}
