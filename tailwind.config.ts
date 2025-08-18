import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: "#f4f6fb", // very light blue-gray
				primary: "#2563eb", // blue-600
				accent: "#fbbf24", // amber-400
				text: "#1e293b", // slate-800
				secondary: "#64748b", // slate-500
				success: "#22c55e", // green-500
				danger: "#ef4444", // red-500
			},
		},
	},
	plugins: [],
};

export default config;
