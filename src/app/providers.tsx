"use client";

import { ThemeProvider } from "next-themes";
import { QueryProvider } from "./providers/query-provider";
import { AuthProvider } from "./providers/auth-provider";
import { MotionProvider } from "@/motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { GlobalLoader } from "@/motion";
import PuppyProgress from "./components/PuppyProgress";
import { OfflineBanner } from "./components/OfflineBanner";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Toaster } from "./components/ui/sonner";
import AuthDialog from "./components/auth/AuthDialog";

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
