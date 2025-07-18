import { BreadcrumbNav } from "@/components/layout/breadcrum-nav"
import CourseGrid from "@/components/grids/course-grid-wrapper"
import CourseListing from "@/sections/course-listing-wrapper"
import { getSubjectBySlug, getCourses, getGrades, StrapiCourse, getCoursesBySubject } from "@/lib/strapi"
import Continue from "@/sections/continue-wrapper"
import { getCourseIcon } from "@/lib/icons"

export default async function CoursePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  const slug = params.slug
  
  // Fetch data from Strapi
  const [subject, grades] = await Promise.all([
    getSubjectBySlug(slug),
    getGrades()
  ])
  const courses = subject?.slug ? await getCoursesBySubject(subject?.slug) : undefined
  if (!courses) {
    return <div>No courses found</div>
  }

  const IconComponent = subject?.icon?.name ? getCourseIcon(subject.icon?.name) : undefined;

  // Filter courses by the current subject
  const subjectCourses = courses.filter((course) => course.subject.slug === slug)
  
  // For now, we'll use empty array for continue courses since progress is handled client-side
  const continueCourses: (StrapiCourse & { progress: number })[] = []

  // Extract grade titles as strings
  const gradeTitles = grades.map(grade => grade.title)

  // Create topics array from subject courses (you might want to fetch this from Strapi)
  const topics = subjectCourses.map(course => course.subject.title)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <BreadcrumbNav breadcrumbs={[{ label: subject?.title || "", href: `/konular/${slug}` }]} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
          <div className="inline-flex p-3 rounded-full mb-3 bg-blue-100">
                      {IconComponent && <IconComponent className="h-6 w-6 text-blue-600" />} 
           </div>
           {subject?.title} Öğren
           </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {subject?.title} dersinde başarı elde et. 
          </p>
        </div>

          <Continue courses={courses} />

        {/* Popular Courses */}
        <CourseListing 
          courses={subjectCourses} 
          title={`Popüler ${subject?.title} Dersleri`} 
        />

        {/* Course Grid Component */}
        <CourseGrid 
          courses={subjectCourses}
          grades={gradeTitles}
          topics={topics}
          title={`Tüm ${subject?.title} Dersleri`}
        />
      </main>
    </div>
  )
}