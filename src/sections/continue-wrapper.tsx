"use client";

import CourseCard from "@/components/shared/cards/course-card";
import { useCourseProgress } from "@/components/shared/course-progress-provider";
import type { StrapiCourse } from "@/lib/strapi";
import DynamicContinue from "./continue";

export default function Continue({ courses }: Readonly<{ courses: StrapiCourse[] }>) {
	const progressByCourse = useCourseProgress();
	if (!progressByCourse) return null;

	return (
		<DynamicContinue
			items={courses.map(course => ({ ...course, progress: progressByCourse.get(course.id) ?? 0 }))}
			renderItem={course => <CourseCard key={course.id} course={course} />}
			title="📈 Kaldığın Yerden Devam Et:"
		/>
	);
}
