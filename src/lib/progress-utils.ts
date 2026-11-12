import type { StrapiCourse, StrapiCourseLesson, StrapiLessonProgress } from "@/lib/strapi";

/**
 * Calculate course progress based on lesson completion ratio
 * @param course - The course object
 * @param courseLessons - Array of all course lessons data
 * @param lessonProgressData - Array of lesson progress data from Strapi
 * @returns Progress percentage (0-100)
 */
export function calculateCourseProgress(
	course: StrapiCourse,
	courseLessons: StrapiCourseLesson[],
	lessonProgressData: StrapiLessonProgress[],
): number {
	// Get lessons for this specific course
	const courseLessonData = courseLessons.filter((courseLesson) => {
		if (typeof courseLesson.course === "number") {
			return courseLesson.course === course.id;
		}
		return courseLesson.course.id === course.id;
	});

	const totalLessons = courseLessonData.length;

	if (totalLessons === 0) {
		return 0;
	}

	const completed = new Set(lessonProgressData.filter(row => row.isCompleted).map(row => row.documentId));
	const completedLessons = courseLessonData.filter(link => completed.has(link.lesson.documentId)).length;

	// Calculate progress percentage
	const progressPercentage = (completedLessons / totalLessons) * 100;

	return Math.round(progressPercentage);
}

/**
 * Calculate course progress with fallback to course status
 * @param course - The course object
 * @param courseLessons - Array of all course lessons data
 * @param lessonProgressData - Array of lesson progress data
 * @param courseProgress - Course progress data from Strapi
 * @returns Progress percentage (0-100)
 */
export function calculateCourseProgressWithFallback(
	course: StrapiCourse,
	courseLessons: StrapiCourseLesson[],
	lessonProgressData: StrapiLessonProgress[],
	courseProgress: any,
): number {
	// If we have lesson progress data, calculate based on lesson completion
	if (lessonProgressData.length > 0) {
		return calculateCourseProgress(course, courseLessons, lessonProgressData);
	}

	// Fallback to course status if no lesson progress data
	if (courseProgress) {
		switch (courseProgress.course_status) {
			case "completed":
				return 100;
			case "in_progress":
				return 50;
			default:
				return 0;
		}
	}

	return 0;
}

/**
 * Get course progress for multiple courses
 * @param courses - Array of courses
 * @param courseLessons - Array of all course lessons data
 * @param lessonProgressData - Array of lesson progress data
 * @returns Array of courses with progress
 */
export function calculateCoursesProgress(
	courses: StrapiCourse[],
	courseLessons: StrapiCourseLesson[],
	lessonProgressData: StrapiLessonProgress[],
): (StrapiCourse & { progress: number })[] {
	return courses.map((course) => ({
		...course,
		progress: calculateCourseProgress(course, courseLessons, lessonProgressData),
	}));
}
