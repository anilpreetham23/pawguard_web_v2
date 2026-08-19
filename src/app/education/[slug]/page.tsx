import type { Metadata } from "next";
import EducationDetailPage from "../../pages/EducationDetailPage";

export const metadata: Metadata = {
  title: "Guide Detail | PawGuard Education",
  description: "PawGuard educational resource guide.",
};

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return <EducationDetailPage slug={resolvedParams.slug} />;
}
