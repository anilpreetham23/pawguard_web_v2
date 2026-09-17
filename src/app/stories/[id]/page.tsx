import type { Metadata } from "next";
import SuccessStoryDetailPageView from "./SuccessStoryDetailPageView";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Success Story #${id}`,
    description: `Read rescue success story #${id}.`,
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SuccessStoryDetailPageView id={id} />;
}
