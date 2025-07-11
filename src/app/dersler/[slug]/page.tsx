"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Play, Pause, Clock, BookOpen, CheckCircle, Circle, GraduationCap, Target } from "lucide-react"
import Image from "next/image"
import Quiz, { type QuizResult } from "@/components/quiz"
import type { StrapiCourse, StrapiLesson, StrapiQuiz, StrapiImage, StrapiSubject, StrapiGrade, StrapiQuestion, StrapiAnswerOption } from "@/lib/strapi"

// Extended lesson interface for mock data with additional properties
interface ExtendedLesson extends StrapiLesson {
  duration: number;
  order: number;
  youtubeVideoId: string;
  isCompleted: boolean;
  quiz?: StrapiQuiz;
}

// Mock data - updated to match Strapi interfaces
const mockCourse: StrapiCourse = {
  id: 1,
  documentId: "course_123",
  title: "Cebir I: Doğrusal Denklemler ve Fonksiyonlar",
  description:
    "Doğrusal denklemler, grafik çizimi ve fonksiyon analizinin temellerinde uzmanlaşın. Bu kapsamlı kurs, temel cebirsel işlemlerden ileri fonksiyon dönüşümlerine kadar her şeyi kapsar.",
  duration: 480, // minutes
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-15T00:00:00Z",
  publishedAt: "2024-01-01T00:00:00Z",
  slug: "algebra-1-linear-equations",
  thumbnail: {
    id: 1,
    documentId: "img_123",
    name: "algebra-thumbnail.jpg",
    alternativeText: "Cebir kursu küçük resmi",
    caption: null,
    width: 600,
    height: 400,
    formats: {},
    hash: "algebra_hash",
    ext: ".jpg",
    mime: "image/jpeg",
    size: 125.5,
    url: "/placeholder.svg?height=400&width=600",
    previewUrl: null,
    provider: "local",
    provider_metadata: {
      public_id: "algebra_thumb",
      resource_type: "image",
    },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    publishedAt: "2024-01-01T00:00:00Z",
  } as StrapiImage,
  subject: {
    id: 1,
    documentId: "math_subject",
    name: "Matematik",
    slug: "mathematics",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    publishedAt: "2024-01-01T00:00:00Z",
    description: "Matematiksel kavramlar ve problem çözme",
    icon: {
      id: 1,
      name: "calculator",
    },
  } as StrapiSubject,
  grades: [
    {
      id: 1,
      documentId: "grade_9",
      name: "9. Sınıf",
      slug: "9th-grade",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      publishedAt: "2024-01-01T00:00:00Z",
      order: 9,
    } as StrapiGrade,
  ],
  isPopular: true,
  course_lessons: [],
}

const mockQuizzes: Record<number, StrapiQuiz> = {
  1: {
    id: 1,
    documentId: "quiz_1",
    title: "Doğrusal Denklemler Temel Quiz",
    description: "Temel doğrusal denklemler konusundaki bilginizi test edin",
    passingScore: 70,
    timeLimit: 15,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    publishedAt: "2024-01-01T00:00:00Z",
    slug: "linear-equations-quiz",
    maxAttempts: 3,
    questions: [
      {
        id: 1,
        documentId: "question_1",
        text: [
          {
            type: "paragraph",
            children: [{ text: "y = 2x + 3 doğrusunun eğimi nedir?" }],
          },
        ],
        type: "multipleChoice",
        order: 1,
        points: 10,
        explanation: [
          {
            type: "paragraph",
            children: [{ text: "Eğim-kesim formunda y = mx + b, x'in katsayısı (m) eğimi temsil eder." }],
          },
        ],
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        publishedAt: "2024-01-01T00:00:00Z",
        options: [
          { id: 1, text: "2", isCorrect: true, order: 1 },
          { id: 2, text: "3", isCorrect: false, order: 2 },
          { id: 3, text: "-2", isCorrect: false, order: 3 },
          { id: 4, text: "5", isCorrect: false, order: 4 },
        ] as StrapiAnswerOption[],
      } as StrapiQuestion,
      {
        id: 2,
        documentId: "question_2",
        text: [
          {
            type: "paragraph",
            children: [{ text: "3x + 4 = 7 denklemi doğrusal bir denklem midir?" }],
          },
        ],
        type: "trueFalse",
        order: 2,
        points: 10,
        explanation: [
          {
            type: "paragraph",
            children: [{ text: "Evet, bu doğrusal bir denklemdir çünkü x değişkeninin derecesi 1'dir." }],
          },
        ],
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        publishedAt: "2024-01-01T00:00:00Z",
        options: [
          { id: 5, text: "Doğru", isCorrect: true, order: 1 },
          { id: 6, text: "Yanlış", isCorrect: false, order: 2 },
        ] as StrapiAnswerOption[],
      } as StrapiQuestion,
    ] as StrapiQuestion[],
  } as StrapiQuiz,
}

// Update mockLessons to include quiz references
const mockLessons: ExtendedLesson[] = [
  {
    id: 1,
    documentId: "lesson_1",
    title: "Doğrusal Denklemlere Giriş",
    description: "Doğrusal denklemlerin temellerini öğrenin ve nasıl tanımlayacağınızı keşfedin",
    videoURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: 25,
    order: 1,
    youtubeVideoId: "dQw4w9WgXcQ",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    publishedAt: "2024-01-01T00:00:00Z",
    isCompleted: true,
    quiz: mockQuizzes[1],
  },
  {
    id: 2,
    documentId: "lesson_2",
    title: "Tek Adımlı Denklem Çözme",
    description: "Basit doğrusal denklemleri çözmenin temellerinde ustalaşın",
    videoURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: 30,
    order: 2,
    youtubeVideoId: "dQw4w9WgXcQ",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    publishedAt: "2024-01-01T00:00:00Z",
    isCompleted: true,
  },
  {
    id: 3,
    documentId: "lesson_3",
    title: "Çok Adımlı Denklem Çözme",
    description: "Birden fazla işlem içeren karmaşık denklemleri çözmeyi öğrenin",
    videoURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: 35,
    order: 3,
    youtubeVideoId: "dQw4w9WgXcQ",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    publishedAt: "2024-01-01T00:00:00Z",
    isCompleted: false,
  },
  {
    id: 4,
    documentId: "lesson_4",
    title: "Doğrusal Denklemlerin Grafiği",
    description: "Koordinat düzleminde doğrusal denklemlerin nasıl grafik çizileceğini anlayın",
    videoURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: 40,
    order: 4,
    youtubeVideoId: "dQw4w9WgXcQ",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    publishedAt: "2024-01-01T00:00:00Z",
    isCompleted: false,
  },
  {
    id: 5,
    documentId: "lesson_5",
    title: "Eğim ve Y-Kesimi",
    description: "Eğim-kesim formu hakkında bilgi edinin ve eğimi nasıl bulacağınızı öğrenin",
    videoURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: 32,
    order: 5,
    youtubeVideoId: "dQw4w9WgXcQ",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    publishedAt: "2024-01-01T00:00:00Z",
    isCompleted: false,
  },
  {
    id: 6,
    documentId: "lesson_6",
    title: "Doğrusal Denklem Yazma",
    description: "Farklı formlarda denklem yazmayı pratik yapın",
    videoURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: 28,
    order: 6,
    youtubeVideoId: "dQw4w9WgXcQ",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    publishedAt: "2024-01-01T00:00:00Z",
    isCompleted: false,
  },
]

export default function CoursePage({ params }: { params: { slug: string } }) {
  const [currentLesson, setCurrentLesson] = useState<ExtendedLesson>(mockLessons[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [course] = useState<StrapiCourse>(mockCourse)
  const [lessons] = useState<ExtendedLesson[]>(mockLessons)
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuiz, setCurrentQuiz] = useState<StrapiQuiz | null>(null)

  const completedLessons = lessons.filter((lesson) => lesson.isCompleted).length
  const totalLessons = lessons.length
  const progressPercentage = (completedLessons / totalLessons) * 100

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const handleLessonSelect = (lesson: ExtendedLesson) => {
    setCurrentLesson(lesson)
    setIsPlaying(false)
  }

  const handleNextLesson = () => {
    const currentIndex = lessons.findIndex((lesson) => lesson.id === currentLesson.id)
    if (currentIndex < lessons.length - 1) {
      setCurrentLesson(lessons[currentIndex + 1])
      setIsPlaying(false)
    }
  }

  const handlePreviousLesson = () => {
    const currentIndex = lessons.findIndex((lesson) => lesson.id === currentLesson.id)
    if (currentIndex > 0) {
      setCurrentLesson(lessons[currentIndex - 1])
      setIsPlaying(false)
    }
  }

  const markLessonComplete = (lessonId: number) => {
    // In a real app, this would make an API call to update lesson completion status
    console.log(`Ders ${lessonId} tamamlandı olarak işaretleniyor`)
  }

  const handleStartQuiz = (quiz: StrapiQuiz) => {
    setCurrentQuiz(quiz)
    setShowQuiz(true)
  }

  const handleQuizComplete = (result: QuizResult) => {
    console.log("Quiz tamamlandı, sonuç:", result)
    // In a real app, save the result to the backend
  }

  const handleCloseQuiz = () => {
    setShowQuiz(false)
    setCurrentQuiz(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - Video Player */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-black rounded-t-lg relative overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${currentLesson.youtubeVideoId}${isPlaying ? "?autoplay=1" : ""}`}
                    title={currentLesson.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0"
                  />
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
                        disabled={lessons.findIndex((l) => l.id === currentLesson.id) === 0}
                      >
                        Önceki
                      </Button>
                      <Button onClick={() => setIsPlaying(!isPlaying)} className="flex items-center space-x-2">
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        <span>{isPlaying ? "Duraklat" : "Oynat"}</span>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleNextLesson}
                        disabled={lessons.findIndex((l) => l.id === currentLesson.id) === lessons.length - 1}
                      >
                        Sonraki
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant={currentLesson.isCompleted ? "secondary" : "default"}
                        onClick={() => markLessonComplete(currentLesson.id)}
                        className="flex items-center space-x-2"
                      >
                        {currentLesson.isCompleted ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                        <span>{currentLesson.isCompleted ? "Tamamlandı" : "Tamamlandı İşaretle"}</span>
                      </Button>
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
                        <span className="text-sm text-gray-600">Konu: {course.subject.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Sınıf: {course.grades.map((g: StrapiGrade) => g.name).join(", ")}
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
                <CardDescription>Kurstaki ilerlemenizi takip edin</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-96">
                  <div className="p-4 space-y-2">
                    {lessons.map((lesson, index) => (
                      <div key={lesson.id}>
                        <div
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            currentLesson.id === lesson.id
                              ? "bg-blue-50 border-2 border-blue-200"
                              : "hover:bg-gray-50 border-2 border-transparent"
                          }`}
                          onClick={() => handleLessonSelect(lesson)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                              {lesson.isCompleted ? (
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
                        {index < lessons.length - 1 && <Separator className="my-2" />}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
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
  )
}
