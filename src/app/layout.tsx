import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/site-config";

import { Providers } from "@/components/providers";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.metaTitle,
  description: siteConfig.metaDescription,
  applicationName: siteConfig.name,
  metadataBase: new URL(siteConfig.siteUrl),
  openGraph: {
    title: siteConfig.metaTitle,
    description: siteConfig.metaDescription,
    url: siteConfig.siteUrl,
    siteName: siteConfig.name,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${dmSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-zinc-900 focus:shadow-lg focus:outline-none dark:focus:bg-zinc-900 dark:focus:text-zinc-50"
          >
            Skip to content
          </a>

          <div className="min-h-dvh bg-[radial-gradient(ellipse_900px_600px_at_18%_-6%,rgba(96,165,250,0.18),transparent_58%),radial-gradient(ellipse_900px_600px_at_82%_0%,rgba(14,116,217,0.14),transparent_54%),linear-gradient(180deg,#f2f7fc_0%,#f8fbff_42%,#edf4fb_100%)] text-zinc-900 dark:bg-[radial-gradient(ellipse_900px_600px_at_18%_-6%,rgba(59,130,246,0.16),transparent_52%),radial-gradient(ellipse_900px_600px_at_82%_0%,rgba(14,116,217,0.14),transparent_50%),linear-gradient(180deg,#071120_0%,#09182d_42%,#071120_100%)] dark:text-zinc-50">
            <SiteHeader />
            <main id="content" className="pt-16">
              {children}
            </main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
