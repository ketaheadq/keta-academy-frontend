"use client";

import { BookOpen, CheckCircle, Clock, Play } from "lucide-react";
import Link from "next/link";
import { useCourseProgress } from "@/components/shared/course-progress-provider";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { StrapiCourse } from "@/lib/strapi";
import { cn } from "@/lib/utils";
import { useJWT } from "@/stores/auth-store";

interface CourseCardProps {
	course: StrapiCourse;
	title?: React.ReactNode;
}

export default function CourseCard({
	course,
	title,
}: Readonly<CourseCardProps>) {
	const jwt = useJWT();
	const progressByCourse = useCourseProgress();
	const progress = progressByCourse?.get(course.id) ?? 0;
	const isComplete = progress === 100;
	const buttonText = isComplete ? "Bitti" : progress > 0 ? "Devam Et" : jwt && !progressByCourse ? "Kursu Aç" : "Kursa Başla";

	return (
		<Card className="relative h-full transition-shadow hover:shadow-lg">
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<div className="mb-2 flex flex-wrap items-center gap-2">
							{course.grades?.length ? (
								<Badge variant="secondary">{course.grades.map(grade => grade.title).join(", ")}</Badge>
							) : null}
							{course.subject && <Badge variant="outline">{course.subject.title}</Badge>}
						</div>
						<CardTitle className="mb-2 text-lg">{title || course.title}</CardTitle>
						<CardDescription>{course.description}</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className="mb-4 flex items-center justify-between text-muted-foreground text-sm">
					<div className="flex items-center space-x-4">
						<div className="flex items-center space-x-1">
							<Clock className="h-4 w-4" />
							<span>{course.duration ? `${course.duration} dk` : "Kendi hızında"}</span>
						</div>
						<div className="flex items-center space-x-1">
							<BookOpen className="h-4 w-4" />
							<span>{course.course_lessons?.length || 0} ders</span>
						</div>
					</div>
				</div>
				{progress > 0 && (
					<div className="mb-4">
						<div className="mb-1 flex justify-between text-muted-foreground text-sm">
							<span>İlerleme</span>
							<span>{progress}%</span>
						</div>
						<div className="h-2 w-full rounded-full bg-secondary">
							<div
								className="h-2 rounded-full bg-primary transition-all duration-300"
								style={{ width: `${progress}%` }}
							/>
						</div>
					</div>
				)}

				<Link
					href={`/kurslar/${course.slug}`}
					aria-label={`${buttonText}: ${course.title}`}
					className={cn(
						buttonVariants(),
						"w-full after:absolute after:inset-0 after:rounded-xl",
						isComplete && "bg-green-700 text-white hover:bg-green-800",
					)}
				>
					{isComplete ? <CheckCircle aria-hidden="true" /> : <Play aria-hidden="true" />}
					{buttonText}
				</Link>
			</CardContent>
		</Card>
	);
}
