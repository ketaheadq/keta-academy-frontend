"use client";

import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "keta-theme";

const THEME_SCRIPT = `(() => {
	try {
		const saved = localStorage.getItem("${STORAGE_KEY}");
		const theme = saved === "light" || saved === "dark"
			? saved
			: window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
		document.documentElement.classList.toggle("dark", theme === "dark");
		document.documentElement.style.colorScheme = theme;
	} catch {
		document.documentElement.classList.remove("dark");
		document.documentElement.style.colorScheme = "light";
	}
})();`;

const ThemeContext = createContext<{
	theme: Theme;
	toggleTheme: () => void;
} | null>(null);

export function ThemeProvider({ children }: Readonly<{ children: ReactNode }>) {
	const [theme, setTheme] = useState<Theme>("light");

	useEffect(() => {
		setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
	}, []);

	const toggleTheme = useCallback(() => {
		const next = document.documentElement.classList.contains("dark") ? "light" : "dark";
		document.documentElement.classList.toggle("dark", next === "dark");
		document.documentElement.style.colorScheme = next;
		setTheme(next);
		try {
			localStorage.setItem(STORAGE_KEY, next);
		} catch {
			// The selected theme still applies when storage is unavailable.
		}
	}, []);

	const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) throw new Error("useTheme must be used within ThemeProvider");
	return context;
}

export function ThemeScript() {
	return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
