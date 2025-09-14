"use client";

import { BookOpen, Clock, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { StrapiCourse } from "@/lib/strapi";
import { useAuthStore } from "@/stores/auth-store";

interface CourseCardProps {
	course: StrapiCourse & { progress?: number };
	title?: React.ReactNode;
	showProgress?: boolean;
}

export default function CourseCard({
	course,
	title,
	showProgress = false,
}: Readonly<CourseCardProps>) {
	const router = useRouter();
	const { isAuthenticated } = useAuthStore();

	const handleCourseClick = () => {
		router.push(`/kurslar/${course.slug}`);
	};

	const getButtonText = () => {
		if (showProgress && course.progress && course.progress > 0) {
			return "Devam Et";
		}
		return isAuthenticated ?? "Kursa Başla";
	};

	return (
		<Card className="cursor-pointer transition-shadow hover:shadow-lg" onClick={handleCourseClick}>
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<div className="mb-2 flex items-center space-x-2">
							<Badge variant="secondary">
								{course.grades.map((grade) => grade.title).join(", ")}
							</Badge>
							<Badge variant="outline">{course.subject.title}</Badge>
							{course.isPopular && <Badge className="bg-orange-500">Popüler</Badge>}
						</div>
						<CardTitle className="mb-2 text-lg">{title || course.title}</CardTitle>
						<CardDescription>{course.description}</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className="mb-4 flex items-center justify-between text-gray-600 text-sm">
					<div className="flex items-center space-x-4">
						<div className="flex items-center space-x-1">
							<Clock className="h-4 w-4" />
							<span>{course.duration} dk</span>
						</div>
						<div className="flex items-center space-x-1">
							<BookOpen className="h-4 w-4" />
							<span>{course.course_lessons?.length || 0} ders</span>
						</div>
					</div>
				</div>
				{/* Progress bar if showProgress is true and course has progress */}
				{showProgress && (
					<div className="mb-4">
						<div className="mb-1 flex justify-between text-gray-600 text-sm">
							<span>İlerleme</span>
							<span>{course.progress ? course.progress : 0}%</span>
						</div>
						<div className="h-2 w-full rounded-full bg-gray-200">
							<div
								className="h-2 rounded-full bg-blue-600 transition-all duration-300"
								style={{ width: `${course.progress ? course.progress : 0}%` }}
							/>
						</div>
					</div>
				)}

				<Button
					className="w-full cursor-pointer"
					onClick={(e) => {
						e.stopPropagation();
						handleCourseClick();
					}}
				>
					<Play className="mr-2 h-4 w-4" />
					{getButtonText()}
				</Button>
			</CardContent>
		</Card>
	);
}
