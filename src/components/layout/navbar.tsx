import Image from "next/image";
import Link from "next/link";
import { getPageCategories, getSettings } from "@/lib/strapi";
import AuthSection from "./auth-section";
import DesktopDropdown from "./desktop-dropdown";
import MobileMenu from "./mobile-menu";

export default async function Navbar() {
	// Fetch data on the server
	const [settings, pageCategories] = await Promise.all([
		getSettings().catch(() => ({ siteName: "Keta Akademi", logo: null })),
		getPageCategories().catch(() => []),
	]);

	return (
		<header className="border-b bg-white shadow-sm">
			<div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-4 lg:px-2 xl:px-0">
				<div className="flex items-center justify-between py-6">
					<Link href="/" className="flex items-center">
						{settings.logo && "url" in settings.logo && (
							<Image
								src={settings.logo.url}
								alt={settings.logo.alternativeText || settings.siteName}
								width={120}
								height={40}
								priority
								className="h-8 w-auto"
							/>
						)}
						<span className="ml-2 font-bold text-gray-900 text-xl">{settings.siteName}</span>
					</Link>

					{/* Desktop Navigation Menu */}
					<nav className="hidden items-center space-x-8 md:flex">
						{pageCategories.map((category) => (
							<DesktopDropdown key={`category-${category.id}`} category={category} />
						))}
						<Link
							href="/ozel-ders"
							className="flex items-center space-x-1 font-medium text-gray-700 transition-colors hover:text-blue-600"
						>
							Özel Ders
						</Link>
					</nav>

					{/* Desktop Authentication Section */}
					<div className="hidden md:block">
						<AuthSection />
					</div>

					{/* Mobile Menu */}
					<MobileMenu pageCategories={pageCategories} />
				</div>
			</div>
		</header>
	);
}
