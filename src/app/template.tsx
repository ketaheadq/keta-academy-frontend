"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";
import { DURATION, EASE_OUT } from "@/lib/motion";

export default function Template({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<m.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: DURATION.base, ease: EASE_OUT }}
		>
			{children}
		</m.div>
	);
}
