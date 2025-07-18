"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Clock, BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth-store"
import { StrapiCourse } from "@/lib/strapi"

interface CourseCardProps {
  course: StrapiCourse & { progress?: number }
  title?: React.ReactNode
  showProgress?: boolean
}

export default function CourseCard({ course, title, showProgress = false }: CourseCardProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  const handleCourseClick = () => {
    router.push(`/kurslar/${course.slug}`)
  }

  const getButtonText = () => {
    if (showProgress && course.progress && course.progress > 0) {
      return "Devam Et"
    }
    return isAuthenticated ? "Kursa Başla" : "Kursa Başla"
  }

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer" 
      onClick={handleCourseClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="secondary">
                {course.grades.map((grade) => grade.title).join(", ")}
              </Badge>
              <Badge variant="outline">{course.subject.title}</Badge>
              {course.isPopular && (
                <Badge className="bg-orange-500">Popüler</Badge>
              )}
            </div>
            <CardTitle className="text-lg mb-2">
              {title || course.title}
            </CardTitle>
            <CardDescription>{course.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration} dk</span>
            </div>
            <div className="flex items-center space-x-1">
              <BookOpen className="h-4 w-4" />
              <span>{course.course_lessons?.length || 0} ders</span>
            </div>
          </div>
        </div>
        {/* Progress bar if showProgress is true and course has progress */}
        {showProgress  && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>İlerleme</span>
              <span>{course.progress ? course.progress : 0}%</span> 
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${course.progress ? course.progress : 0}%` }}
              />
            </div>
          </div>
        )}
        
        <Button 
          className="w-full" 
          onClick={(e) => {
            e.stopPropagation()
            handleCourseClick()
          }}
        >
          <Play className="h-4 w-4 mr-2" />
          {getButtonText()}
        </Button>
      </CardContent>
    </Card>
  )
} 