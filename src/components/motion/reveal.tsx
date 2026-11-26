"use client";

import type { Variants } from "motion/react";
import { m } from "motion/react";
import { type RevealVariant, revealShown, revealVariants } from "@/lib/motion";

const stagger = (gap: number): Variants => ({
	hidden: {},
	shown: { transition: { staggerChildren: gap } },
});

type RevealProps = {
	children: React.ReactNode;
	className?: string;
	/** "up" for sections and cards, "fade" for text or images that would drift. */
	variant?: RevealVariant;
	/** Seconds. Use `<RevealGroup>` for grids instead of hand-tuning this. */
	delay?: number;
	/** Fraction of the element that must be visible before it plays. */
	amount?: number;
	/** Keeps semantic markup intact — a section should not become a div just to animate. */
	as?: "div" | "section" | "article" | "li" | "aside" | "figure";
	id?: string;
	/** Section headings are labelled by id, and that relationship has to survive the wrapper. */
	labelledBy?: string;
};

/**
 * Plays once as the element scrolls into view.
 *
 * Children arrive through a slot, so a server component rendered inside stays
 * server-rendered: only this wrapper costs client JS, and the animated markup
 * itself never reaches the browser bundle. `once: true` also disconnects the
 * IntersectionObserver as soon as the element has played.
 */
export function Reveal({
	children,
	className,
	variant = "up",
	delay = 0,
	amount = 0.2,
	as = "div",
	id,
	labelledBy,
}: Readonly<RevealProps>) {
	const Tag = m[as];
	return (
		<Tag
			id={id}
			aria-labelledby={labelledBy}
			className={className}
			variants={{
				hidden: revealVariants[variant].hidden,
				shown: (d: number) => revealShown(variant, d),
			}}
			custom={delay}
			initial="hidden"
			whileInView="shown"
			viewport={{ once: true, amount }}
		>
			{children}
		</Tag>
	);
}

/**
 * Staggers its `RevealItem` children as one gesture, so a grid of twelve cards
 * reads as a single arrival instead of twelve independent ones.
 */
export function RevealGroup({
	children,
	className,
	gap = 0.06,
	amount = 0.1,
}: Readonly<{
	children: React.ReactNode;
	className?: string;
	/** Seconds between each item starting. */
	gap?: number;
	amount?: number;
}>) {
	return (
		<m.div
			className={className}
			variants={stagger(gap)}
			initial="hidden"
			whileInView="shown"
			viewport={{ once: true, amount }}
		>
			{children}
		</m.div>
	);
}

/** One staggered cell. Must be a direct child of `RevealGroup` to inherit timing. */
export function RevealItem({
	children,
	className,
	variant = "up",
}: Readonly<{ children: React.ReactNode; className?: string; variant?: RevealVariant }>) {
	return (
		<m.div className={className} variants={revealVariants[variant]}>
			{children}
		</m.div>
	);
}
