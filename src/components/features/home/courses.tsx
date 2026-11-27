import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import CourseCard from "@/components/shared/cards/course-card";
import CourseGrid from "@/components/shared/grids/course-grid-wrapper";
import { getPublishedCourses } from "@/lib/strapi";

export default async function Courses({ preview = false }: Readonly<{ preview?: boolean }>) {
	const courses = await getPublishedCourses(preview ? 3 : undefined).catch(() => null);

	if (!preview && courses?.length) {
		const grades = [
			...new Set(courses.flatMap((course) => course.grades?.map((grade) => grade.title) ?? [])),
		];
		const topics = [
			...new Set(courses.flatMap((course) => (course.subject ? [course.subject.title] : []))),
		];
		return <CourseGrid courses={courses} grades={grades} topics={topics} title={null} />;
	}

	return (
		<section aria-label="Kurs listesi" className={preview ? "py-8 sm:py-10" : "py-4"}>
			{preview && (
				<Reveal className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
					<h2 className="text-2xl font-semibold tracking-tight">Dersler</h2>
					<Link href="/kurslar" className="accent-link text-primary inline-block font-medium">
						Tüm dersler
					</Link>
				</Reveal>
			)}
			{courses === null ? (
				<output className="text-muted-foreground block rounded-lg border p-4">
					Dersler şu anda yüklenemiyor. Lütfen biraz sonra tekrar dene.
				</output>
			) : courses.length === 0 ? (
				<p className="text-muted-foreground rounded-lg border p-4">Henüz yayımlanmış ders yok.</p>
			) : (
				<RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{courses.map((course) => (
						<RevealItem key={course.documentId}>
							<CourseCard course={course} />
						</RevealItem>
					))}
				</RevealGroup>
			)}
		</section>
	);
}
