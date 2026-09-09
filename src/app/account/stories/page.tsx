import type { Metadata } from "next";
import MySuccessStoriesPage from "../../pages/MySuccessStoriesPage";

export const metadata: Metadata = {
  title: "My Success Stories | PawGuard Account",
  description: "View and track the status of your submitted adoption success stories.",
};

export default function Page() {
  return <MySuccessStoriesPage />;
}
