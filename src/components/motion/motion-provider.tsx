"use client";

import { domAnimation, LazyMotion, MotionConfig } from "motion/react";
import { useEffect } from "react";

/**
 * One LazyMotion boundary for the whole app.
 *
 * `domAnimation` ships animation, exit, hover/tap and in-view features only —
 * layout and drag are deliberately left out, which keeps the client bundle
 * small and avoids the measure-and-reflow cost of layout animations. Every
 * animated component therefore uses the lightweight `m` proxy instead of
 * `motion`, and nothing pays for features it never declares.
 *
 * reducedMotion="user" honours prefers-reduced-motion app-wide: transforms are
 * dropped and opacity crossfades are kept, so information never disappears for
 * people who have opted out of movement.
 */
export default function MotionProvider({ children }: Readonly<{ children: React.ReactNode }>) {
	useEffect(() => {
		// Reveals render at opacity 0 on the server. Until this runs, globals.css
		// forces them visible so a page with failed or absent JS is still readable.
		document.documentElement.dataset.motionReady = "";
	}, []);

	return (
		<LazyMotion features={domAnimation}>
			<MotionConfig reducedMotion="user">{children}</MotionConfig>
		</LazyMotion>
	);
}
