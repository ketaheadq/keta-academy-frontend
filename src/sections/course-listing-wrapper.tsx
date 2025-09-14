"use client";

import CourseCard from "@/components/cards/course-card";
import type { StrapiCourse } from "@/lib/strapi";
import DynamicListing from "./dynamic-listing";

interface ListCoursesProps {
	courses: StrapiCourse[];
	title: React.ReactNode;
}

export default function ListCourses({ courses, title }: Readonly<ListCoursesProps>) {
	return (
		<DynamicListing
			items={courses}
			title={title}
			renderItem={(course) => <CourseCard key={course.id} course={course} showProgress={false} />}
			maxItems={3}
			gridColumns={{ md: 2, lg: 3 }}
		/>
	);
}
