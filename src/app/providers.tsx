"use client";

import { ThemeProvider } from "next-themes";
import { MotionProvider } from "@/motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { GlobalLoader } from "@/motion";
import PuppyProgress from "./components/PuppyProgress";
import { OfflineBanner } from "./components/OfflineBanner";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Toaster } from "./components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <MotionProvider>
        <GlobalLoader />
        <PuppyProgress />
        <OfflineBanner />
        <Navbar />
        <ErrorBoundary>
          <Toaster position="top-center" richColors closeButton />
          {children}
        </ErrorBoundary>
        <Footer />
      </MotionProvider>
    </ThemeProvider>
  );
}
