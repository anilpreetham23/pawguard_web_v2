import type { Metadata } from "next";
import EducationPageView from "./EducationPageView";

export const metadata: Metadata = {
  title: "Pet Care Education",
  description: "Guides, articles, and expert advice on dog health, training, and emergency care.",
};

export default function Page() {
  return <EducationPageView />;
}
