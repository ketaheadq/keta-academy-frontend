"use client";

import { Calculator } from "lucide-react";
import type { StrapiCourse } from "@/lib/strapi";
import CourseCard from "../cards/course-card";
import DynamicGrid from "./dynamic-grid";

interface CourseGridProps {
	courses: StrapiCourse[];
	grades: string[];
	topics: string[];
	title?: React.ReactNode;
}

export default function CourseGrid({
	courses,
	grades,
	topics,
	title = "📚 Dersler",
}: Readonly<CourseGridProps>) {
	return (
		<DynamicGrid
			items={courses}
			searchFields={["title", "description"]}
			filterConfigs={[
				{
					field: "grades",
					label: "Sınıf",
					type: "select",
					options: grades,
					allLabel: "Tüm Sınıflar",
				},
				{
					field: "subject.title",
					label: "Konu",
					type: "select",
					options: topics,
					allLabel: "Tüm Konular",
				},
			]}
			renderItem={(course) => <CourseCard key={course.id} course={course} />}
			title={title}
			emptyStateConfig={{
				icon: <Calculator className="text-muted-foreground mx-auto mb-4 h-12 w-12" />,
				title: "Ders bulunamadı",
				description: "Filtreleri değiştirerek dersleri bulabilirsiniz.",
			}}
		/>
	);
}
