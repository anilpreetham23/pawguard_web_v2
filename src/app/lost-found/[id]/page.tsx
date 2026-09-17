import type { Metadata } from "next";
import LostFoundDetailPageView from "./LostFoundDetailPageView";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Lost/Found Pet #${id}`,
    description: `View details and submit sighting reports for lost pet alert #${id}.`,
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LostFoundDetailPageView id={id} />;
}
