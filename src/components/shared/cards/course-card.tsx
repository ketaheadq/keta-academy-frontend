"use client";

import { BookOpen, CheckCircle, Clock, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCourseProgress } from "@/components/shared/course-progress-provider";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCourseIcon } from "@/lib/icons";
import type { StrapiCourse } from "@/lib/strapi";
import { cn } from "@/lib/utils";
import { useJWT } from "@/stores/auth-store";

interface CourseCardProps {
	course: StrapiCourse;
	title?: React.ReactNode;
}

export default function CourseCard({ course, title }: Readonly<CourseCardProps>) {
	const jwt = useJWT();
	const progressByCourse = useCourseProgress();
	const progress = progressByCourse?.get(course.id) ?? 0;
	const isComplete = progress === 100;
	// The title and description are already printed on the thumbnail, so they're only
	// kept for screen readers and search engines. Without an image, show icon + title.
	const cover = course.thumbnail?.url ? course.thumbnail : course.image?.url ? course.image : null;
	const CourseIcon = getCourseIcon(course.icon?.name ?? "");
	const buttonText = isComplete
		? "Bitti"
		: progress > 0
			? "Devam Et"
			: jwt && !progressByCourse
				? "Kursu Aç"
				: "Kursa Başla";

	return (
		<Card className="relative h-full gap-4 overflow-hidden pt-0 transition-shadow hover:shadow-lg">
			<div className="bg-secondary relative aspect-video w-full">
				{cover ? (
					<Image
						src={cover.url}
						alt={course.title}
						fill
						sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
						className="object-cover"
					/>
				) : (
					<div className="bg-primary/10 flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
						<CourseIcon aria-hidden="true" className="text-primary h-10 w-10" />
						<span aria-hidden="true" className="text-foreground line-clamp-2 text-lg font-semibold">
							{title || course.title}
						</span>
					</div>
				)}
			</div>
			<CardHeader>
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<div className="flex flex-wrap items-center gap-2">
							{course.grades?.length ? (
								<Badge variant="secondary">
									{course.grades.map((grade) => grade.title).join(", ")}
								</Badge>
							) : null}
							{course.subject && <Badge variant="outline">{course.subject.title}</Badge>}
						</div>
						<CardTitle className="sr-only">{title || course.title}</CardTitle>
						<CardDescription className="sr-only">{course.description}</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className="text-muted-foreground mb-4 flex items-center justify-between text-sm">
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
						<div className="text-muted-foreground mb-1 flex justify-between text-sm">
							<span>İlerleme</span>
							<span>{progress}%</span>
						</div>
						<div className="bg-secondary h-2 w-full rounded-full">
							<div
								className="bg-primary h-2 rounded-full transition-all duration-300"
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
