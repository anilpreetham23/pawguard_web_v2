import type { Metadata } from "next";
import SuccessStoriesPageView from "./SuccessStoriesPageView";

export const metadata: Metadata = {
  title: "Rescue & Adoption Success Stories",
  description: "Read inspiring stories of rescued dogs finding forever homes.",
};

export default function Page() {
  return <SuccessStoriesPageView />;
}
