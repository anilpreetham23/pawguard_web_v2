import type { Metadata } from "next";
import FosterPage from "../../pages/FosterPage";

export const metadata: Metadata = {
  title: "Apply to Foster Care | PawGuard",
  description:
    "Apply to become a PawGuard foster family. Provide temporary home care, shelter, and love for rescue dogs while they await permanent adoption.",
};

export default function Page() {
  return <FosterPage initialFocusApply={true} />;
}
