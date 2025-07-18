"use client"

import { useEffect, useState } from "react"
import { StrapiCourse } from "@/lib/strapi"
import { useAuthStore } from "@/stores/auth-store"
import CourseCard from "@/components/course-card"
import { getUserLessonProgress, getCourses, getAllCourseLessons } from "@/lib/strapi"
import { calculateCoursesProgress } from "@/lib/progress-utils"
import { BreadcrumbNav } from "@/components/layout/breadcrum-nav"
import Link from "next/link"

export default function DerslerimPage() {
    const { isAuthenticated, jwt, user } = useAuthStore()
    const [coursesWithProgress, setCoursesWithProgress] = useState<(StrapiCourse & { progress: number })[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    
    // Fetch all courses and user progress
    useEffect(() => {
        const fetchData = async () => {
            if (!isAuthenticated || !jwt || !user) {
                setError("Giriş yapmanız gerekiyor")
                setIsLoading(false)
                return
            }

            try {
                setIsLoading(true)
                setError(null)
                
                // Fetch all courses and course lessons data
                const [courses, courseLessons] = await Promise.all([
                    getCourses(),
                    getAllCourseLessons(jwt)
                ])
                
                // Get all lesson document IDs from course lessons
                const allLessonDocumentIds = courseLessons.map(courseLesson => courseLesson.lesson.documentId)

                // Fetch all lesson progress data
                const lessonProgressData = await getUserLessonProgress(allLessonDocumentIds, jwt)
                
                // Calculate progress for all courses using the utility function
                const updatedCoursesWithProgress = calculateCoursesProgress(
                    courses,
                    courseLessons,
                    lessonProgressData,
                    user.id
                )

                setCoursesWithProgress(updatedCoursesWithProgress)
            } catch (error) {
                console.error('Error fetching data:', error)
                setError("Veriler yüklenirken bir hata oluştu")
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [isAuthenticated, jwt, user])
    
    // Filter courses with progress > 0
    const continueCourses = coursesWithProgress
    
    // If not authenticated, show login message
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <BreadcrumbNav breadcrumbs={[{ label: "Derslerim", href: "/derslerim" }]} />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Derslerim</h1>
                        <p className="text-lg text-gray-600 mb-8">
                            Derslerinizi görmek için giriş yapmanız gerekiyor.
                        </p>
                    </div>
                </main>
            </div>
        )
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <BreadcrumbNav breadcrumbs={[{ label: "Derslerim", href: "/derslerim" }]} />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        📚 Derslerim
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Başladığın derslerin ve ilerleme durumun
                    </p>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-blue-500">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Dersleriniz yükleniyor...
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-12">
                        <div className="bg-red-50 border border-red-200 rounded-md p-4">
                            <p className="text-red-800">{error}</p>
                        </div>
                    </div>
                )}

                {/* Courses Grid */}
                {!isLoading && !error && (
                    <>
                        {continueCourses.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-0">
                                {continueCourses.map((course) => (
                                    <CourseCard 
                                        key={course.id} 
                                        course={course} 
                                        showProgress={true}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="bg-gray-50 border border-gray-200 rounded-md p-8">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Henüz ders başlatmadınız
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        İlk dersinizi başlatmak için konular sayfasına gidin.
                                    </p>
                                    <Link 
                                        href="/konular" 
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                    >
                                        Konulara Git
                                    </Link>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    )
} 