import type { Metadata } from "next";
import DonatePage from "../pages/DonatePage";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support dog rescue with a tax-deductible donation. 78% of every dollar goes directly to dog care.",
};

export default function Page() {
  return <DonatePage />;
}
