import CoursePage from "@/components/pages/course"
import { getCourse, getLessonsByCourseId } from "@/lib/strapi"

export default async function DerslerPage({ 
    params, 
    searchParams 
}: { 
    params: { slug: string }
    searchParams: { ders_ismi?: string }
}) {

    const {slug} = await params
    const {ders_ismi} = await searchParams

    const course = await getCourse(slug)
    const courseLessons = await getLessonsByCourseId(course.id)
    // Extract lessons from course-lessons (they're already sorted by order)
    const lessons = courseLessons.map(courseLesson => courseLesson.lesson)
    

    return (
        <CoursePage 
            course={course} 
            lessons={lessons}
            ders_ismi={ders_ismi}
        />
    )
}