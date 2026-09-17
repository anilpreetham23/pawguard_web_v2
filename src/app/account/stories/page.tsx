import type { Metadata } from "next";
import MySuccessStoriesPageView from "./MySuccessStoriesPageView";

export const metadata: Metadata = {
  title: "My Shared Stories",
  description: "Track your submitted rescue and adoption success stories.",
};

export default function Page() {
  return <MySuccessStoriesPageView />;
}
