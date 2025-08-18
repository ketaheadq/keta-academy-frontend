"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CourseCard from "@/components/course-card";
import { BreadcrumbNav } from "@/components/layout/breadcrum-nav";
import { calculateCoursesProgress } from "@/lib/progress-utils";
import {
	getAllCourseLessons,
	getCourses,
	getUserLessonProgress,
	type StrapiCourse,
} from "@/lib/strapi";
import { useAuthStore } from "@/stores/auth-store";

export default function DerslerimPage() {
	const { isAuthenticated, jwt, user } = useAuthStore();
	const [coursesWithProgress, setCoursesWithProgress] = useState<
		(StrapiCourse & { progress: number })[]
	>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch all courses and user progress
	useEffect(() => {
		const fetchData = async () => {
			if (!isAuthenticated || !jwt || !user) {
				setError("Giriş yapmanız gerekiyor");
				setIsLoading(false);
				return;
			}

			try {
				setIsLoading(true);
				setError(null);

				// Fetch all courses and course lessons data
				const [courses, courseLessons] = await Promise.all([
					getCourses(),
					getAllCourseLessons(jwt),
				]);

				// Get all lesson document IDs from course lessons
				const allLessonDocumentIds = courseLessons.map(
					(courseLesson) => courseLesson.lesson.documentId,
				);

				// Fetch all lesson progress data
				const lessonProgressData = await getUserLessonProgress(
					allLessonDocumentIds,
					jwt,
				);

				// Calculate progress for all courses using the utility function
				const updatedCoursesWithProgress = calculateCoursesProgress(
					courses,
					courseLessons,
					lessonProgressData,
					user.id,
				);

				setCoursesWithProgress(updatedCoursesWithProgress);
			} catch (error) {
				console.error("Error fetching data:", error);
				setError("Veriler yüklenirken bir hata oluştu");
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [isAuthenticated, jwt, user]);

	// Filter courses with progress > 0
	const continueCourses = coursesWithProgress;

	// If not authenticated, show login message
	if (!isAuthenticated) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
				<BreadcrumbNav
					breadcrumbs={[{ label: "Derslerim", href: "/derslerim" }]}
				/>
				<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
					<div className="text-center">
						<h1 className="mb-4 font-bold text-3xl text-gray-900">Derslerim</h1>
						<p className="mb-8 text-gray-600 text-lg">
							Derslerinizi görmek için giriş yapmanız gerekiyor.
						</p>
					</div>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<BreadcrumbNav
				breadcrumbs={[{ label: "Derslerim", href: "/derslerim" }]}
			/>

			<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Hero Section */}
				<div className="mb-12 text-center">
					<h1 className="mb-4 font-bold text-4xl text-gray-900">
						📚 Derslerim
					</h1>
					<p className="mx-auto max-w-3xl text-gray-600 text-xl">
						Başladığın derslerin ve ilerleme durumun
					</p>
				</div>

				{/* Loading State */}
				{isLoading && (
					<div className="py-12 text-center">
						<div className="inline-flex items-center px-4 py-2 font-semibold text-blue-500 leading-6">
							<svg
								className="-ml-1 mr-3 h-5 w-5 animate-spin text-blue-500"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<title>Loading</title>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								/>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								/>
							</svg>
							Dersleriniz yükleniyor...
						</div>
					</div>
				)}

				{/* Error State */}
				{error && (
					<div className="py-12 text-center">
						<div className="rounded-md border border-red-200 bg-red-50 p-4">
							<p className="text-red-800">{error}</p>
						</div>
					</div>
				)}

				{/* Courses Grid */}
				{!isLoading &&
					!error &&
					(continueCourses.length > 0 ? (
						<div className="grid gap-6 pt-0 md:grid-cols-2 lg:grid-cols-3">
							{continueCourses.map((course) => (
								<CourseCard
									key={course.id}
									course={course}
									showProgress={true}
								/>
							))}
						</div>
					) : (
						<div className="py-12 text-center">
							<div className="rounded-md border border-gray-200 bg-gray-50 p-8">
								<h3 className="mb-2 font-medium text-gray-900 text-lg">
									Henüz ders başlatmadınız
								</h3>
								<p className="mb-4 text-gray-600">
									İlk dersinizi başlatmak için konular sayfasına gidin.
								</p>
								<Link
									href="/konular"
									className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
								>
									Konulara Git
								</Link>
							</div>
						</div>
					))}
			</main>
		</div>
	);
}
