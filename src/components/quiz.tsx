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
import type { StrapiQuiz, QuizAttempt, QuizResult } from "@/types/strapi"

interface QuizProps {
  quiz: StrapiQuiz
  onComplete: (result: QuizResult) => void
  onClose: () => void
}

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

    quiz.questions.forEach((question: StrapiQuizQuestion) => {
      totalPoints += question.points
      const userAnswer = answers[question.id]
      let isCorrect = false

      if (question.type === "multiple_choice") {
        const correctOption = question.options?.find((opt) => opt.isCorrect)
        isCorrect = userAnswer === correctOption?.text
      } else if (question.type === "true_false") {
        isCorrect = userAnswer === (question.correctAnswer === "true")
      } else if (question.type === "fill_blank") {
        isCorrect = userAnswer?.toString().toLowerCase().trim() === question.correctAnswer?.toLowerCase().trim()
      }

      if (isCorrect) {
        correctAnswers++
        earnedPoints += question.points
      }

      attempts.push({
        questionId: question.id,
        selectedAnswer: userAnswer,
        isCorrect,
        points: isCorrect ? question.points : 0,
      })
    })

    const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0
    const passed = percentage >= quiz.passingScore

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
          <CardTitle className="text-2xl">{quizResult.passed ? "Congratulations! 🎉" : "Keep Trying! 💪"}</CardTitle>
          <CardDescription>
            {quizResult.passed
              ? "You've successfully completed the quiz!"
              : `You need ${quiz.passingScore}% to pass. You scored ${quizResult.percentage.toFixed(1)}%`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{quizResult.percentage.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Final Score</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{quizResult.correctAnswers}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {quizResult.totalQuestions - quizResult.correctAnswers}
              </div>
              <div className="text-sm text-gray-600">Incorrect</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {quizResult.earnedPoints}/{quizResult.totalPoints}
              </div>
              <div className="text-sm text-gray-600">Points</div>
            </div>
          </div>

          {/* Question Review */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Question Review</h3>
            {quiz.questions.map((question, index) => {
              const attempt = quizResult.attempts.find((a) => a.questionId === question.id)
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
                          {index + 1}. {question.question}
                        </p>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-600">Your answer: </span>
                            <span
                              className={attempt?.isCorrect ? "text-green-600 font-medium" : "text-red-600 font-medium"}
                            >
                              {attempt?.selectedAnswer?.toString()}
                            </span>
                          </div>
                          {!attempt?.isCorrect && (
                            <div>
                              <span className="text-gray-600">Correct answer: </span>
                              <span className="text-green-600 font-medium">
                                {question.type === "multiple_choice"
                                  ? question.options?.find((opt) => opt.isCorrect)?.text
                                  : question.correctAnswer}
                              </span>
                            </div>
                          )}
                          {question.explanation && (
                            <div className="mt-2 p-2 bg-blue-50 rounded text-blue-800">
                              <strong>Explanation:</strong> {question.explanation}
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
            {!quizResult.passed && quiz.maxAttempts && (quiz.attempts || 0) < quiz.maxAttempts && (
              <Button onClick={handleRetakeQuiz} className="flex items-center space-x-2">
                <RotateCcw className="h-4 w-4" />
                <span>Retake Quiz</span>
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Close Quiz
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
              {currentQuestionIndex + 1} of {totalQuestions}
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">{currentQuestion.question}</h3>

              {/* Multiple Choice */}
              {currentQuestion.type === "multiple_choice" && currentQuestion.options && (
                <RadioGroup
                  value={answers[currentQuestion.id]?.toString() || ""}
                  onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                >
                  <div className="space-y-3">
                    {currentQuestion.options
                      .sort((a, b) => a.order - b.order)
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
              {currentQuestion.type === "true_false" && (
                <RadioGroup
                  value={answers[currentQuestion.id]?.toString() || ""}
                  onValueChange={(value) => handleAnswerChange(currentQuestion.id, value === "true")}
                >
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="true" />
                      <Label htmlFor="true" className="cursor-pointer">
                        True
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="false" />
                      <Label htmlFor="false" className="cursor-pointer">
                        False
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              )}

              {/* Fill in the Blank */}
              {currentQuestion.type === "fill_blank" && (
                <Input
                  placeholder="Type your answer here..."
                  value={answers[currentQuestion.id]?.toString() || ""}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  className="max-w-md"
                />
              )}

              <div className="flex items-center space-x-2 mt-4 text-sm text-gray-600">
                <span>Points: {currentQuestion.points}</span>
                {isAnswered(currentQuestion.id) && (
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Answered
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
            <span>Previous</span>
          </Button>

          <div className="flex items-center space-x-4">
            {!allQuestionsAnswered && (
              <div className="flex items-center space-x-2 text-sm text-amber-600">
                <AlertCircle className="h-4 w-4" />
                <span>Answer all questions to submit</span>
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
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Trophy className="h-4 w-4" />
                    <span>Submit Quiz</span>
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={currentQuestionIndex === totalQuestions - 1}
                className="flex items-center space-x-2"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
