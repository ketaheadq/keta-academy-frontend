"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
	getPageCategories,
	getSettings,
	type StrapiPageCategory,
	type StrapiSettings,
} from "@/lib/strapi";
import AuthSection from "./auth-section";

export default function Navbar() {
	const [settings, setSettings] = useState<StrapiSettings | { siteName: string; logo: null }>({
		siteName: "Keta Akademi",
		logo: null,
	});
	const [pageCategories, setPageCategories] = useState<StrapiPageCategory[]>([]);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [openCategory, setOpenCategory] = useState<number | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [settingsData, categoriesData] = await Promise.all([
					getSettings().catch(() => ({ siteName: "Keta Akademi", logo: null })),
					getPageCategories(),
				]);
				setSettings(settingsData);
				setPageCategories(categoriesData);
			} catch (error) {
				console.error("Error fetching navbar data:", error);
			}
		};

		fetchData();
	}, []);

	const toggleMobileMenu = () => {
		const newState = !isMobileMenuOpen;
		setIsMobileMenuOpen(newState);
		setOpenCategory(null); // Close any open categories when toggling main menu

		// Prevent body scroll when mobile menu is open
		if (newState) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
	};

	const toggleCategory = (categoryId: number) => {
		setOpenCategory(openCategory === categoryId ? null : categoryId);
	};

	const closeMobileMenu = () => {
		setIsMobileMenuOpen(false);
		setOpenCategory(null);
		document.body.style.overflow = "unset";
	};

	// Clean up body overflow on unmount and handle ESC key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isMobileMenuOpen) {
				closeMobileMenu();
			}
		};

		document.addEventListener("keydown", handleEscape);

		return () => {
			document.body.style.overflow = "unset";
			document.removeEventListener("keydown", handleEscape);
		};
	}, [isMobileMenuOpen, closeMobileMenu]);

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
							<div key={`category-${category.id}`} className="group relative">
								<button
									type="button"
									className="flex items-center space-x-1 font-medium text-gray-700 transition-colors hover:text-blue-600"
								>
									<span>{category.title}</span>
									<ChevronDown className="h-4 w-4" />
								</button>
								<div className="invisible absolute top-full left-0 z-50 mt-2 w-48 rounded-md border bg-white opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
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

					{/* Desktop Authentication Section */}
					<div className="hidden md:block">
						<AuthSection />
					</div>

					{/* Mobile Menu Button */}
					<button
						type="button"
						onClick={toggleMobileMenu}
						className="rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 md:hidden"
						aria-label="Toggle mobile menu"
					>
						{isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
					</button>
				</div>

				{/* Mobile Navigation Menu */}
				{isMobileMenuOpen && (
					<div className="slide-in-from-top-2 animate-in border-t bg-white duration-200 md:hidden">
						<div className="max-h-[calc(100vh-80px)] space-y-4 overflow-y-auto px-4 py-4">
							{/* Mobile Navigation Categories */}
							{pageCategories.map((category) => (
								<div key={`mobile-category-${category.id}`}>
									<button
										type="button"
										onClick={() => toggleCategory(category.id)}
										className="flex w-full items-center justify-between py-3 font-medium text-gray-700 hover:text-blue-600 focus:text-blue-600 focus:outline-none"
										aria-expanded={openCategory === category.id}
										aria-controls={`mobile-submenu-${category.id}`}
									>
										<span>{category.title}</span>
										<ChevronDown
											className={`h-4 w-4 transition-transform duration-200 ${
												openCategory === category.id ? "rotate-180" : ""
											}`}
										/>
									</button>
									{openCategory === category.id && (
										<div
											id={`mobile-submenu-${category.id}`}
											className="slide-in-from-top-1 mt-2 ml-4 animate-in space-y-2 duration-150"
										>
											{category.pages.map((page) => (
												<Link
													key={`mobile-page-${page.id}`}
													href={`/sayfalar/${page.slug}`}
													onClick={closeMobileMenu}
													className="block py-2 text-gray-600 text-sm transition-colors hover:text-blue-600 focus:text-blue-600 focus:outline-none"
												>
													{page.title}
												</Link>
											))}
										</div>
									)}
								</div>
							))}

							{/* Mobile Authentication Section */}
							<div className="mt-6 border-t pt-4">
								<AuthSection onNavigate={closeMobileMenu} />
							</div>
						</div>
					</div>
				)}
			</div>
		</header>
	);
}
