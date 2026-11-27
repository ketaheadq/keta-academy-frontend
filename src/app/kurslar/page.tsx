import type { Metadata } from "next";
import { Suspense } from "react";
import Courses from "@/components/features/home/courses";
import { CardGridSkeleton, FilterBarSkeleton } from "@/components/shared/loading-skeletons";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
	title: "Dersler | KetaLearn",
	alternates: { canonical: canonicalUrl("/kurslar") },
};

export default function CoursesPage() {
	return (
		<>
			<h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Dersler</h1>
			<Suspense
				fallback={
					<output aria-label="Kurslar yükleniyor" aria-busy="true">
						<span className="sr-only">Kurslar yükleniyor</span>
						<FilterBarSkeleton />
						<CardGridSkeleton />
					</output>
				}
			>
				<Courses />
			</Suspense>
		</>
	);
}
