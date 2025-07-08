import { getSettings, getSubjects, getCourses, getGrades } from "@/lib/strapi";
import CourseSelection from "@/sections/course-selection";
import Continue from "@/sections/continiue";
import BrowseBySubject from "@/sections/browse-by-subject";
import ListCourses from "@/sections/course-listing";
import CourseGrid from "@/components/course-grid";

export default async function Home() {
  // Fetch settings, subjects, courses, and grades from Strapi
  const settings = await getSettings();
  const subjects = await getSubjects();
  const courses = await getCourses();
  const grades = await getGrades();


  const gradeNames = grades
    .sort((a: any, b: any) => a.order - b.order) // Sort by order
    .map((grade: any) => grade.name);

  // Add progress to courses (only for Continue component)
  const coursesWithProgress = courses.map((course: any, index: number) => ({
    ...course,
    progress: index === 0 ? 65 : 0, // Give first course some progress for testing
  }));

  // Group courses by grade for CourseSelection component
  // Try to match course title with actual grades from API
  const coursesByGrade = coursesWithProgress.reduce((acc: any, course: any) => {
    const matchedGrade = grades.find((grade: any) => 
      course.title.toLowerCase().includes(grade.name.toLowerCase())
    );
    
    const gradeKey = matchedGrade ? matchedGrade.name : "Genel";
    
    if (!acc[gradeKey]) {
      acc[gradeKey] = [];
    }
    acc[gradeKey].push(course);
    return acc;
  }, {});

  // Get new courses (latest 3)
  const newCourses = courses.slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-text mb-6">
            👋 {settings.siteName}'ye hoşgeldiniz! Bugün ne öğrenmek istersin?
          </h1>
        </div>
      </section>

      <CourseGrid 
          courses={courses}
          grades={gradeNames}
          topics={subjects.map((subject) => subject.name)}
          title={`Tüm ${subjects[0]?.name} Dersleri`}
        />
       {/*<ListCourses courses={newCourses} title="Popüler Matematik Dersleri" />*/}
      <Continue courses={coursesWithProgress} />
      <BrowseBySubject subjects={subjects} />
    </>
  );
}
