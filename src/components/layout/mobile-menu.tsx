"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { pages } from "@/lib/navbar-page-links";
import type { StrapiPageCategory } from "@/lib/strapi";
import AuthSection from "./auth-section";

interface MobileMenuProps {
	pageCategories: StrapiPageCategory[];
}

const linkRow = {
	hidden: { opacity: 0, x: -12 },
	shown: { opacity: 1, x: 0, transition: { duration: 0.26, ease: [0.16, 1, 0.3, 1] as const } },
	exit: { opacity: 0, transition: { duration: 0.1 } },
};

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

		return () => document.removeEventListener("keydown", handleEscape);
	}, [isMobileMenuOpen, closeMobileMenu]);

	useEffect(
		() => () => {
			document.body.style.overflow = "unset";
		},
		[],
	);

	return (
		<>
			{/* Mobile Menu Button */}
			<button
				type="button"
				onClick={toggleMobileMenu}
				className="text-muted-foreground hover:bg-accent/10 hover:text-accent relative h-10 w-10 rounded-md transition-colors lg:hidden"
				aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
				aria-expanded={isMobileMenuOpen}
			>
				{/* Both icons share one box so the swap never resizes the button. */}
				<AnimatePresence mode="wait" initial={false}>
					{isMobileMenuOpen ? (
						<m.span
							key="close"
							className="absolute inset-0 flex items-center justify-center"
							initial={{ opacity: 0, rotate: -90 }}
							animate={{ opacity: 1, rotate: 0 }}
							exit={{ opacity: 0, rotate: 90 }}
							transition={{ duration: 0.16 }}
						>
							<X className="h-6 w-6" />
						</m.span>
					) : (
						<m.span
							key="open"
							className="absolute inset-0 flex items-center justify-center"
							initial={{ opacity: 0, rotate: 90 }}
							animate={{ opacity: 1, rotate: 0 }}
							exit={{ opacity: 0, rotate: -90 }}
							transition={{ duration: 0.16 }}
						>
							<Menu className="h-6 w-6" />
						</m.span>
					)}
				</AnimatePresence>
			</button>

			{/* Mobile Navigation Menu */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<m.div
						key="panel"
						initial={{ opacity: 0, y: -14 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -14 }}
						transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
						className="bg-card fixed inset-x-0 top-20 z-50 shadow-lg lg:hidden"
					>
						<div className="max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain px-4 py-6">
							<m.nav
								className="space-y-1"
								variants={{
									hidden: {},
									shown: { transition: { staggerChildren: 0.035, delayChildren: 0.05 } },
								}}
								initial="hidden"
								animate="shown"
								exit="exit"
							>
								{pages.map((p) => (
									<m.div key={p.id} variants={linkRow}>
										<Link
											href={p.href}
											onClick={closeMobileMenu}
											className="accent-link text-foreground focus-visible:ring-primary block rounded p-2 font-medium focus-visible:ring-2"
										>
											{p.displayName}
										</Link>
									</m.div>
								))}

								{/* Mobile Navigation Categories */}
								{pageCategories.map((category) => {
									const isOpen = openCategory === category.id;
									return (
										<m.div
											key={`mobile-category-${category.id}`}
											variants={linkRow}
											className="border-border border-b last:border-0"
										>
											<button
												type="button"
												onClick={() => toggleCategory(category.id)}
												className="accent-link text-muted-foreground focus:ring-primary flex w-full items-center justify-between p-2 font-medium focus:ring-1 focus:outline-none"
												aria-expanded={isOpen}
												aria-controls={`mobile-submenu-${category.id}`}
											>
												<span>{category.title}</span>
												<ChevronDown
													className={`h-4 w-4 transition-transform duration-300 ease-out ${isOpen ? "rotate-180" : ""}`}
													aria-hidden="true"
												/>
											</button>

											{/*
											 0fr→1fr animates to the real content height without measuring.
											 inert keeps the collapsed links out of the tab order, which
											 overflow-hidden alone would not do.
											*/}
											<div
												id={`mobile-submenu-${category.id}`}
												inert={!isOpen}
												className={`border-border ml-2 grid overflow-hidden border-l-2 pl-4 transition-[grid-template-rows,opacity] duration-300 ease-out ${
													isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
												}`}
											>
												<div className="min-h-0 space-y-1">
													{category.pages.map((page) => (
														<Link
															key={`mobile-page-${page.id}`}
															href={`/sayfalar/${page.slug}`}
															onClick={closeMobileMenu}
															className="dropdown-item text-muted-foreground focus:ring-primary block rounded py-2 text-sm focus:ring-2 focus:outline-none"
														>
															{page.title}
														</Link>
													))}
												</div>
											</div>
										</m.div>
									);
								})}
							</m.nav>

							{/* Mobile Authentication Section */}
							<m.div variants={linkRow} className="border-border mt-6 border-t pt-4">
								<AuthSection mobile onNavigate={closeMobileMenu} />
							</m.div>
						</div>
					</m.div>
				)}
			</AnimatePresence>
		</>
	);
}
