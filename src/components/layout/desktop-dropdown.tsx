"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { dropdownDown } from "@/lib/motion";
import type { StrapiPageCategory } from "@/lib/strapi";

interface DesktopDropdownProps {
	category: StrapiPageCategory;
}

/** Closing is delayed so moving the pointer across the gap to the panel does not dismiss it. */
const CLOSE_DELAY_MS = 140;

export default function DesktopDropdown({ category }: Readonly<DesktopDropdownProps>) {
	const [open, setOpen] = useState(false);
	const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const menuId = useId();

	const keepOpen = () => {
		clearTimeout(closeTimer.current);
		setOpen(true);
	};
	const scheduleClose = () => {
		closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
	};

	useEffect(() => () => clearTimeout(closeTimer.current), []);

	useEffect(() => {
		if (!open) return;
		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key !== "Escape") return;
			setOpen(false);
			triggerRef.current?.focus();
		};
		document.addEventListener("keydown", closeOnEscape);
		return () => document.removeEventListener("keydown", closeOnEscape);
	}, [open]);

	return (
		<div className="relative">
			<button
				ref={triggerRef}
				type="button"
				aria-expanded={open}
				aria-haspopup="menu"
				aria-controls={menuId}
				onClick={() => setOpen((current) => !current)}
				onMouseEnter={keepOpen}
				onMouseLeave={scheduleClose}
				onFocus={keepOpen}
				onBlur={scheduleClose}
				className="accent-link text-muted-foreground flex items-center space-x-1 font-medium"
			>
				<span>{category.title}</span>
				<m.span
					animate={{ rotate: open ? 180 : 0 }}
					transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
					aria-hidden="true"
					className="flex"
				>
					<ChevronDown className="h-4 w-4" />
				</m.span>
			</button>
			<AnimatePresence>
				{open && (
					<m.div
						id={menuId}
						initial="initial"
						animate="animate"
						exit="exit"
						variants={dropdownDown}
						role="menu"
						tabIndex={-1}
						onMouseEnter={keepOpen}
						onMouseLeave={scheduleClose}
						onFocus={keepOpen}
						onBlur={(e) => {
							if (!e.currentTarget.contains(e.relatedTarget as Node | null)) scheduleClose();
						}}
						onKeyDown={(e) => {
							if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
							const items = Array.from(
								e.currentTarget.querySelectorAll<HTMLAnchorElement>('[role="menuitem"]'),
							);
							if (items.length === 0) return;
							e.preventDefault();
							const currentIndex = items.indexOf(document.activeElement as HTMLAnchorElement);
							let nextIndex = currentIndex;
							if (e.key === "Home") nextIndex = 0;
							else if (e.key === "End") nextIndex = items.length - 1;
							else if (e.key === "ArrowDown") nextIndex = (currentIndex + 1) % items.length;
							else nextIndex = (currentIndex - 1 + items.length) % items.length;
							items[nextIndex]?.focus();
						}}
						className="bg-popover absolute top-full left-0 z-50 mt-2 w-48 overflow-hidden rounded-md border shadow-lg"
					>
						<m.div
							variants={{
								animate: { transition: { staggerChildren: 0.03, delayChildren: 0.04 } },
								initial: {},
							}}
							className="py-2"
						>
							{category.pages.map((page) => (
								<m.div
									key={`page-${page.id}`}
									variants={{
										initial: { opacity: 0, x: -6 },
										animate: { opacity: 1, x: 0 },
									}}
								>
									<Link
										role="menuitem"
										href={`/sayfalar/${page.slug}`}
										onClick={() => setOpen(false)}
										className="dropdown-item text-muted-foreground block px-4 py-2 text-sm"
									>
										{page.title}
									</Link>
								</m.div>
							))}
						</m.div>
					</m.div>
				)}
			</AnimatePresence>
		</div>
	);
}
