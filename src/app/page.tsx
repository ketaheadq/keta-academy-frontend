import { getSettings, getSubjects, getCourses, getGrades } from "@/lib/strapi"
import Continue from "@/sections/continue-wrapper"
import BrowseBySubject from "@/sections/browse-by-subject"
import ListCourses from "@/sections/course-listing-wrapper"
import CourseGrid from "@/components/grids/course-grid-wrapper"
import type { StrapiSettings, StrapiSubject, StrapiCourse, StrapiGrade } from "@/lib/strapi"

export default async function Home() {
  // Fetch settings, subjects, courses, and grades from Strapi
  const settings = await getSettings().catch(() => null)
  const subjects = await getSubjects()
  const courses = await getCourses()
  const grades = await getGrades()

  // Show settings error if settings is not configured
  if (!settings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">
              Ayarlar Yapılandırılmamış
            </h2>
            <p className="text-yellow-700">
              Strapi'de Setting'i doldur.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const gradeNames = grades
    .filter((grade: StrapiGrade) => grade && grade.title) // Filter out null/undefined grades and titles
    .sort((a: StrapiGrade, b: StrapiGrade) => a.order - b.order)
    .map((grade: StrapiGrade) => grade.title)
    .filter((title, index, array) => array.indexOf(title) === index) // Remove duplicates

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-text mb-6">
            👋 {settings.siteName}'ye hoş geldiniz!
          </h1>
          <h2 className="text-2xl font-bold text-text mb-6">
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
  )
}
