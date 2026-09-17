import { Suspense } from "react";
import type { Metadata } from "next";
import ShareSuccessStoryPageView from "./ShareSuccessStoryPageView";

export const metadata: Metadata = {
  title: "Share Your Rescue Story",
  description: "Submit your pet adoption or rescue success story to inspire the community.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ShareSuccessStoryPageView />
    </Suspense>
  );
}
