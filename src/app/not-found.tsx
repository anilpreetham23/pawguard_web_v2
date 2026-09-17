import type { Metadata } from "next";
import NotFoundPageView from "./NotFoundPageView";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "The requested page could not be found on PawGuard.",
};

export default function NotFound() {
  return <NotFoundPageView />;
}
