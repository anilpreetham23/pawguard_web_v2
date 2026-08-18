import type { Metadata } from "next";
import AnimalDetailPage from "../../pages/AnimalDetailPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const name = slug
    ? slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "Companion Pet";

  return {
    title: `Adopt ${name}`,
    description: `Meet ${name}, a dog available for adoption through PawGuard.`,
    alternates: {
      canonical: `/adopt/${slug}`,
    },
    openGraph: {
      title: `Adopt ${name} — PawGuard`,
      description: `Meet ${name}, a dog available for adoption through PawGuard.`,
      url: `https://pawguard-public-web.vercel.app/adopt/${slug}`,
      siteName: "PawGuard",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Adopt ${name} — PawGuard`,
      description: `Meet ${name}, a dog available for adoption through PawGuard.`,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <AnimalDetailPage slug={slug} />;
}
