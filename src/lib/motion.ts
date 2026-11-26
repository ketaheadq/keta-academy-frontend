import type { TargetAndTransition, Transition, Variants } from "motion/react";

/**
 * Animation tokens shared by every animated surface.
 *
 * Motion is intentionally subtle here: distances stay under 20px and scale
 * under 4%, so elements read as "settling into place" rather than flying in.
 * Exits are always shorter than entries, which is what keeps lists from
 * feeling sluggish when a user is filtering quickly.
 */

/** Decelerating curve: fast start, long soft landing. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
/** Accelerating curve, used only on exits. */
export const EASE_IN = [0.4, 0, 1, 1] as const;

export const DURATION = {
	fast: 0.18,
	base: 0.28,
	slow: 0.45,
} as const;

/** Entrances get a gentle ease-out; nothing overshoots. */
export const enter: Transition = { duration: DURATION.slow, ease: EASE_OUT };
export const exit: Transition = { duration: DURATION.fast, ease: EASE_IN };

export const fadeInUp: Variants = {
	initial: { opacity: 0, y: 16 },
	animate: { opacity: 1, y: 0, transition: enter },
	exit: { opacity: 0, y: -8, transition: exit },
};

/** Fades without movement: for text and images where a shift would be noisy. */
export const fadeIn: Variants = {
	initial: { opacity: 0 },
	animate: { opacity: 1, transition: enter },
	exit: { opacity: 0, transition: exit },
};

export const scaleIn: Variants = {
	initial: { opacity: 0, scale: 0.97 },
	animate: { opacity: 1, scale: 1, transition: enter },
	exit: { opacity: 0, scale: 0.98, transition: exit },
};

/**
 * Scroll-reveal labels shared by `Reveal`, `RevealGroup` and `RevealItem`.
 * Kept on `hidden`/`shown` so a group can hand its stagger timing straight to
 * its children without re-declaring motion per site.
 */
export type RevealVariant = "up" | "fade" | "scale";

export const revealVariants: Record<RevealVariant, Variants> = {
	up: { hidden: fadeInUp.initial, shown: fadeInUp.animate },
	fade: { hidden: fadeIn.initial, shown: fadeIn.animate },
	scale: { hidden: scaleIn.initial, shown: scaleIn.animate },
};

/**
 * A `shown` label that also carries a per-element delay. Motion resolves dynamic
 * variants against the `custom` prop, which is how `Reveal` accepts `delay`
 * without abandoning the shared tokens above.
 */
export const revealShown = (variant: RevealVariant, delay: number) => {
	const target = revealVariants[variant].shown as TargetAndTransition;
	return { ...target, transition: { ...target.transition, delay } };
};

/** Floating panel anchored above (dropdown) — grows from its trigger. */
export const dropdownUp: Variants = {
	initial: { opacity: 0, y: -6, scale: 0.98 },
	animate: { opacity: 1, y: 0, scale: 1, transition: { duration: DURATION.base, ease: EASE_OUT } },
	exit: { opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.12, ease: EASE_IN } },
};

/** Floating panel anchored below (sheet, popover). */
export const dropdownDown: Variants = {
	initial: { opacity: 0, y: -12 },
	animate: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE_OUT } },
	exit: { opacity: 0, y: -8, transition: { duration: 0.12, ease: EASE_IN } },
};

/**
 * Question cards swap horizontally, so direction has to follow navigation
 * direction or the reader loses their place. Snappier than the section tokens:
 * a 20-question exam is navigated quickly, and a 0.45s hand-off per question
 * would feel like the page is lagging behind the student.
 */
export function slideQuestion(direction: number): Variants {
	return {
		initial: { opacity: 0, x: direction * 24 },
		animate: { opacity: 1, x: 0, transition: { duration: 0.24, ease: EASE_OUT } },
		exit: { opacity: 0, x: direction * -24, transition: { duration: 0.12, ease: EASE_IN } },
	};
}

/** Accordion body: clipped by a 0fr→1fr grid row, so only opacity is animated here. */
export const accordion: Variants = {
	collapsed: { opacity: 0 },
	expanded: { opacity: 1, transition: { duration: DURATION.slow, ease: EASE_OUT, delay: 0.05 } },
};
