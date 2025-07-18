"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Play, Pause, Clock, BookOpen, CheckCircle, Circle, GraduationCap, Target } from "lucide-react"
import Image from "next/image"
import Quiz, { type QuizResult } from "@/components/quiz"
import ShareButton from "@/components/ui/share-button"
import { useAuthStore } from "@/stores/auth-store"
import { useLessonProgress } from "@/hooks/useLessonProgress"
import { 
  updateQuizProgress
} from "@/lib/strapi"
import type { StrapiCourse, StrapiLesson, StrapiQuiz, StrapiGrade } from "@/lib/strapi"

// Extended lesson interface for mock data with additional properties
interface ExtendedLesson extends StrapiLesson {
  duration: number;
  order: number;
  youtubeVideoId: string;
  quiz?: StrapiQuiz;
}

interface CoursePageProps {
    course: StrapiCourse
    lessons: StrapiLesson[]
    ders_ismi?: string
    searchParams?: { ders_ismi?: string }
}

export default function CoursePage({ course, lessons, ders_ismi, searchParams }: CoursePageProps) {
  console.log("lessons", lessons)
  const router = useRouter()
  const pathname = usePathname()
  const { user, jwt, isAuthenticated } = useAuthStore()
  
  // Convert StrapiLesson to ExtendedLesson format for compatibility
  const [extendedLessons, setExtendedLessons] = useState<ExtendedLesson[]>([])
  
  // Use the custom hook for progress management
  const { lessonProgress, isLoading: isLoadingProgress, markLessonComplete } = useLessonProgress({
    documentIds: lessons.map(l => l.documentId),
    documentId: course.documentId
  })

  // Debug: Log progress state
  useEffect(() => {
    console.log('Lesson progress state:', lessonProgress)
    console.log('Is loading progress:', isLoadingProgress)
  }, [lessonProgress, isLoadingProgress])

  // Check for duplicate lesson IDs
  const lessonIds = lessons.map(lesson => lesson.id)
  const duplicateIds = lessonIds.filter((id, index) => lessonIds.indexOf(id) !== index)
  if (duplicateIds.length > 0) {
    console.warn("⚠️ Duplicate lesson IDs found:", duplicateIds)
    console.log("All lesson IDs:", lessonIds)
  }

  // Initialize lessons
  useEffect(() => {
    const initialLessons: ExtendedLesson[] = lessons.map((lesson, index) => ({
      ...lesson,
      duration: 30, // Default duration, should come from Strapi
      order: index + 1,
      youtubeVideoId: extractYouTubeVideoId(lesson.videoURL) || "dQw4w9WgXcQ",
      quiz: undefined, // This should come from Strapi if lesson has quiz
    }))
    setExtendedLessons(initialLessons)
  }, [lessons])

  // Determine starting lesson after extendedLessons are initialized
  const [initialLesson, setInitialLesson] = useState<ExtendedLesson | null>(null)
  
  useEffect(() => {
    if (extendedLessons.length > 0) {
      console.log("Available lesson slugs:", extendedLessons.map(l => l.slug))
      
      // Check both searchParams and the ders_ismi prop
      const targetSlug = searchParams?.ders_ismi || ders_ismi
      console.log("Looking for slug:", targetSlug)
      
      const targetLesson = targetSlug
        ? extendedLessons.find(lesson => lesson.slug === targetSlug)
        : null
      
      console.log("Found target lesson:", targetLesson?.title || "NOT FOUND")
      
      const lessonToSet = targetLesson || extendedLessons[0]
      console.log("Setting initial lesson:", lessonToSet.title, "from slug:", targetSlug)
      setInitialLesson(lessonToSet)
    }
  }, [extendedLessons, searchParams?.ders_ismi, ders_ismi])

  const [currentLesson, setCurrentLesson] = useState<ExtendedLesson | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuiz, setCurrentQuiz] = useState<StrapiQuiz | null>(null)

  // Update current lesson when initial lesson changes
  useEffect(() => {
    if (initialLesson && (!currentLesson || initialLesson.id !== currentLesson.id)) {
      console.log("Setting current lesson to:", initialLesson.title)
      setCurrentLesson(initialLesson)
    }
  }, [initialLesson, currentLesson])

  // Debug: Monitor searchParams changes
  useEffect(() => {
    console.log("Search params changed:", searchParams?.ders_ismi)
    console.log("Initial lesson:", initialLesson?.title)
    console.log("Current lesson:", currentLesson?.title)
  }, [searchParams?.ders_ismi, initialLesson, currentLesson])

  // Helper function to extract YouTube video ID from URL
  function extractYouTubeVideoId(url: string): string | null {
    console.log('🔍 Extracting video ID from URL:', url)
    
    // Handle different YouTube URL formats
    const patterns = [
      // youtube.com/watch?v=VIDEO_ID
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      // youtube.com/v/VIDEO_ID
      /youtube\.com\/v\/([^&\n?#]+)/,
      // youtube.com/embed/VIDEO_ID
      /youtube\.com\/embed\/([^&\n?#]+)/,
      // youtu.be/VIDEO_ID
      /youtu\.be\/([^&\n?#]+)/
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        const videoId = match[1]
        console.log('✅ Extracted video ID:', videoId)
        return videoId
      }
    }
    
    console.log('❌ Could not extract video ID from URL:', url)
    return null
  }

  const completedLessons = extendedLessons.filter((lesson) => lessonProgress[lesson.documentId]).length
  const totalLessons = extendedLessons.length
  const progressPercentage = (completedLessons / totalLessons) * 100

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const getCurrentLessonUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${pathname}?ders_ismi=${currentLesson?.slug}`
    }
    return ""
  }

  const handleLessonSelect = (lesson: ExtendedLesson) => {
    setCurrentLesson(lesson)
    setIsPlaying(false)
    // Update URL with current lesson
    router.push(`${pathname}?ders_ismi=${lesson.slug}`, { scroll: false })
  }

  const handleNextLesson = () => {
    const currentIndex = extendedLessons.findIndex((lesson) => lesson.id === currentLesson?.id)
    if (currentIndex < extendedLessons.length - 1) {
      const nextLesson = extendedLessons[currentIndex + 1]
      setCurrentLesson(nextLesson)
      setIsPlaying(false)
      // Update URL with next lesson
      router.push(`${pathname}?ders_ismi=${nextLesson.slug}`, { scroll: false })
    }
  }

  const handlePreviousLesson = () => {
    const currentIndex = extendedLessons.findIndex((lesson) => lesson.id === currentLesson?.id)
    if (currentIndex > 0) {
      const prevLesson = extendedLessons[currentIndex - 1]
      setCurrentLesson(prevLesson)
      setIsPlaying(false)
      // Update URL with previous lesson
      router.push(`${pathname}?ders_ismi=${prevLesson.slug}`, { scroll: false })
    }
  }

  const handleStartQuiz = async (quiz: StrapiQuiz) => {
    setCurrentQuiz(quiz)
    setShowQuiz(true)

    // Update quiz progress to 'in_progress' when user starts
    if (isAuthenticated && jwt) {
      try {
        await updateQuizProgress(quiz.id, 'in_progress', undefined, jwt)
      } catch (error) {
        console.error('Failed to update quiz progress:', error)
      }
    }
  }

  const handleQuizComplete = async (result: QuizResult) => {
    console.log("Quiz completed, result:", result)
    
    // Update quiz progress to 'completed' with score
    if (isAuthenticated && jwt && currentQuiz) {
      try {
        await updateQuizProgress(currentQuiz.id, 'completed', result.earnedPoints, jwt)
      } catch (error) {
        console.error('Failed to update quiz progress:', error)
      }
    }
  }

  const handleCloseQuiz = () => {
    setShowQuiz(false)
    setCurrentQuiz(null)
  }

  // Show loading state while lessons are being initialized
  if (extendedLessons.length === 0 || !currentLesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Kurs yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Show authentication notice if not logged in */}
        {!isAuthenticated && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>Not:</strong> İlerlemenizi kaydetmek için <a href="/giris" className="underline">giriş yapın</a>.
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - Video Player */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <Card className="py-0">
              <CardContent className="p-0">
                <div className="aspect-video bg-black rounded-t-lg relative overflow-hidden">
                  {currentLesson.youtubeVideoId ? (
                    <iframe
                      key={currentLesson.id} // Force re-render when lesson changes
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${currentLesson.youtubeVideoId}${isPlaying ? "?autoplay=1" : ""}`}
                      title={currentLesson.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <div className="text-center">
                        <p className="text-lg mb-2">Video yüklenemedi</p>
                        <p className="text-sm text-gray-300">Video URL'si geçersiz: {currentLesson.videoURL}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">{currentLesson.title}</h1>
                      <p className="text-gray-600">{currentLesson.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">{formatDuration(currentLesson.duration)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="outline"
                        onClick={handlePreviousLesson}
                        disabled={extendedLessons.findIndex((l) => l.id === currentLesson?.id) === 0}
                      >
                        Önceki
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleNextLesson}
                        disabled={extendedLessons.findIndex((l) => l.id === currentLesson?.id) === extendedLessons.length - 1}
                      >
                        Sonraki
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <ShareButton
                        url={getCurrentLessonUrl()}
                        title={currentLesson.title}
                        description={course.title}
                      />
                      {user ? <Button
                        variant={lessonProgress[currentLesson.documentId] ? "secondary" : "default"}
                        onClick={lessonProgress[currentLesson.documentId] ? 
                          () => {} : () => markLessonComplete(currentLesson.documentId)}
                        className="flex items-center space-x-2"
                        disabled={!isAuthenticated}
                      >
                        {lessonProgress[currentLesson.documentId] ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                        <span>{lessonProgress[currentLesson.documentId] ? "Tamamlandı" : "Tamamlandı İşaretle"}</span>
                      </Button> : <Button
                        variant="outline"
                        onClick={() => router.push("/giris")}
                        className="flex items-center space-x-2"
                      >
                        Giriş Yap
                      </Button>}
                      
                      {currentLesson.quiz && (
                        <Button
                          variant="outline"
                          onClick={() => handleStartQuiz(currentLesson.quiz!)}
                          className="flex items-center space-x-2"
                        >
                          <Target className="h-4 w-4" />
                          <span>Quiz Çöz</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Bu Kurs Hakkında</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Kurs Açıklaması</h3>
                    <p className="text-gray-600 mb-4">{course.description}</p>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Konu: {course.subject.title}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Sınıf: {course.grades.map((g: StrapiGrade) => g.title).join(", ")}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Toplam Süre: {formatDuration(course.duration)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{totalLessons} Ders</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Image
                      src={course.thumbnail.url || "/placeholder.svg"}
                      alt={course.thumbnail.alternativeText || course.title}
                      width={course.thumbnail.width}
                      height={course.thumbnail.height}
                      className="rounded-lg object-cover w-full h-48"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Lessons List */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Kurs Dersleri</span>
                  <Badge variant="secondary">
                    {completedLessons}/{totalLessons}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Kurstaki ilerlemenizi takip edin
                  {isLoadingProgress && <span className="ml-2 text-blue-500">(Yükleniyor...)</span>}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-96">
                  <div className="p-4 space-y-2">
                    {extendedLessons.map((lesson, index) => (
                      <div key={`${lesson.id}-${lesson.documentId}-${index}`}>
                        <div
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            currentLesson?.id === lesson.id
                              ? "bg-blue-50 border-2 border-blue-200"
                              : "hover:bg-gray-50 border-2 border-transparent"
                          }`}
                          onClick={() => handleLessonSelect(lesson)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                              {lessonProgress[lesson.documentId] ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <Circle className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {lesson.order}. {lesson.title}
                                </p>
                                <div className="flex items-center space-x-1 text-xs text-gray-500">
                                  <Clock className="h-3 w-3" />
                                  <span>{formatDuration(lesson.duration)}</span>
                                </div>
                              </div>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{lesson.description}</p>
                            </div>
                          </div>
                        </div>
                        {lesson.quiz && (
                          <Badge variant="outline" className="text-xs ml-2">
                            Quiz
                          </Badge>
                        )}
                        {index < extendedLessons.length - 1 && <Separator className="my-2" />}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Quiz Modal */}
        {showQuiz && currentQuiz && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="max-h-[90vh] overflow-y-auto">
              <Quiz quiz={currentQuiz} onComplete={handleQuizComplete} onClose={handleCloseQuiz} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}