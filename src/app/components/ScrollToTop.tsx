"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { scrollToTop } from "../../motion/scroll";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => scrollToTop()}
      aria-label="Scroll to top"
      className={`fixed bottom-6 right-6 z-40 w-11 h-11 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary-hover hover:shadow-xl transition-all duration-ui flex items-center justify-center ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <ArrowUp size={18} />
    </button>
  );
}
