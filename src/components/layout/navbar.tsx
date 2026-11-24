import Image from "next/image";
import Link from "next/link";
import { pages } from "@/lib/navbar-page-links";
import { getPageCategories, getSettings } from "@/lib/strapi";
import AuthSection from "./auth-section";
import DesktopDropdown from "./desktop-dropdown";
import MobileMenu from "./mobile-menu";

export default async function Navbar() {
	// Fetch data on the server
	const [settings, pageCategories] = await Promise.all([
		getSettings().catch(() => ({ siteName: "KetaLearn" })),
		getPageCategories().catch(() => []),
	]);

	return (
		<header className="border-b bg-white shadow-sm">
			<div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-4 lg:px-2 xl:px-0">
				<div className="flex items-center justify-between py-6">
					<Link href="/" className="flex items-center">
						<Image
							src="/images/ketalearn-logo.png"
							alt=""
							width={36}
							height={36}
							className="shrink-0"
							unoptimized
						/>
						<span className="text-foreground ml-2 text-xl font-bold">{settings.siteName}</span>
					</Link>

					{/* Desktop Navigation Menu */}
					<nav className="hidden items-center gap-8 lg:flex">
						{pages.map((p) => (
							<Link
								key={p.id}
								href={p.href}
								className="text-foreground hover:text-primary focus-visible:ring-primary block rounded p-2 font-medium focus-visible:ring-2"
							>
								{p.displayName}
							</Link>
						))}

						{pageCategories.map((category) => (
							<DesktopDropdown key={`category-${category.id}`} category={category} />
						))}
					</nav>

					{/* Desktop Authentication Section */}
					<div className="hidden lg:block">
						<AuthSection />
					</div>

					{/* Mobile Menu */}
					<MobileMenu pageCategories={pageCategories} />
				</div>
			</div>
		</header>
	);
}
