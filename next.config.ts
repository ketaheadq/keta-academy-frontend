import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
	async rewrites() {
		const api = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL;
		return api ? [{ source: "/uploads/:path*", destination: `${api}/uploads/:path*` }] : [];
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
				port: "",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
