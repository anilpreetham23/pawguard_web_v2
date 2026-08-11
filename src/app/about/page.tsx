import type { Metadata } from "next";
import AboutPage from "../pages/AboutPage";

export const metadata: Metadata = {
  title: "About",
  description:
    "PawGuard coordinates emergency rescue, adoption, and veterinary care. Founded by veterinarians.",
};

export default function Page() {
  return <AboutPage />;
}
