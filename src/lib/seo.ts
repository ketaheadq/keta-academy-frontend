import type { Metadata } from "next";
import type {
	StrapiAdmissionScore,
	StrapiBlog,
	StrapiCourse,
	StrapiPage,
	StrapiPageSEO,
	StrapiSEO,
	StrapiSubject,
	StrapiTutoringProfile,
	StrapiVideo,
} from "./strapi";

// Types for different content that can have SEO
export type SEOContent =
	| StrapiPage
	| StrapiCourse
	| StrapiBlog
	| StrapiVideo
	| StrapiAdmissionScore
	| StrapiSubject;

export interface SEOConfig {
	title?: string;
	description?: string;
	keywords?: string[];
	type?: "website" | "article";
	image?: string;
	url?: string;
	siteName?: string;
	twitterHandle?: string;
	locale?: string;
}

// Default SEO configuration
const DEFAULT_SEO: Required<Pick<SEOConfig, "siteName" | "twitterHandle" | "locale" | "type">> = {
	siteName: "KetaLearn",
	twitterHandle: "@ketaakademi",
	locale: "tr_TR",
	type: "website",
};

/**
 * Generate metadata for any content type with SEO support
 */
export function generateSEOMetadata(
	content: SEOContent,
	config: Partial<SEOConfig> = {},
): Metadata {
	const seoConfig = { ...DEFAULT_SEO, ...config };

	// Extract SEO data if available (for pages)
	const seoData: (StrapiSEO & Partial<StrapiPageSEO>) | undefined =
		"SEO" in content && content.SEO ? content.SEO : undefined;

	// Generate title
	const title =
		seoData?.metaTitle || config.title || generateDefaultTitle(content, seoConfig.siteName);

	// Generate description
	const description =
		seoData?.metaDescription || config.description || generateDefaultDescription(content);

	// Generate keywords
	const keywords =
		seoData?.keywords ||
		(config.keywords ? config.keywords.join(", ") : undefined) ||
		generateDefaultKeywords(content);

	// Generate canonical URL
	const canonicalUrl = seoData?.canonicalURL || config.url || generateDefaultURL(content);

	// Check if indexing is prevented
	const preventIndexing = seoData?.preventIndexing || false;

	return {
		title,
		description: description?.substring(0, 160) || "",
		keywords,
		authors: [{ name: seoConfig.siteName }],
		robots: {
			index: !preventIndexing,
			follow: !preventIndexing,
			googleBot: {
				index: !preventIndexing,
				follow: !preventIndexing,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},
		openGraph: {
			title,
			description: description?.substring(0, 160) || "",
			type: seoConfig.type,
			locale: seoConfig.locale,
			url: canonicalUrl,
			siteName: seoConfig.siteName,
			...(seoData?.metaImage && {
				images: [
					{
						url: seoData?.metaImage?.url,
						width: seoData?.metaImage?.width,
						height: seoData?.metaImage?.height,
						alt: seoData?.metaImage?.alternativeText || title || "",
					},
				],
			}),
		},
		alternates: {
			canonical: canonicalUrl,
		},
	};
}

/**
 * Generate structured data for any content type
 */
export function generateStructuredData(
	content: SEOContent,
	config: Partial<SEOConfig> = {},
): object {
	const seoConfig = { ...DEFAULT_SEO, ...config };

	// Safely resolve required fields with fallbacks
	const siteName = seoConfig.siteName || "KetaLearn";
	const baseUrl = (process.env.NEXT_PUBLIC_FRONTEND_URL || "https://ketaakademi.com").trim();
	const contentUrl = config.url || generateDefaultURL(content);

	const baseSchema = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: content.title,
		description: generateDefaultDescription(content),
		url: contentUrl,
		inLanguage: "tr-TR",
		isPartOf: {
			"@type": "WebSite",
			name: siteName,
			url: baseUrl,
		},
	};

	if ("pageType" in content) {
		return {
			...baseSchema,
			"@type": "WebPage",
			breadcrumb: {
				"@type": "BreadcrumbList",
				itemListElement: [
					{
						"@type": "ListItem",
						position: 1,
						name: "Ana Sayfa",
						item: baseUrl,
					},
					{
						"@type": "ListItem",
						position: 2,
						name: content.title,
						item: contentUrl,
					},
				],
			},
		};
	}

	if ("videoURL" in content || "href" in content) {
		return {
			...baseSchema,
			"@type": "VideoObject",
			name: content.title,
			description: generateDefaultDescription(content),
			uploadDate: content.publishedAt || new Date().toISOString(),
		};
	}

	if ("content" in content && Array.isArray(content.content)) {
		return {
			...baseSchema,
			"@type": "Article",
			headline: content.title,
			datePublished: content.publishedAt,
			dateModified: content.updatedAt,
			author: {
				"@type": "Organization",
				name: siteName,
			},
		};
	}

	return baseSchema;
}

// Helper functions
function generateDefaultTitle(content: SEOContent, siteName: string): string {
	return `${content.title} | ${siteName}`;
}

function generateDefaultDescription(content: SEOContent): string {
	if ("pageType" in content) {
		// Page content
		switch (content.pageType) {
			case "Üniversite Taban Puanları":
				return `${content.title} - Güncel üniversite taban puanları, sıralama bilgileri ve detaylı analiz. 2024 YKS taban puanları ve başarı sıralamaları.`;
			case "Bölüm Taban Puanları":
				return `${content.title} - Bölüm bazında taban puanları, kontenjanlar ve yerleştirme bilgileri. YKS tercih rehberi.`;
			case "Videolar":
				return `${content.title} - Eğitim videoları, ders anlatımları ve motivasyon içerikleri. Ücretsiz online eğitim videoları.`;
			case "Bloglar":
				return `${content.title} - Eğitim blog yazıları, sınav hazırlık ipuçları ve akademik rehberlik içerikleri.`;
			default:
				return `${content.title} - KetaLearn`;
		}
	}
	if ("description" in content && content.description) {
		// Course or other content with description
		return content.description;
	}
	if ("content" in content && Array.isArray(content.content)) {
		// Blog content - extract text from first block
		for (const block of content.content) {
			if (block.children && block.children.length > 0) {
				const text = block.children[0]?.text;
				if (text?.trim()) {
					return text.substring(0, 160);
				}
			}
		}
		return `${content.title} - KetaLearn blog yazısı`;
	}

	return `${content.title} - KetaLearn`;
}

function generateDefaultKeywords(content: SEOContent): string {
	const baseKeywords = ["KetaLearn", "eğitim", "online eğitim"];

	if ("pageType" in content) {
		switch (content.pageType) {
			case "Üniversite Taban Puanları":
			case "Bölüm Taban Puanları":
				baseKeywords.push(
					"taban puanları",
					"üniversite",
					"YKS",
					"sınav hazırlık",
					"tercih rehberi",
				);
				break;
			case "Videolar":
				baseKeywords.push("eğitim videoları", "ders anlatımı", "online ders", "video dersler");
				break;
			case "Bloglar":
				baseKeywords.push("blog", "eğitim makaleleri", "sınav ipuçları", "akademik rehberlik");
				break;
		}
	} else if ("subject" in content && content.subject) {
		// Course content
		baseKeywords.push("kurs", "ders", content.subject.title);
	} else if ("href" in content) {
		// Video content
		baseKeywords.push("video", "eğitim videosu", "ders anlatımı");
	} else if ("content" in content && Array.isArray(content.content)) {
		// Blog content
		baseKeywords.push("blog", "makale", "eğitim yazısı");
	}

	baseKeywords.push(content.title);
	return baseKeywords.join(", ");
}

function generateDefaultURL(content: SEOContent): string {
	const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://ketaakademi.com";

	if ("pageType" in content) {
		return `${baseUrl}/sayfalar/${content.slug}`;
	}
	if ("subject" in content) {
		return `${baseUrl}/kurslar/${content.slug}`;
	}
	if ("href" in content) {
		return `${baseUrl}/videos/${content.slug}`;
	}
	if ("content" in content && Array.isArray(content.content)) {
		return `${baseUrl}/blogs/${content.slug}`;
	}

	return baseUrl;
}

/**
 * Structured data (schema.org ItemList of Person) for the tutoring listing.
 * Uses each profile's SEO component when filled in, falling back to its own fields.
 */
export function generateTutoringStructuredData(
	profiles: StrapiTutoringProfile[],
	url: string,
): object {
	return {
		"@context": "https://schema.org",
		"@type": "ItemList",
		url,
		itemListElement: profiles.map((profile, index) => {
			const image = profile.SEO?.metaImage?.url || profile.profilePicture?.url;
			return {
				"@type": "ListItem",
				position: index + 1,
				item: {
					"@type": "Person",
					name: profile.SEO?.metaTitle || profile.name,
					jobTitle: profile.title,
					description: profile.SEO?.metaDescription || profile.experties || undefined,
					...(image && { image }),
					...(profile.subjects?.length && {
						knowsAbout: profile.subjects.map((subject) => subject.title),
					}),
					worksFor: { "@type": "Organization", name: DEFAULT_SEO.siteName },
				},
			};
		}),
	};
}
