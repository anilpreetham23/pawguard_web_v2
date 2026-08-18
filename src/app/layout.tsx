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
    icon: {
      url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%2300236f'/%3E%3Cpath d='M16 4c-3 0-5.5 2.5-5.5 5.5 0 1.6.7 3 1.8 3.9-2.1.9-3.6 2.9-3.6 5.1 0 3.2 2.6 5.8 5.8 5.8h4c3.2 0 5.8-2.6 5.8-5.8 0-2.2-1.5-4.2-3.6-5.1 1.1-.9 1.8-2.3 1.8-3.9C21.5 6.5 19 4 16 4z' fill='white'/%3E%3C/svg%3E",
      type: "image/svg+xml",
    },
    apple: {
      url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%2300236f'/%3E%3Cpath d='M16 4c-3 0-5.5 2.5-5.5 5.5 0 1.6.7 3 1.8 3.9-2.1.9-3.6 2.9-3.6 5.1 0 3.2 2.6 5.8 5.8 5.8h4c3.2 0 5.8-2.6 5.8-5.8 0-2.2-1.5-4.2-3.6-5.1 1.1-.9 1.8-2.3 1.8-3.9C21.5 6.5 19 4 16 4z' fill='white'/%3E%3C/svg%3E",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#00236f",
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
