import type { Metadata } from "next";
import { RedirectType, redirect } from "next/navigation";
import CoursePage from "@/components/features/course/course";
import { generateSEOMetadata } from "@/lib/seo";
import { getCourse, getLessonsByCourseId } from "@/lib/strapi";

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://ketalearn.cloud";

/** https://i.ytimg.com thumbnail for a YouTube URL (watch, youtu.be, embed, shorts). */
function youtubeThumbnail(url?: string | null): string | undefined {
	const id = url?.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/)?.[1];
	return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : undefined;
}

export async function generateMetadata({
	params,
	searchParams,
}: Readonly<{
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ ders_ismi?: string }>;
}>): Promise<Metadata> {
	const { slug } = await params;
	const { ders_ismi } = await searchParams;
	const course = await getCourse(slug);
	if (!course) return { title: "Ders bulunamadı | KetaLearn" };

	const image = course.image ?? course.thumbnail;

	// A single lesson is open: use the lesson's own SEO.
	if (ders_ismi) {
		const courseLessons = await getLessonsByCourseId(course.id);
		const lesson = courseLessons.find((item) => item.lesson?.slug === ders_ismi)?.lesson;
		if (lesson) {
			const metadata = generateSEOMetadata(lesson, {
				title: `${lesson.title} | ${course.title} | KetaLearn`,
				description: lesson.description,
				url: `${FRONTEND_URL}/kurslar/${slug}?ders_ismi=${encodeURIComponent(lesson.slug)}`,
				type: "article",
			});
			const fallbackImage = youtubeThumbnail(lesson.videoURL) ?? image?.url;
			if (!lesson.SEO?.metaImage && fallbackImage && metadata.openGraph) {
				metadata.openGraph.images = [{ url: fallbackImage, alt: lesson.title }];
			}
			return metadata;
		}
	}

	const metadata = generateSEOMetadata(course, {
		url: `${FRONTEND_URL}/kurslar/${slug}`,
		type: "article",
	});
	// Fall back to the course image when no SEO image is set.
	if (!course.SEO?.metaImage && image?.url && metadata.openGraph) {
		metadata.openGraph.images = [
			{ url: image.url, width: image.width, height: image.height, alt: course.title },
		];
	}
	return metadata;
}
export default async function DerslerPage({
	params,
	searchParams,
}: Readonly<{
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ ders_ismi?: string }>;
}>) {
	const { slug } = await params;
	const { ders_ismi } = await searchParams;

	const course = await getCourse(slug);
	if (!course) {
		redirect("/?error_message=courseNotFound", RedirectType.replace);
	}
	const courseLessons = await getLessonsByCourseId(course.id);
	// Extract lessons from course-lessons (they're already sorted by order)
	const lessons = courseLessons.map((courseLesson) => courseLesson.lesson);

	return <CoursePage course={course} lessons={lessons} ders_ismi={ders_ismi} />;
}
