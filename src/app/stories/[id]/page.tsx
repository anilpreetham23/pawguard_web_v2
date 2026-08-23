import type { Metadata } from "next";
import SuccessStoryDetailPage from "../../pages/SuccessStoryDetailPage";

export const metadata: Metadata = {
  title: "Success Story | PawGuard",
  description: "Read real adoption and rescue stories from PawGuard.",
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SuccessStoryDetailPage id={id} />;
}
