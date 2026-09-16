import type { Metadata } from "next";
import EducationDetailPage from "../../pages/EducationDetailPage";
import { communityService } from "@/services/api/community";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pawguard-web-v2.vercel.app";

  try {
    const post = await communityService.getBlogPostBySlug(slug);
    if (post) {
      const title = post.title || "Pet Care Guide";
      const description = post.shortDescription || "PawGuard educational resource guide.";

      return {
        title: `${title} — Pet Education`,
        description,
        alternates: {
          canonical: `/education/${slug}`,
        },
        openGraph: {
          title: `${title} — PawGuard Education`,
          description,
          url: `${baseUrl}/education/${slug}`,
          siteName: "PawGuard",
          type: "article",
        },
        twitter: {
          card: "summary_large_image",
          title: `${title} — PawGuard Education`,
          description,
        },
      };
    }
  } catch {
    // Fall back gracefully if backend fetching fails
  }

  const fallbackTitle = slug
    ? slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "Pet Care Guide";

  return {
    title: `${fallbackTitle} — PawGuard Education`,
    description: "PawGuard educational resource guide.",
    alternates: {
      canonical: `/education/${slug}`,
    },
    openGraph: {
      title: `${fallbackTitle} — PawGuard Education`,
      description: "PawGuard educational resource guide.",
      url: `${baseUrl}/education/${slug}`,
      siteName: "PawGuard",
      type: "website",
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return <EducationDetailPage slug={resolvedParams.slug} />;
}
