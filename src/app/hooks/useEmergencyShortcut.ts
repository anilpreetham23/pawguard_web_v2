"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useEmergencyShortcut() {
  const router = useRouter();

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "e" || e.key === "E") {
        if (
          document.activeElement?.tagName === "INPUT" ||
          document.activeElement?.tagName === "TEXTAREA" ||
          document.activeElement?.tagName === "SELECT"
        ) return;
        e.preventDefault();
        router.push("/emergency");
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [router]);
}
