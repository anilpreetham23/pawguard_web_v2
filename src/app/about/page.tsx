import type { Metadata } from "next";
import AboutPageView from "./AboutPageView";

export const metadata: Metadata = {
  title: "About",
  description: "PawGuard coordinates emergency rescue, adoption, and veterinary care. Founded by veterinarians.",
};

export default function Page() {
  return <AboutPageView />;
}
