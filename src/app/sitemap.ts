import type { MetadataRoute } from "next";
import { getDenemeler } from "@/lib/deneme";
import {
	getPageCategories,
	getPublishedCourses,
	getSubjects,
	getTutoringProfiles,
	tutorPath,
} from "@/lib/strapi";

const baseUrl = (process.env.NEXT_PUBLIC_FRONTEND_URL || "https://ketalearn.cloud").replace(
	/\/$/,
	"",
);

// `/derslerim`, `/giris`, `/kayit-ol`, `/auth/*` and `/rapor/*` are per-user or
// unlisted, so they stay out of the sitemap (and `/derslerim` out of robots.txt).
const STATIC_PAGES: {
	path: string;
	changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
	priority: number;
}[] = [
	{ path: "", changeFrequency: "daily", priority: 1 },
	{ path: "/kurslar", changeFrequency: "daily", priority: 0.9 },
	{ path: "/deneme-sinavlari", changeFrequency: "weekly", priority: 0.9 },
	{ path: "/ozel-ders", changeFrequency: "weekly", priority: 0.8 },
	{ path: "/sayfalar", changeFrequency: "weekly", priority: 0.7 },
	{ path: "/sikca-sorulan-sorular", changeFrequency: "monthly", priority: 0.5 },
	{ path: "/iletisim", changeFrequency: "monthly", priority: 0.5 },
	{ path: "/gizlilik-politikasi", changeFrequency: "yearly", priority: 0.3 },
	{ path: "/hizmet-sartlari", changeFrequency: "yearly", priority: 0.3 },
];

/** Runs every source independently: one unreachable collection must not empty the sitemap. */
async function settled<T>(promise: Promise<T[]>): Promise<T[]> {
	try {
		return await promise;
	} catch (error) {
		console.warn(`Sitemap skipped a source: ${error instanceof Error ? error.message : error}`);
		return [];
	}
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const [courses, subjects, tutors, exams, pageCategories] = await Promise.all([
		// A long revalidate keeps /sitemap.xml prerenderable; `revalidate: 0` would
		// force it dynamic and make the build-time render throw DYNAMIC_SERVER_USAGE.
		settled(getPublishedCourses(undefined, 3600)),
		settled(getSubjects()),
		settled(getTutoringProfiles()),
		settled(getDenemeler()),
		settled(getPageCategories()),
	]);

	const now = new Date();

	const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((page) => ({
		url: `${baseUrl}${page.path}`,
		lastModified: now,
		changeFrequency: page.changeFrequency,
		priority: page.priority,
	}));

	const courseEntries: MetadataRoute.Sitemap = courses.map((course) => ({
		url: `${baseUrl}/kurslar/${course.slug}`,
		lastModified: new Date(course.updatedAt),
		changeFrequency: "weekly",
		priority: 0.8,
	}));

	const subjectEntries: MetadataRoute.Sitemap = subjects.map((subject) => ({
		url: `${baseUrl}/konular/${subject.slug}`,
		lastModified: new Date(subject.updatedAt),
		changeFrequency: "weekly",
		priority: 0.7,
	}));

	const tutorEntries: MetadataRoute.Sitemap = tutors.map((tutor) => ({
		url: `${baseUrl}${tutorPath(tutor)}`,
		lastModified: new Date(tutor.updatedAt),
		changeFrequency: "monthly",
		priority: 0.6,
	}));

	const examEntries: MetadataRoute.Sitemap = exams.map((exam) => ({
		url: `${baseUrl}/deneme-sinavlari/${exam.slug}`,
		lastModified: new Date(exam.publishedAt),
		changeFrequency: "weekly",
		priority: 0.8,
	}));

	const pageEntries: MetadataRoute.Sitemap = pageCategories.flatMap((category) =>
		(category.pages ?? []).map((page) => ({
			url: `${baseUrl}/sayfalar/${page.slug}`,
			lastModified: new Date(page.updatedAt),
			changeFrequency: "weekly" as const,
			priority: 0.7,
		})),
	);

	return [
		...staticEntries,
		...courseEntries,
		...subjectEntries,
		...examEntries,
		...tutorEntries,
		...pageEntries,
	];
}
