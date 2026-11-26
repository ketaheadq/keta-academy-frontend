"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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

	const keepOpen = () => {
		clearTimeout(closeTimer.current);
		setOpen(true);
	};
	const scheduleClose = () => {
		closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
	};

	useEffect(() => () => clearTimeout(closeTimer.current), []);

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: the wrapper only bridges pointer and focus intent between the trigger and its panel; the button is the control.
		<div
			className="relative"
			onMouseEnter={keepOpen}
			onMouseLeave={scheduleClose}
			onFocus={keepOpen}
			onBlur={(e) => {
				if (!e.currentTarget.contains(e.relatedTarget as Node | null)) scheduleClose();
			}}
			onKeyDown={(e) => {
				if (e.key === "Escape") setOpen(false);
			}}
		>
			<button
				type="button"
				aria-expanded={open}
				aria-haspopup="menu"
				className="text-muted-foreground hover:text-primary flex items-center space-x-1 font-medium transition-colors"
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
						initial="initial"
						animate="animate"
						exit="exit"
						variants={dropdownDown}
						role="menu"
						className="absolute top-full left-0 z-50 mt-2 w-48 overflow-hidden rounded-md border bg-white shadow-lg"
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
										className="text-muted-foreground hover:bg-primary hover:text-background block px-4 py-2 text-sm transition-colors"
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
