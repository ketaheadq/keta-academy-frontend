import Link from "next/link";
import CourseCard from "@/components/shared/cards/course-card";
import CourseGrid from "@/components/shared/grids/course-grid-wrapper";
import { getPublishedCourses } from "@/lib/strapi";

export default async function Courses({ preview = false }: Readonly<{ preview?: boolean }>) {
	const courses = await getPublishedCourses(preview ? 3 : undefined).catch(() => null);

	if (!preview && courses?.length) {
		const grades = [...new Set(courses.flatMap(course => course.grades?.map(grade => grade.title) ?? []))];
		const topics = [...new Set(courses.flatMap(course => course.subject ? [course.subject.title] : []))];
		return <CourseGrid courses={courses} grades={grades} topics={topics} title={null} />;
	}

	return (
		<section aria-label="Kurs listesi" className={preview ? "py-8 sm:py-10" : "py-4"}>
			{preview && (
				<div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
					<h2 className="font-semibold text-2xl tracking-tight">Dersler</h2>
					<Link href="/kurslar" className="font-medium text-primary underline-offset-4 hover:underline">
						Tüm dersler
					</Link>
				</div>
			)}
			{courses === null ? (
				<p role="status" className="rounded-lg border p-4 text-muted-foreground">
					Dersler şu anda yüklenemiyor. Lütfen biraz sonra tekrar dene.
				</p>
			) : courses.length === 0 ? (
				<p className="rounded-lg border p-4 text-muted-foreground">Henüz yayımlanmış ders yok.</p>
			) : (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{courses.map(course => <CourseCard key={course.documentId} course={course} />)}
				</div>
			)}
		</section>
	);
}
