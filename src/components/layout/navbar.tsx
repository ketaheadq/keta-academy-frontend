import Image from "next/image";
import Link from "next/link";
import { getPageCategories, getSettings } from "@/lib/strapi";
import AuthSection from "./auth-section";
import DesktopDropdown from "./desktop-dropdown";
import MobileMenu from "./mobile-menu";
import {pages} from "@/lib/navbar-page-links";

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
						<span className="ml-2 font-bold text-foreground text-xl">{settings.siteName}</span>
					</Link>

					{/* Desktop Navigation Menu */}
					<nav className="hidden items-center gap-8 lg:flex">
						{pages.map((p , i) => (
							<Link
								href={p.href}
								className="block rounded p-2 font-medium text-foreground hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"
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
