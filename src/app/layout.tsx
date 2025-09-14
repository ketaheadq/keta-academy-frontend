import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import { getSettings } from "@/lib/strapi";
import { Providers } from "./provider";

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
					{ url: "/favicon/favicon.ico" },
					{ url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
					{ url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
					{
						url: "/favicon/android-chrome-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						url: "/favicon/android-chrome-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
				],
				apple: [
					{
						url: "/favicon/apple-touch-icon.png",
						sizes: "180x180",
						type: "image/png",
					},
				],
			},
			manifest: "/favicon/site.webmanifest",
		};
	} catch (error) {
		console.error("Failed to fetch settings for metadata:", error);
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
			<body className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}>
				<Providers>
					<div className="flex min-h-screen flex-col">
						<Navbar />
						<main className="mx-auto w-full max-w-6xl flex-grow py-6 sm:px-6 md:px-4 lg:px-2 xl:px-0">
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
