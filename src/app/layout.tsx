import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { connection } from "next/server";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import { getSettings } from "@/lib/strapi";
import "./globals.css";
import { Providers } from "./provider";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://ketalearn.cloud";
const SITE_NAME = "KetaLearn";
const DEFAULT_DESCRIPTION =
	"Öğrencilere üniversite sınavında başarı için tüm derslerde konu anlatımları, güncel taban-tavan puanları, bloglar ve yayınlar sunan etkileşimli eğitim platformu";

const ICONS: Metadata["icons"] = {
	icon: [
		{ url: "/favicon/ketalearn.svg", sizes: "any", type: "image/svg+xml" },
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
};

export async function generateMetadata(): Promise<Metadata> {
	// metadataBase must be set even when the CMS is unreachable: without it
	// Next.js emits no rel=canonical and resolves relative OG URLs against the
	// build host instead of the live domain.
	const base: Metadata = {
		metadataBase: new URL(SITE_URL),
		title: SITE_NAME,
		description: DEFAULT_DESCRIPTION,
		icons: ICONS,
		manifest: "/favicon/site.webmanifest",
	};

	const settings = await getSettings().catch((error: Error) => {
		console.warn(`Metadata is using built-in defaults: ${error.message}`);
		return null;
	});

	return {
		...base,
		title: settings?.siteName || SITE_NAME,
		description: settings?.defaultSEODescription || DEFAULT_DESCRIPTION,
	};
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	await connection();
	const settings = await getSettings().catch(() => null);
	const analyticsID = settings?.analyticsID || "";
	return (
		<html lang="tr">
			<head>
				<link rel="preconnect" href="https://www.google-analytics.com" />
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable}`}>
				<Providers>
					<div className="flex min-h-screen flex-col antialiased">
						<Navbar />
						<main className="mx-auto w-full max-w-6xl grow px-4 py-6 sm:px-6 md:px-4 lg:px-2 xl:px-0">
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
