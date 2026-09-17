import type { Metadata } from "next";
import EducationDetailPageView from "./EducationDetailPageView";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${title} — Pet Care Guide`,
    description: `Read expert advice on ${title}.`,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <EducationDetailPageView slug={slug} />;
}
