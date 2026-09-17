import type { Metadata } from "next";
import { communityService } from "@/services/api/community";
import EducationDetailPageView from "./EducationDetailPageView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await communityService.getBlogPostBySlug(slug);
    if (!post) return { title: "Community & Education — PawGuard" };
    const title = `${post.title} — PawGuard Education`;
    const description = post.shortDescription || "Learn about dog welfare, rescue protocols, and pet care on PawGuard.";
    const image = "/images/hero/hero-dog.jpg";
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
    return { title: "Community & Education — PawGuard" };
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return <EducationDetailPageView slug={slug} />;
}
