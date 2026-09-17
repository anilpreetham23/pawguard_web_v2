"use client";

import dynamic from "next/dynamic";
import { ThemeProvider } from "next-themes";
import { QueryProvider } from "./providers/query-provider";
import { AuthProvider } from "./providers/auth-provider";
import { MotionProvider } from "@/motion";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { GlobalLoader } from "@/motion";
import PuppyProgress from "@/components/shared/PuppyProgress";
import { OfflineBanner } from "@/components/shared/OfflineBanner";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { Toaster } from "@/components/ui/sonner";

const AuthDialog = dynamic(() => import("@/features/auth/AuthDialog"), {
  ssr: false,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <MotionProvider>
            <GlobalLoader />
            <PuppyProgress />
            <OfflineBanner />
            <Navbar />
            <AuthDialog />
            <ErrorBoundary>
              <Toaster position="top-center" richColors closeButton />
              {children}
            </ErrorBoundary>
            <Footer />
          </MotionProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
