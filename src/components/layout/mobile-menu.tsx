"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { StrapiPageCategory } from "@/lib/strapi";
import AuthSection from "./auth-section";

interface MobileMenuProps {
	pageCategories: StrapiPageCategory[];
}

export default function MobileMenu({ pageCategories }: Readonly<MobileMenuProps>) {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [openCategory, setOpenCategory] = useState<number | null>(null);

	const closeMobileMenu = useCallback(() => {
		setIsMobileMenuOpen(false);
		setOpenCategory(null);
		document.body.style.overflow = "unset";
	}, []);

	const toggleMobileMenu = useCallback(() => {
		const newState = !isMobileMenuOpen;
		setIsMobileMenuOpen(newState);
		setOpenCategory(null);

		if (newState) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
	}, [isMobileMenuOpen]);

	const toggleCategory = useCallback(
		(categoryId: number) => {
			setOpenCategory(openCategory === categoryId ? null : categoryId);
		},
		[openCategory],
	);

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
		<>
			{/* Mobile Menu Button */}
			<button
				type="button"
				onClick={toggleMobileMenu}
				className="rounded-md p-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600 md:hidden"
				aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
				aria-expanded={isMobileMenuOpen}
			>
				{isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
			</button>

			{/* Mobile Navigation Menu */}
			{isMobileMenuOpen && (
				<div className="slide-in-from-top-2 fixed inset-x-0 top-20 z-50 animate-in bg-white shadow-lg duration-200 md:hidden">
					<div className="max-h-[calc(100vh-4rem)] overflow-y-auto px-4 py-6">
						<nav className="space-y-1">
							{/* Mobile Navigation Categories */}
							{pageCategories.map((category) => (
								<div
									key={`mobile-category-${category.id}`}
									className="border-gray-100 border-b last:border-0"
								>
									<button
										type="button"
										onClick={() => toggleCategory(category.id)}
										className="flex w-full items-center justify-between p-2 font-medium text-gray-700 transition-colors hover:text-blue-600 focus:text-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-200"
										aria-expanded={openCategory === category.id}
										aria-controls={`mobile-submenu-${category.id}`}
									>
										<span>{category.title}</span>
										<ChevronDown
											className={`h-4 w-4 transition-transform duration-200 ${
												openCategory === category.id ? "rotate-180" : ""
											}`}
											aria-hidden="true"
										/>
									</button>

									{openCategory === category.id && (
										<div
											id={`mobile-submenu-${category.id}`}
											className="slide-in-from-top-1 mt-1 ml-2 animate-in space-y-1 border-gray-200 border-l-2 pl-4 duration-150"
										>
											{category.pages.map((page) => (
												<Link
													key={`mobile-page-${page.id}`}
													href={`/sayfalar/${page.slug}`}
													onClick={closeMobileMenu}
													className="block rounded py-2 text-gray-600 text-sm transition-colors hover:text-blue-600 focus:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
												>
													{page.title}
												</Link>
											))}
										</div>
									)}
								</div>
							))}
						</nav>

						{/* Mobile Authentication Section */}
						<div className="mt-6 border-gray-200 border-t pt-4">
							<AuthSection onNavigate={closeMobileMenu} />
						</div>
					</div>
				</div>
			)}
		</>
	);
}
