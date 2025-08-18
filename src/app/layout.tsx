import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/layout/main-layout";
import { getSettings } from "@/lib/strapi";

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
				"Empowering students to learn and grow through interactive education across all subjects and grades.",
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

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<MainLayout>{children}</MainLayout>
			</body>
		</html>
	);
}
