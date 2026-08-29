import type { Metadata, Viewport } from "next";
import { Inter, DM_Serif_Display, Barlow_Condensed, JetBrains_Mono } from "next/font/google";
import { Providers } from "./providers";
import "@/styles/index.css";

/* ── Self-hosted Google Fonts via next/font ──────────────────────── */

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-condensed",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

/* ── Global metadata ─────────────────────────────────────────────── */

export const metadata: Metadata = {
  metadataBase: new URL("https://pawguard-public-web.vercel.app"),
  title: {
    default: "PawGuard — You see a dog in need. We dispatch help within minutes.",
    template: "%s — PawGuard",
  },
  description:
    "You see a dog in danger. We dispatch help within 12 minutes. Report emergencies, adopt a companion, or support rescue operations in your community.",
  keywords: [
    "dog rescue",
    "pet adoption",
    "emergency vet",
    "dog shelter",
    "donate dog rescue",
    "volunteer dog rescue",
    "safety tag scan",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "PawGuard — Emergency Dog Rescue & Companion Care Network",
    description:
      "You see a dog in danger. We dispatch help within 12 minutes. Report emergencies, adopt a companion, or support rescue operations.",
    url: "https://pawguard-public-web.vercel.app",
    siteName: "PawGuard",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1200&h=630&fit=crop&auto=format",
        width: 1200,
        height: 630,
        alt: "PawGuard Emergency Dog Rescue Network",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PawGuard — Emergency Dog Rescue & Companion Care",
    description: "Report emergencies, adopt a companion, or support rescue operations in your community.",
    images: ["https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1200&h=630&fit=crop&auto=format"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/images/rescue-process/assets/Logo.png",
    apple: "/images/rescue-process/assets/Logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#1E3A8A",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/* ── Root Layout ─────────────────────────────────────────────────── */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "PawGuard",
    "url": "https://pawguard-public-web.vercel.app",
    "description": "Coordinating emergency rescue, adoption, and veterinary care for dogs across the region.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9876543210",
      "contactType": "emergency",
      "availableLanguage": ["en", "hi"]
    }
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${dmSerif.variable} ${barlowCondensed.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Preload hero image for LCP */}
        <link
          rel="preload"
          href="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop&auto=format"
          as="image"
          fetchPriority="high"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Providers>
          <div id="root">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
