"use client";

import { useEffect, useState } from "react";
import CourseCard from "@/components/cards/course-card";
import { calculateCoursesProgress } from "@/lib/progress-utils";
import {
	getAllCourseLessons,
	getUserLessonProgress,
	type StrapiCourse,
} from "@/lib/strapi";
import { useAuthStore } from "@/stores/auth-store";
import DynamicContinue from "./continiue";

interface ContinueProps {
	courses: StrapiCourse[];
}

export default function Continue({ courses }: ContinueProps) {
	const { isAuthenticated, jwt, user } = useAuthStore();
	const [coursesWithProgress, setCoursesWithProgress] = useState<
		(StrapiCourse & { progress: number })[]
	>([]);
	const [isLoading, setIsLoading] = useState(false);

	// Fetch user progress when authenticated
	useEffect(() => {
		const fetchUserProgress = async () => {
			if (!isAuthenticated || !jwt || !user || courses.length === 0) {
				console.log("No courses found");
				// Initialize courses with 0 progress for non-authenticated users
				setCoursesWithProgress(
					courses.map((course) => ({ ...course, progress: 0 })),
				);
				return;
			}

			setIsLoading(true);
			try {
				// Fetch all course lessons data
				const courseLessons = await getAllCourseLessons(jwt);
				console.log("courseLessons", courseLessons);
				// Get all lesson document IDs from course lessons
				const allLessonDocumentIds = courseLessons.map(
					(courseLesson) => courseLesson.lesson.documentId,
				);
				console.log("allLessonDocumentIds", allLessonDocumentIds);
				// Fetch all lesson progress data
				const lessonProgressData = await getUserLessonProgress(
					allLessonDocumentIds,
					jwt,
				);
				console.log("lessonProgressData", lessonProgressData);
				// Calculate progress for all courses using the utility function
				const updatedCoursesWithProgress = calculateCoursesProgress(
					courses,
					courseLessons,
					lessonProgressData,
					user.id.toString(),
				);
				console.log("updatedCoursesWithProgress", updatedCoursesWithProgress);
				setCoursesWithProgress(updatedCoursesWithProgress);
			} catch (error) {
				console.error("Error fetching user progress:", error);
				// Fallback to courses with 0 progress
				setCoursesWithProgress(
					courses.map((course) => ({ ...course, progress: 0 })),
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserProgress();
	}, [isAuthenticated, jwt, user, courses]);

	// Don't show if user is not authenticated
	if (!isAuthenticated) {
		return null;
	}

	return (
		<DynamicContinue
			items={coursesWithProgress}
			renderItem={(course) => (
				<CourseCard key={course.id} course={course} showProgress={true} />
			)}
			title="📈 Kaldığın Yerden Devam Et:"
			maxItems={2}
			viewAllLink={{ href: "/derslerim", label: "Hepsini Gör" }}
			isLoading={isLoading}
		/>
	);
}
