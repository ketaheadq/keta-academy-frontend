"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle,
  XCircle,
  Clock,
  Trophy,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Target,
} from "lucide-react"
import type { StrapiQuiz, StrapiQuestion, StrapiBlock } from "@/lib/strapi"

// Frontend-only types for quiz functionality
interface QuizAttempt {
  questionId: number;
  selectedAnswer: string | boolean;
  isCorrect: boolean;
  points: number;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  totalPoints: number;
  earnedPoints: number;
  percentage: number;
  passed: boolean;
  attempts: QuizAttempt[];
}

interface QuizProps {
  quiz: StrapiQuiz
  onComplete: (result: QuizResult) => void
  onClose: () => void
}

// Helper function to extract text from StrapiBlock array
const extractTextFromBlocks = (blocks: StrapiBlock[] | string | undefined): string => {
  if (!blocks) return "";
  if (typeof blocks === "string") return blocks;
  
  return blocks.map(block => 
    block.children?.map(child => child.text).join("") || ""
  ).join(" ");
};

export default function Quiz({ quiz, onComplete, onClose }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string | boolean>>({})
  const [showResults, setShowResults] = useState(false)
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimit ? quiz.timeLimit * 60 : null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const totalQuestions = quiz.questions.length
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100

  const handleAnswerChange = (questionId: number, answer: string | boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const calculateResults = (): QuizResult => {
    const attempts: QuizAttempt[] = []
    let correctAnswers = 0
    let earnedPoints = 0
    let totalPoints = 0

    quiz.questions.forEach((question: StrapiQuestion) => {
      const questionPoints = 10; // Default points if not specified
      totalPoints += questionPoints
      const userAnswer = answers[question.id]
      let isCorrect = false

      if (question.type === "multipleChoice") {
        const correctOption = question.options?.find((opt) => opt.isCorrect)
        isCorrect = userAnswer === correctOption?.text
      } else if (question.type === "trueFalse") {
        // For true/false, compare boolean values
        const correctAnswer = question.options?.find((opt) => opt.isCorrect)?.text
        isCorrect = userAnswer?.toString().toLowerCase() === correctAnswer?.toLowerCase()
      }

      if (isCorrect) {
        correctAnswers++
        earnedPoints += questionPoints
      }

      attempts.push({
        questionId: question.id,
        selectedAnswer: userAnswer,
        isCorrect,
        points: isCorrect ? questionPoints : 0,
      })
    })

    const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0
    const passed = percentage >= (quiz.passingScore || 70)

    return {
      totalQuestions,
      correctAnswers,
      totalPoints,
      earnedPoints,
      percentage,
      passed,
      attempts,
    }
  }

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const result = calculateResults()
    setQuizResult(result)
    setShowResults(true)
    setIsSubmitting(false)

    onComplete(result)
  }

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0)
    setAnswers({})
    setShowResults(false)
    setQuizResult(null)
    setTimeRemaining(quiz.timeLimit ? quiz.timeLimit * 60 : null)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const isAnswered = (questionId: number) => {
    return answers[questionId] !== undefined
  }

  const allQuestionsAnswered = quiz.questions.every((q) => isAnswered(q.id))

  if (showResults && quizResult) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {quizResult.passed ? (
              <div className="p-3 bg-green-100 rounded-full">
                <Trophy className="h-8 w-8 text-green-600" />
              </div>
            ) : (
              <div className="p-3 bg-red-100 rounded-full">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl">{quizResult.passed ? "Tebrikler! 🎉" : "Tekrar Deneyin! 💪"}</CardTitle>
          <CardDescription>
            {quizResult.passed
              ? "Quizi başarıyla tamamladınız!"
              : `Geçmek için %${quiz.passingScore || 70} gerekli. Puanınız %${quizResult.percentage.toFixed(1)}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{quizResult.percentage.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Final Puan</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{quizResult.correctAnswers}</div>
              <div className="text-sm text-gray-600">Doğru</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {quizResult.totalQuestions - quizResult.correctAnswers}
              </div>
              <div className="text-sm text-gray-600">Yanlış</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {quizResult.earnedPoints}/{quizResult.totalPoints}
              </div>
              <div className="text-sm text-gray-600">Puan</div>
            </div>
          </div>

          {/* Question Review */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Soru İncelemesi</h3>
            {quiz.questions.map((question, index) => {
              const attempt = quizResult.attempts.find((a) => a.questionId === question.id)
              const questionText = extractTextFromBlocks(question.text)
              const explanationText = extractTextFromBlocks(question.explanation)
              
              return (
                <Card
                  key={question.id}
                  className={`border-l-4 ${attempt?.isCorrect ? "border-l-green-500" : "border-l-red-500"}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {attempt?.isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-2">
                          {index + 1}. {questionText}
                        </p>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-600">Cevabınız: </span>
                            <span
                              className={attempt?.isCorrect ? "text-green-600 font-medium" : "text-red-600 font-medium"}
                            >
                              {attempt?.selectedAnswer?.toString()}
                            </span>
                          </div>
                          {!attempt?.isCorrect && (
                            <div>
                              <span className="text-gray-600">Doğru cevap: </span>
                              <span className="text-green-600 font-medium">
                                {question.type === "multipleChoice"
                                  ? question.options?.find((opt) => opt.isCorrect)?.text
                                  : question.options?.find((opt) => opt.isCorrect)?.text}
                              </span>
                            </div>
                          )}
                          {explanationText && (
                            <div className="mt-2 p-2 bg-blue-50 rounded text-blue-800">
                              <strong>Açıklama:</strong> {explanationText}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            {!quizResult.passed && quiz.maxAttempts && (quiz.maxAttempts || 0) > 1 && (
              <Button onClick={handleRetakeQuiz} className="flex items-center space-x-2">
                <RotateCcw className="h-4 w-4" />
                <span>Tekrar Dene</span>
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Quizi Kapat
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>{quiz.title}</span>
            </CardTitle>
            <CardDescription>{quiz.description}</CardDescription>
          </div>
          <div className="flex items-center space-x-4">
            {timeRemaining && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            )}
            <Badge variant="outline">
              {currentQuestionIndex + 1} / {totalQuestions}
            </Badge>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Question */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Badge className="mt-1">{currentQuestionIndex + 1}</Badge>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {extractTextFromBlocks(currentQuestion.text)}
              </h3>

              {/* Multiple Choice */}
              {currentQuestion.type === "multipleChoice" && currentQuestion.options && (
                <RadioGroup
                  value={answers[currentQuestion.id]?.toString() || ""}
                  onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                >
                  <div className="space-y-3">
                    {currentQuestion.options
                      .sort((a, b) => (a.order || 0) - (b.order || 0))
                      .map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.text} id={`option-${option.id}`} />
                          <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer">
                            {option.text}
                          </Label>
                        </div>
                      ))}
                  </div>
                </RadioGroup>
              )}

              {/* True/False */}
              {currentQuestion.type === "trueFalse" && currentQuestion.options && (
                <RadioGroup
                  value={answers[currentQuestion.id]?.toString() || ""}
                  onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                >
                  <div className="space-y-3">
                    {currentQuestion.options
                      .sort((a, b) => (a.order || 0) - (b.order || 0))
                      .map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.text} id={`option-${option.id}`} />
                          <Label htmlFor={`option-${option.id}`} className="cursor-pointer">
                            {option.text}
                          </Label>
                        </div>
                      ))}
                  </div>
                </RadioGroup>
              )}

              <div className="flex items-center space-x-2 mt-4 text-sm text-gray-600">
                <span>Puan: 1</span>
                {isAnswered(currentQuestion.id) && (
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Cevaplanmış
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="flex items-center space-x-2 bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Önceki</span>
          </Button>

          <div className="flex items-center space-x-4">
            {!allQuestionsAnswered && (
              <div className="flex items-center space-x-2 text-sm text-amber-600">
                <AlertCircle className="h-4 w-4" />
                <span>Göndermek için tüm soruları cevaplayın</span>
              </div>
            )}

            {currentQuestionIndex === totalQuestions - 1 ? (
              <Button
                onClick={handleSubmitQuiz}
                disabled={!allQuestionsAnswered || isSubmitting}
                className="flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Gönderiliyor...</span>
                  </>
                ) : (
                  <>
                    <Trophy className="h-4 w-4" />
                    <span>Quizi Gönder</span>
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={currentQuestionIndex === totalQuestions - 1}
                className="flex items-center space-x-2"
              >
                <span>Sonraki</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
