"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MyDenemeResults } from "@/components/features/deneme/my-results";
import { BreadcrumbNav } from "@/components/layout/breadcrum-nav";
import CourseCard from "@/components/shared/cards/course-card";
import { getCoursesByDocumentIds, getMyCourses, type StrapiCourse } from "@/lib/strapi";
import { useIsAuthenticated, useJWT } from "@/stores/auth-store";

export default function DerslerimPage() {
	const isAuthenticated = useIsAuthenticated();
	const jwt = useJWT();
	const [continueCourses, setCourses] = useState<StrapiCourse[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!isAuthenticated || !jwt) return;
		let active = true;
		setIsLoading(true);
		setError(null);
		// Only the courses this user started, not the whole catalog.
		getMyCourses(jwt)
			.then((mine) => getCoursesByDocumentIds(mine.map((course) => course.documentId)))
			.then((courses) => {
				if (active) setCourses(courses);
			})
			.catch(() => {
				if (active) setError("Veriler yüklenirken bir hata oluştu");
			})
			.finally(() => {
				if (active) setIsLoading(false);
			});
		return () => {
			active = false;
		};
	}, [isAuthenticated, jwt]);

	// If not authenticated, show login message
	if (!isAuthenticated) {
		return (
			<div className="min-h-screen">
				<BreadcrumbNav breadcrumbs={[{ label: "Derslerim", href: "/derslerim" }]} />
				<main className="mx-auto px-4 py-8 sm:px-6 lg:px-8">
					<div className="text-center">
						<h1 className="text-foreground mb-4 text-3xl font-bold">Derslerim</h1>
						<p className="text-muted-foreground mb-8 text-lg">
							Derslerinizi görmek için giriş yapmanız gerekiyor.
						</p>
					</div>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen">
			<BreadcrumbNav breadcrumbs={[{ label: "Derslerim", href: "/derslerim" }]} />

			<main className="mx-auto px-4 py-8 sm:px-6 lg:px-8">
				{/* Hero Section */}
				<div className="mb-12 text-center">
					<h1 className="text-foreground mb-4 text-4xl font-bold">📚 Derslerim</h1>
					<p className="text-muted-foreground mx-auto max-w-3xl text-xl">
						Başladığın derslerin ve ilerleme durumun
					</p>
				</div>

				{/* Loading State */}
				{isLoading && (
					<div className="py-12 text-center">
						<div className="text-primary inline-flex items-center px-4 py-2 leading-6 font-semibold">
							<svg
								className="text-primary mr-3 -ml-1 h-5 w-5 animate-spin"
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
						<div className="border-destructive bg-destructive/10 rounded-md border p-4">
							<p className="text-destructive">{error}</p>
						</div>
					</div>
				)}

				{/* Courses Grid */}
				{!isLoading &&
					!error &&
					(continueCourses.length > 0 ? (
						<div className="grid gap-6 pt-0 md:grid-cols-2 lg:grid-cols-3">
							{continueCourses.map((course) => (
								<CourseCard key={course.id} course={course} />
							))}
						</div>
					) : (
						<div className="py-12 text-center">
							<div className="bg-secondary rounded-md border p-8">
								<h3 className="text-foreground mb-2 text-lg font-medium">
									Henüz ders başlatmadınız
								</h3>
								<p className="text-muted-foreground mb-4">
									İlk dersinizi başlatmak için konular sayfasına gidin.
								</p>
								<Link
									href="/konular"
									className="bg-primary text-background hover:bg-primary focus:ring-primary inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
								>
									Konulara Git
								</Link>
							</div>
						</div>
					))}

				{jwt && <MyDenemeResults jwt={jwt} />}
			</main>
		</div>
	);
}
