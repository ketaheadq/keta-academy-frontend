import CourseGrid from "@/components/grids/course-grid-wrapper";
import { BreadcrumbNav } from "@/components/layout/breadcrum-nav";
import { getCourseIcon } from "@/lib/icons";
import { getCoursesBySubject, getGrades, getSubjectBySlug } from "@/lib/strapi";
import Continue from "@/sections/continue-wrapper";
import CourseListing from "@/sections/course-listing-wrapper";

export default async function CoursePage(props: { params: Promise<{ slug: string }> }) {
	const params = await props.params;
	const slug = params.slug;

	// Fetch data from Strapi
	const [subject, grades] = await Promise.all([getSubjectBySlug(slug), getGrades()]);
	const courses = subject?.slug ? await getCoursesBySubject(subject?.slug) : undefined;
	if (!courses) {
		return <div>No courses found</div>;
	}

	const IconComponent = subject?.icon?.name ? getCourseIcon(subject.icon?.name) : undefined;

	// Filter courses by the current subject
	const subjectCourses = courses.filter((course) => course.subject.slug === slug);

	// Extract grade titles as strings
	const gradeTitles = grades.map((grade) => grade.title);

	// Create topics array from subject courses (you might want to fetch this from Strapi)
	const topics = subjectCourses.map((course) => course.subject.title);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<BreadcrumbNav breadcrumbs={[{ label: subject?.title || "", href: `/konular/${slug}` }]} />

			<main className="mx-auto px-4 py-8 sm:px-6 lg:px-8">
				{/* Hero Section */}
				<div className="mb-12 text-center">
					<h1 className="mb-4 font-bold text-4xl text-gray-900">
						<div className="mb-3 inline-flex rounded-full bg-blue-100 p-3">
							{IconComponent && <IconComponent className="h-6 w-6 text-blue-600" />}
						</div>
						{subject?.title} Öğren
					</h1>
					<p className="mx-auto max-w-3xl text-gray-600 text-xl">
						{subject?.title} dersinde başarı elde et.
					</p>
				</div>

				<Continue courses={courses} />

				{/* Popular Courses */}
				<CourseListing courses={subjectCourses} title={`Popüler ${subject?.title} Dersleri`} />

				{/* Course Grid Component */}
				<CourseGrid
					courses={subjectCourses}
					grades={gradeTitles}
					topics={topics}
					title={`Tüm ${subject?.title} Dersleri`}
				/>
			</main>
		</div>
	);
}
