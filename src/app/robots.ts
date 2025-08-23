import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://ketaakademi.com";

	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/api/", "/admin/", "/_next/", "/private/", "/dashboard/"],
		},
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
