import type { Metadata } from "next";
import AnimalDetailPage from "../../pages/AnimalDetailPage";
import { adoptionService } from "@/services/api/adoption";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pawguard-web-v2.vercel.app";

  try {
    const dog = await adoptionService.getDog(slug);
    if (dog) {
      const dogName = dog.name || "Companion Pet";
      const breed = dog.breed ? ` (${dog.breed})` : "";
      const title = `Adopt ${dogName}${breed}`;
      const description = `Meet ${dogName}, a ${dog.estimated_age || ""} ${dog.gender || ""} ${dog.breed || "dog"} available for adoption through PawGuard.`;
      const primaryPhoto = Array.isArray(dog.photos) && dog.photos.length > 0 ? dog.photos[0] : null;

      return {
        title,
        description,
        alternates: {
          canonical: `/adopt/${slug}`,
        },
        openGraph: {
          title: `${title} — PawGuard`,
          description,
          url: `${baseUrl}/adopt/${slug}`,
          siteName: "PawGuard",
          type: "website",
          images: primaryPhoto ? [{ url: primaryPhoto, alt: dogName }] : undefined,
        },
        twitter: {
          card: "summary_large_image",
          title: `${title} — PawGuard`,
          description,
          images: primaryPhoto ? [primaryPhoto] : undefined,
        },
      };
    }
  } catch {
    // Fall back gracefully if backend fetching fails or entity is missing
  }

  const fallbackName = slug
    ? slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "Companion Pet";

  return {
    title: `Adopt ${fallbackName}`,
    description: `Meet ${fallbackName}, a dog available for adoption through PawGuard.`,
    alternates: {
      canonical: `/adopt/${slug}`,
    },
    openGraph: {
      title: `Adopt ${fallbackName} — PawGuard`,
      description: `Meet ${fallbackName}, a dog available for adoption through PawGuard.`,
      url: `${baseUrl}/adopt/${slug}`,
      siteName: "PawGuard",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Adopt ${fallbackName} — PawGuard`,
      description: `Meet ${fallbackName}, a dog available for adoption through PawGuard.`,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <AnimalDetailPage slug={slug} />;
}
