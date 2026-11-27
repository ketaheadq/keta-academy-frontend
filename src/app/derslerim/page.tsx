"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MyDenemeResults } from "@/components/features/deneme/my-results";
import { BreadcrumbNav } from "@/components/layout/breadcrum-nav";
import CourseCard from "@/components/shared/cards/course-card";
import { CardGridSkeleton } from "@/components/shared/loading-skeletons";
import { getCoursesByDocumentIds, getMyCourses, type StrapiCourse } from "@/lib/strapi";
import { useIsAuthenticated, useJWT } from "@/stores/auth-store";

export default function DerslerimPage() {
	const isAuthenticated = useIsAuthenticated();
	const jwt = useJWT();
	const [continueCourses, setContinueCourses] = useState<StrapiCourse[]>([]);
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
				if (active) setContinueCourses(courses);
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

				{isLoading && (
					<output aria-label="Dersleriniz yükleniyor" aria-busy="true">
						<span className="sr-only">Dersleriniz yükleniyor</span>
						<CardGridSkeleton count={3} />
					</output>
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
									İlk dersinizi başlatmak için dersler sayfasına gidin.
								</p>
								<Link
									href="/kurslar"
									className="bg-primary text-primary-foreground hover:bg-primary focus:ring-primary inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
								>
									Derslere Git
								</Link>
							</div>
						</div>
					))}

				{jwt && <MyDenemeResults jwt={jwt} />}
			</main>
		</div>
	);
}
