import { BreadcrumbNav } from "@/components/layout/breadcrum-nav"
import CourseGrid from "@/components/course-grid"
import CourseListing from "@/sections/course-listing"
import { getSubjectBySlug, StrapiCourse } from "@/lib/strapi"
import Continue from "@/sections/continiue"
import { getCourses } from "@/lib/strapi"
const grades = ["All Grades", "9th Grade", "10th Grade", "11th Grade", "12th Grade"]
const topics = ["All Topics", "Algebra", "Geometry", "Calculus", "Statistics"]

export default async function CoursePage(props: { params: Promise<{ slug: string }> }) {
  const courses = await getCourses()
  const mathCourses = courses.filter((course) => course.subject.name === "Matematik")
  const continueCourses = mathCourses.filter((course) => course.progress > 0)

  const params = await props.params
  const slug = params.slug
  const subject = await getSubjectBySlug(slug)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <BreadcrumbNav breadcrumbs={[{ label: subject?.name || "", href: `/konular/${slug}` }]} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">📐 {subject?.name} Öğren</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {subject?.name} dersinde başarı elde et. 
          </p>
        </div>

        {/* Math Topics Overview
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">🎯 Explore Math Topics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mathTopics.map((topic) => {
              const IconComponent = topic.icon
              return (
                <Card key={topic.name} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className={`inline-flex p-3 rounded-full ${topic.color} mb-3`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{topic.name}</h3>
                    <p className="text-sm text-gray-600">{topic.courses} courses</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section> */}

        {/* Continue Learning */}
        <Continue courses={continueCourses as unknown as (StrapiCourse & { progress: number })[]} />

        {/* Popular Courses */}
        <CourseListing courses={mathCourses as unknown as StrapiCourse[]} title="Popüler Matematik Dersleri" />
        {/* Course Grid Component */}
        <CourseGrid 
          courses={mathCourses}
          grades={grades}
          topics={topics}
          title={`Tüm ${subject?.name} Dersleri`}
        />
      </main>
    </div>
  )
}