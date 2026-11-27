import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme/theme-toggle";
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
		<header className="bg-card/95 border-b shadow-sm backdrop-blur-md">
			<div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-4 lg:px-2 xl:px-0">
				<div className="flex items-center justify-between py-6">
					<Link href="/" className="group flex items-center">
						<Image
							src="/images/ketalearn-logo.png"
							alt=""
							width={36}
							height={36}
							className="shrink-0 transition-transform duration-300 ease-out group-hover:-rotate-6"
						/>
						<span className="text-foreground ml-2 text-xl font-bold">{settings.siteName}</span>
					</Link>

					{/* Desktop Navigation Menu */}
					<nav className="hidden min-w-0 items-center gap-5 lg:flex xl:gap-8">
						{pages.map((p) => (
							<Link
								key={p.id}
								href={p.href}
								className="text-foreground hover:text-primary focus-visible:ring-primary after:bg-accent relative block rounded p-2 font-medium after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 focus-visible:ring-2"
							>
								{p.displayName}
							</Link>
						))}

						{pageCategories.map((category) => (
							<DesktopDropdown key={`category-${category.id}`} category={category} />
						))}
					</nav>

					<div className="flex shrink-0 items-center gap-1 sm:gap-2">
						{/* Desktop Authentication Section */}
						<div className="hidden lg:block">
							<AuthSection />
						</div>
						<ThemeToggle />
						<MobileMenu pageCategories={pageCategories} />
					</div>
				</div>
			</div>
		</header>
	);
}
