import type { Metadata } from "next";
import { adoptionService } from "@/services/api/adoption";
import AnimalDetailPageView from "./AnimalDetailPageView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const dog = await adoptionService.getDog(slug);
    if (!dog) return { title: "Pet Detail — PawGuard" };
    const title = `${dog.name} (${dog.breed || "Dog"}) — Adopt on PawGuard`;
    const description = dog.temperament || `Meet ${dog.name}, a ${dog.gender || ""} ${dog.breed || "dog"} looking for a loving home on PawGuard.`;
    const image = dog.photo_url || dog.image_url || "/images/hero/hero-dog.jpg";
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
    return { title: "Adopt a Pet — PawGuard" };
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return <AnimalDetailPageView slug={slug} />;
}
