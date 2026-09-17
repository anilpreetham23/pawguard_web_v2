import type { Metadata } from "next";
import AdoptionPageView from "./AdoptionPageView";

export const metadata: Metadata = {
  title: "Adopt a Pet",
  description: "Browse verified rescue dogs available for adoption.",
};

export default function Page() {
  return <AdoptionPageView />;
}
