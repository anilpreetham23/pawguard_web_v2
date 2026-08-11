import type { Metadata } from "next";
import HomePage from "./pages/HomePage";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Report a dog emergency, find your next companion, or support dog rescue across 12 municipalities.",
};

export default function Page() {
  return <HomePage />;
}
