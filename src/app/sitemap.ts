import type { MetadataRoute } from "next";
import { getPageCategories } from "@/lib/strapi";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ketaakademi.com";

	// Static pages
	const staticPages: MetadataRoute.Sitemap = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1,
		},
		{
			url: `${baseUrl}/kurslar`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/konular`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.8,
		},
	];

	try {
		// Get all page categories and their pages
		const pageCategories = await getPageCategories();

		const dynamicPages: MetadataRoute.Sitemap = [];

		for (const category of pageCategories) {
			if (category.pages) {
				for (const page of category.pages) {
					dynamicPages.push({
						url: `${baseUrl}/sayfalar/${page.slug}`,
						lastModified: new Date(page.updatedAt),
						changeFrequency: "weekly",
						priority: 0.7,
					});
				}
			}
		}

		return [...staticPages, ...dynamicPages];
	} catch (error) {
		console.error("Error generating sitemap:", error);
		return staticPages;
	}
}
