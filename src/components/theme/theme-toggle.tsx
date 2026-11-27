"use client";

import { Moon, Sun } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
	const { theme, toggleTheme } = useTheme();
	const isDark = theme === "dark";

	return (
		<Button
			type="button"
			variant="ghost"
			size="icon"
			onClick={toggleTheme}
			aria-label={isDark ? "Açık temaya geç" : "Koyu temaya geç"}
			title={isDark ? "Açık tema" : "Koyu tema"}
			className="hover:bg-accent/10 hover:text-accent relative overflow-hidden"
		>
			<AnimatePresence mode="wait" initial={false}>
				<m.span
					key={theme}
					className="absolute inset-0 flex items-center justify-center"
					initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
					animate={{ opacity: 1, rotate: 0, scale: 1 }}
					exit={{ opacity: 0, rotate: 45, scale: 0.6 }}
					transition={{ duration: 0.18 }}
				>
					{isDark ? (
						<Sun className="h-5 w-5" aria-hidden="true" />
					) : (
						<Moon className="h-5 w-5" aria-hidden="true" />
					)}
				</m.span>
			</AnimatePresence>
		</Button>
	);
}
