"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { StrapiPageCategory } from "@/lib/strapi";
import AuthSection from "./auth-section";
import {pages} from "@/lib/navbar-page-links";

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
				className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-background lg:hidden"
				aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
				aria-expanded={isMobileMenuOpen}
			>
				{isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
			</button>

			{/* Mobile Navigation Menu */}
			{isMobileMenuOpen && (
				<div className="slide-in-from-top-2 fixed inset-x-0 top-20 z-50 animate-in bg-white shadow-lg duration-200 lg:hidden">
					<div className="max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain px-4 py-6">
						<nav className="space-y-1">

							{pages.map((p , i) => (
								<Link
									href={p.href}
									onClick={closeMobileMenu}
									className="block rounded p-2 font-medium text-foreground hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"
								>
									{p.displayName}
								</Link>
							))}

							{/* Mobile Navigation Categories */}
							{pageCategories.map((category) => (
								<div
									key={`mobile-category-${category.id}`}
									className="border-border border-b last:border-0"
								>
									<button
										type="button"
										onClick={() => toggleCategory(category.id)}
										className="flex w-full items-center justify-between p-2 font-medium text-muted-foreground transition-colors hover:text-background focus:text-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
											className="slide-in-from-top-1 mt-1 ml-2 animate-in space-y-1 border-border border-l-2 pl-4 duration-150"
										>
											{category.pages.map((page) => (
												<Link
													key={`mobile-page-${page.id}`}
													href={`/sayfalar/${page.slug}`}
													onClick={closeMobileMenu}
													className="block rounded py-2 text-muted-foreground text-sm transition-colors hover:text-background focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
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
						<div className="mt-6 border-border border-t pt-4">
							<AuthSection mobile onNavigate={closeMobileMenu} />
						</div>
					</div>
				</div>
			)}
		</>
	);
}
