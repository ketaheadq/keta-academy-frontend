import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getPageCategories, getSettings } from "@/lib/strapi";
import AuthSection from "./auth-section";

interface MainLayoutProps {
	children: React.ReactNode;
}

export default async function MainLayout({ children }: MainLayoutProps) {
	// Fetch settings server-side for better SEO
	const settings = await getSettings().catch(() => ({
		siteName: "Keta Akademi",
		logo: null,
	}));

	const pageCategories = await getPageCategories();

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			{/* Header */}
			<header className="border-gray-200 border-b bg-white shadow-sm">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between py-6">
						<Link href="/" className="flex items-center">
							{settings.logo && (
								<Image
									src={settings.logo.url}
									alt={settings.logo.alternativeText || settings.siteName}
									width={120}
									height={40}
									priority
									className="h-8 w-auto"
								/>
							)}
							<span className="ml-2 font-bold text-gray-900 text-xl">
								{settings.siteName}
							</span>
						</Link>

						{/* Navigation Menu */}
						<nav className="hidden items-center space-x-8 md:flex">
							{/* Blog Sayfası Dropdown */}
							{pageCategories.map((category) => (
								<div key={`category-${category.id}`} className="group relative">
									<button
										type="button"
										className="flex items-center space-x-1 font-medium text-gray-700 transition-colors hover:text-blue-600"
									>
										<span>{category.title}</span>
										<ChevronDown className="h-4 w-4" />
									</button>
									<div className="invisible absolute top-full left-0 z-50 mt-2 w-48 rounded-md border border-gray-200 bg-white opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
										<div className="py-2">
											{category.pages.map((page) => (
												<Link
													key={`page-${page.id}`}
													href={`/sayfalar/${page.slug}`}
													className="block px-4 py-2 text-gray-700 text-sm hover:bg-gray-100 hover:text-blue-600"
												>
													{page.title}
												</Link>
											))}
										</div>
									</div>
								</div>
							))}
						</nav>

						{/* Authentication Section - Client Component */}
						<AuthSection />
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{children}
			</main>

			{/* Footer */}
			<footer className="bg-gray-900 py-12 text-white">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="grid gap-8 md:grid-cols-4">
						<div>
							<div className="mb-4 flex items-center space-x-2">
								{settings.logo && (
									<Image
										src={settings.logo.url}
										alt={settings.siteName}
										width={32}
										height={32}
										className="h-8 w-8"
									/>
								)}
								<span className="font-bold text-lg">{settings.siteName}</span>
							</div>
							<p className="text-gray-400">
								{settings.siteName}, öğrencilerin öğrenme sürecini destekleyen
								bir platformdur.
							</p>
						</div>
						<div>
							<h4 className="mb-4 font-semibold">Dersler</h4>
							<ul className="space-y-2 text-gray-400">
								<li>
									<Link href="/konular/matematik" className="hover:text-white">
										Matematik
									</Link>
								</li>
								<li>
									<Link href="/konular/fizik" className="hover:text-white">
										Fizik
									</Link>
								</li>
								<li>
									<Link href="/konular/kimya" className="hover:text-white">
										Kimya
									</Link>
								</li>
								<li>
									<Link
										href="/konular/programlama"
										className="hover:text-white"
									>
										Programlama
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h4 className="mb-4 font-semibold">Seviye</h4>
							<ul className="space-y-2 text-gray-400">
								<li>Orta Okul</li>
								<li>Lise</li>
								<li>Üniversite</li>
							</ul>
						</div>
						<div>
							<h4 className="mb-4 font-semibold">Destek</h4>
							<ul className="space-y-2 text-gray-400">
								<li>
									<Link href="/yardim" className="hover:text-white">
										Yardım Merkezi
									</Link>
								</li>
								<li>
									<Link href="/iletisim" className="hover:text-white">
										İletişim
									</Link>
								</li>
								<li>
									<Link href="/gizlilik" className="hover:text-white">
										Gizlilik Politikası
									</Link>
								</li>
								<li>
									<Link href="/hizmet-sartlari" className="hover:text-white">
										Hizmet Şartları
									</Link>
								</li>
							</ul>
						</div>
					</div>
					<div className="mt-8 border-gray-800 border-t pt-8 text-center text-gray-400">
						<p>&copy; 2024 {settings.siteName}. Tüm hakları saklıdır.</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
