import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CookieConsent from "@/components/cookie-consent";
import { getSettings } from "@/lib/strapi";
import { Providers } from "./provider";
import { GoogleAnalytics } from '@next/third-parties/google';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSettings();

    return {
      title: settings.siteName,
      description:
        settings.defaultSEODescription ||
        "Öğrencilere üniversite sınavında başarı için tüm derslerde konu anlatımları, güncel taban-tavan puanları, bloglar ve yayınlar sunan etkileşimli eğitim platformu",
      icons: {
        icon: [
          {
            url: settings.favicon?.url || "/logo.svg",
            type: "image/svg+xml",
          },
        ],
        shortcut: settings.favicon?.url || "/logo.svg",
        apple: settings.favicon?.url || "/logo.svg",
      },
    };
  } catch (_error) {
    // Fallback metadata if Strapi is not available
    return {
      title: "LearnHub - Interactive Learning Platform",
      description:
        "Empowering students to learn and grow through interactive education across all subjects and grades.",
      icons: {
        icon: "/logo.svg",
        shortcut: "/logo.svg",
        apple: "/logo.svg",
      },
    };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  let analyticsID = "";
  try {
    const settings = await getSettings();
    analyticsID = settings.analyticsID || "";
  } catch (error) {
    console.error("Failed to fetch settings for Google Analytics:", error);
  }
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://www.google-analytics.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow w-full max-w-6xl mx-auto sm:px-6 md:px-4 lg:px-2 xl:px-0 py-6">
              {children}
            </main>
            <Footer />
          </div>
          {/* Analytics and Consent */}
          {analyticsID && <GoogleAnalytics gaId={analyticsID} />}
        </Providers>
      </body>
    </html>
  );
}
