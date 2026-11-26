"use client";

import { m } from "motion/react";
import { DURATION, EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * A horizontal meter that grows to its value the first time it scrolls into view.
 *
 * It scales rather than animating `width`: a width transition reflows the row on
 * every frame, while `scaleX` stays on the compositor, which matters on the
 * report screens where several bars play at once.
 */
export function MeterBar({
	value,
	className,
	ariaLabel,
}: Readonly<{
	/** 0-100. */
	value: number;
	className?: string;
	ariaLabel?: string;
}>) {
	const clamped = Math.max(0, Math.min(100, value));
	// Without a label the percentage is already printed next to the bar, so the bar
	// itself is decoration and must not be announced twice.
	const semantics = ariaLabel
		? {
				role: "meter" as const,
				"aria-label": ariaLabel,
				"aria-valuenow": clamped,
				"aria-valuemin": 0,
				"aria-valuemax": 100,
			}
		: { "aria-hidden": true as const };

	return (
		<div className="bg-secondary h-2 w-full overflow-hidden rounded-full" {...semantics}>
			<m.div
				className={cn("h-full origin-left rounded-full", className)}
				style={{ width: `${clamped}%` }}
				initial={{ scaleX: 0 }}
				whileInView={{ scaleX: 1 }}
				viewport={{ once: true, amount: 0.5 }}
				transition={{ duration: DURATION.slow + 0.25, ease: EASE_OUT }}
			/>
		</div>
	);
}
