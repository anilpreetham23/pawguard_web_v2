import type { Metadata } from "next";
import { lostFoundService } from "@/services/api/lost-found";
import LostFoundDetailPageView from "./LostFoundDetailPageView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const report = await lostFoundService.getReportById(id);
    if (!report) return { title: "Lost & Found Report — PawGuard" };
    const kindLabel = report.kind === "lost" ? "Lost" : "Found";
    const title = `${kindLabel} Pet Report: ${report.petName} (${report.breed || "Dog"}) — PawGuard`;
    const description = report.description || `${kindLabel} ${report.breed || "dog"} in ${report.location}. Help reunite this pet!`;
    const image = report.photoUrl || "/images/hero/hero-dog.jpg";
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
    return { title: "Lost & Found Report — PawGuard" };
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <LostFoundDetailPageView id={id} />;
}
