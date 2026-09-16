import type { Metadata } from "next";
import LostFoundDetailPage from "../../pages/LostFoundDetailPage";
import { lostFoundService } from "@/services/api/lost-found";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pawguard-web-v2.vercel.app";
  const shortId = id ? id.slice(0, 8).toUpperCase() : "Report";

  try {
    const report = await lostFoundService.getReportById(id);
    if (report) {
      const isLost = report.kind === "lost";
      const petName = report.petName || (isLost ? "Missing Pet" : "Found Animal");
      const location = report.location || "Nearby";
      const title = `${isLost ? "Lost Pet Alert" : "Found Animal Report"}: ${petName} (#${shortId})`;
      const description = `${isLost ? "HELP LOCATE" : "FOUND ANIMAL"}: ${petName} in/near ${location}. ${report.description || "Submit a sighting report to help reunite this pet with their family."}`;
      const primaryPhoto = report.photoUrl || (Array.isArray(report.galleryPhotoUrls) && report.galleryPhotoUrls.length > 0 ? report.galleryPhotoUrls[0] : null);

      return {
        title,
        description,
        alternates: {
          canonical: `/lost-found/${id}`,
        },
        openGraph: {
          title: `${title} — PawGuard`,
          description,
          url: `${baseUrl}/lost-found/${id}`,
          siteName: "PawGuard",
          type: "website",
          images: primaryPhoto ? [{ url: primaryPhoto, alt: petName }] : undefined,
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

  return {
    title: `Lost & Found Report #${shortId}`,
    description: `View lost pet or found animal report #${shortId} on PawGuard. Help reunite missing pets with their families by submitting a sighting.`,
    alternates: {
      canonical: `/lost-found/${id}`,
    },
    openGraph: {
      title: `Lost & Found Report #${shortId} — PawGuard Alert`,
      description: `View lost/found animal details for report #${shortId}. Submit sightings to help reunite missing pets.`,
      url: `${baseUrl}/lost-found/${id}`,
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