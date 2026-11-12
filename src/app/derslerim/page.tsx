"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BreadcrumbNav } from "@/components/layout/breadcrum-nav";
import CourseCard from "@/components/shared/cards/course-card";
import { getCourses, type StrapiCourse } from "@/lib/strapi";
import { useIsAuthenticated } from "@/stores/auth-store";

export default function DerslerimPage() {
	const isAuthenticated = useIsAuthenticated();
	const [continueCourses, setCourses] = useState<StrapiCourse[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!isAuthenticated) return;
		let active = true;
		setIsLoading(true);
		setError(null);
		getCourses()
			.then(courses => { if (active) setCourses(courses); })
			.catch(() => { if (active) setError("Veriler yüklenirken bir hata oluştu"); })
			.finally(() => { if (active) setIsLoading(false); });
		return () => { active = false; };
	}, [isAuthenticated]);

	// If not authenticated, show login message
	if (!isAuthenticated) {
		return (
			<div className="min-h-screen">
				<BreadcrumbNav breadcrumbs={[{ label: "Derslerim", href: "/derslerim" }]} />
				<main className="mx-auto px-4 py-8 sm:px-6 lg:px-8">
					<div className="text-center">
						<h1 className="mb-4 font-bold text-3xl text-foreground">Derslerim</h1>
						<p className="mb-8 text-lg text-muted-foreground">
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
					<h1 className="mb-4 font-bold text-4xl text-foreground">📚 Derslerim</h1>
					<p className="mx-auto max-w-3xl text-muted-foreground text-xl">
						Başladığın derslerin ve ilerleme durumun
					</p>
				</div>

				{/* Loading State */}
				{isLoading && (
					<div className="py-12 text-center">
						<div className="inline-flex items-center px-4 py-2 font-semibold text-primary leading-6">
							<svg
								className="mr-3 -ml-1 h-5 w-5 animate-spin text-primary"
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
						<div className="rounded-md border border-destructive bg-destructive/10 p-4">
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
							<div className="rounded-md border bg-secondary p-8">
								<h3 className="mb-2 font-medium text-foreground text-lg">
									Henüz ders başlatmadınız
								</h3>
								<p className="mb-4 text-muted-foreground">
									İlk dersinizi başlatmak için konular sayfasına gidin.
								</p>
								<Link
									href="/konular"
									className="inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 font-medium text-background text-sm transition-colors hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
