import type { StrapiCourseLesson, StrapiLessonProgress } from "@/lib/strapi";

export function calculateCourseProgressById(
	courseLessons: StrapiCourseLesson[],
	lessonProgress: StrapiLessonProgress[],
): Map<number, number> {
	const completed = new Set(lessonProgress.filter(row => row.isCompleted).map(row => row.documentId));
	const lessonsByCourse = new Map<number, Set<string>>();

	for (const { course, lesson } of courseLessons) {
		const courseId = typeof course === "number" ? course : course.id;
		const lessons = lessonsByCourse.get(courseId) ?? new Set<string>();
		lessons.add(lesson.documentId);
		lessonsByCourse.set(courseId, lessons);
	}

	return new Map([...lessonsByCourse].map(([courseId, lessons]) => {
		const completedCount = [...lessons].filter(id => completed.has(id)).length;
		const progress = completedCount === lessons.size ? 100 : Math.min(99, Math.round(completedCount / lessons.size * 100));
		return [courseId, progress];
	}));
}
