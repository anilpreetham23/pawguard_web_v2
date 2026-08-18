import type { Metadata } from "next";
import LostFoundDetailPage from "../../pages/LostFoundDetailPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const shortId = id ? id.slice(0, 8).toUpperCase() : "Report";

  return {
    title: `Lost & Found Report #${shortId}`,
    description: `View lost pet or found animal report #${shortId} on PawGuard. Help reunite missing pets with their families by submitting a sighting.`,
    alternates: {
      canonical: `/lost-found/${id}`,
    },
    openGraph: {
      title: `Lost & Found Report #${shortId} — PawGuard Alert`,
      description: `View lost/found animal details for report #${shortId}. Submit sightings to help reunite missing pets.`,
      url: `https://pawguard-public-web.vercel.app/lost-found/${id}`,
      siteName: "PawGuard",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Lost & Found Alert #${shortId} — PawGuard`,
      description: `Help locate missing pets or report sightings for report #${shortId}.`,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LostFoundDetailPage id={id} />;
}