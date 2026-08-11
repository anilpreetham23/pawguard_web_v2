import type { Metadata } from "next";
import SuccessStoriesPage from "../pages/SuccessStoriesPage";

export const metadata: Metadata = {
  title: "Success Stories",
  description:
    "Read real adoption and rescue stories from PawGuard. Every number has a name.",
};

export default function Page() {
  return <SuccessStoriesPage />;
}
