import type { Metadata } from "next";
import LostFoundDetailPage from "../../pages/LostFoundDetailPage";

export const metadata: Metadata = {
  title: "Lost & Found Report",
  description:
    "A single lost-pet or found-animal report from the PawGuard Lost & Found community.",
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LostFoundDetailPage id={id} />;
}