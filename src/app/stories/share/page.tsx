import type { Metadata } from "next";
import ShareSuccessStoryPage from "../../pages/ShareSuccessStoryPage";

export const metadata: Metadata = {
  title: "Share Your Success Story | PawGuard",
  description:
    "Share your rescue dog's adoption journey with the PawGuard community. Every adoption inspires another family.",
};

export default function Page() {
  return <ShareSuccessStoryPage />;
}
