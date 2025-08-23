import CourseGrid from "@/components/grids/course-grid-wrapper";
import type { StrapiGrade } from "@/lib/strapi";
import { getCourses, getGrades, getSettings, getSubjects } from "@/lib/strapi";
import BrowseBySubject from "@/sections/browse-by-subject";
import Continue from "@/sections/continue-wrapper";
import ListCourses from "@/sections/course-listing-wrapper";

export default async function Home() {
	// Fetch settings, subjects, courses, and grades from Strapi
	const settings = await getSettings().catch(() => null);
	const subjects = await getSubjects();
	const courses = await getCourses();
	const grades = await getGrades();

	// Show settings error if settings is not configured
	if (!settings) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-50">
				<div className="mx-auto max-w-md p-6 text-center">
					<div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
						<h2 className="mb-2 font-semibold text-xl text-yellow-800">
							Ayarlar Yapılandırılmamış
						</h2>
						<p className="text-yellow-700">Strapi'de Setting'i doldur.</p>
					</div>
				</div>
			</div>
		);
	}

	const gradeNames = grades
		.filter((grade: StrapiGrade) => grade?.title) // Filter out null/undefined grades and titles
		.sort((a: StrapiGrade, b: StrapiGrade) => a.order - b.order)
		.map((grade: StrapiGrade) => grade.title)
		.filter((title, index, array) => array.indexOf(title) === index); // Remove duplicates

	return (
		<>
			{/* Hero Section */}
			<section className="px-4 py-16 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-7xl text-center">
					<h1 className="mb-6 font-bold text-4xl text-text">
						👋 {settings.siteName}'ye hoş geldiniz!
					</h1>

					<h2 className="mb-6 font-bold text-2xl text-text">
						Bugün ne öğrenmek istersin?
					</h2>
				</div>
			</section>

			{/* Show Continue section - authentication check moved to Continue component */}
			<Continue courses={courses} />

			<CourseGrid
				courses={courses}
				grades={gradeNames}
				topics={subjects.map((subject) => subject.title)}
				title="📚 Tüm Dersler"
			/>

			<ListCourses
				courses={courses.filter((course) => course.isPopular)}
				title="🔥 Popüler Dersler"
			/>

			<BrowseBySubject subjects={subjects} />
		</>
	);
}
