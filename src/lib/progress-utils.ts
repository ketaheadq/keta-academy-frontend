import { StrapiCourse, StrapiLessonProgress, StrapiCourseLesson } from "@/lib/strapi"

/**
 * Calculate course progress based on lesson completion ratio
 * @param course - The course object
 * @param courseLessons - Array of all course lessons data
 * @param lessonProgressData - Array of lesson progress data from Strapi
 * @param userId - The user ID to filter progress for
 * @returns Progress percentage (0-100)
 */
export function calculateCourseProgress(
  course: StrapiCourse,
  courseLessons: StrapiCourseLesson[],
  lessonProgressData: StrapiLessonProgress[],
  userId: string
): number {
  // Get lessons for this specific course
  const courseLessonData = courseLessons.filter(courseLesson => {
    if (typeof courseLesson.course === 'number') {
      return courseLesson.course === course.id
    } else {
      return courseLesson.course.id === course.id
    }
  })
  
  const totalLessons = courseLessonData.length
  
  if (totalLessons === 0) {
    return 0
  }

  // Filter lesson progress for the current user
  const userLessonProgress = lessonProgressData.filter(progress => {
    // Extract user ID from composite ID (user_id_lessonId)
    const parts = progress.user_plus_lesson_id.split('_')
    if (parts.length >= 2) {
      const progressUserId = parts[0]
      return progressUserId === userId
    }
    return false
  })

  // Count completed lessons for this course
  const completedLessons = userLessonProgress.filter(progress => {
    // Check if this lesson belongs to the current course
    const lessonDocumentId = progress.user_plus_lesson_id.split('_')[1]
    return courseLessonData.some(courseLesson => 
      courseLesson.lesson.documentId === lessonDocumentId
    ) && progress.isCompleted
  }).length

  // Calculate progress percentage
  const progressPercentage = (completedLessons / totalLessons) * 100
  
  return Math.round(progressPercentage)
}

/**
 * Calculate course progress with fallback to course status
 * @param course - The course object
 * @param courseLessons - Array of all course lessons data
 * @param lessonProgressData - Array of lesson progress data
 * @param courseProgress - Course progress data from Strapi
 * @param userId - The user ID
 * @returns Progress percentage (0-100)
 */
export function calculateCourseProgressWithFallback(
  course: StrapiCourse,
  courseLessons: StrapiCourseLesson[],
  lessonProgressData: StrapiLessonProgress[],
  courseProgress: any,
  userId: string
): number {
  // If we have lesson progress data, calculate based on lesson completion
  if (lessonProgressData.length > 0) {
    return calculateCourseProgress(course, courseLessons, lessonProgressData, userId)
  }
  
  // Fallback to course status if no lesson progress data
  if (courseProgress) {
    switch (courseProgress.course_status) {
      case 'completed':
        return 100
      case 'in_progress':
        return 50
      case 'not_started':
      default:
        return 0
    }
  }
  
  return 0
}

/**
 * Get course progress for multiple courses
 * @param courses - Array of courses
 * @param courseLessons - Array of all course lessons data
 * @param lessonProgressData - Array of lesson progress data
 * @param userId - The user ID
 * @returns Array of courses with progress
 */
export function calculateCoursesProgress(
  courses: StrapiCourse[],
  courseLessons: StrapiCourseLesson[],
  lessonProgressData: StrapiLessonProgress[],
  userId: string
): (StrapiCourse & { progress: number })[] {
  return courses.map(course => ({
    ...course,
    progress: calculateCourseProgress(course, courseLessons, lessonProgressData, userId)
  }))
} 