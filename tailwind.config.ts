import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			keyframes: {
				gradient: {
					"0%": { backgroundPosition: "0% 50%" },
					"50%": { backgroundPosition: "100% 50%" },
					"100%": { backgroundPosition: "0% 50%" },
				},
			},
			colors: {
				background: "#F8FAFC", // slate-100
				primary: "#00BCFF", // sky-400
				accent: "#FD9A00", // amber-500
				text: "#0F172B", // slate-900
				secondary: "#64748b", // slate-500
				success: "#ffd230", // amber-300
				danger: "#EC003F", // rose-600
			},
			animation: {
				gradient: "gradient 8s linear infinite",
			},
		},
	},
	plugins: [],
};

export default config;
