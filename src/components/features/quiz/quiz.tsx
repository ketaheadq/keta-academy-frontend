"use client";

import {
	AlertCircle,
	ArrowLeft,
	ArrowRight,
	CheckCircle,
	Clock,
	RotateCcw,
	Target,
	Trophy,
	XCircle,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import type { StrapiQuestion, StrapiQuiz } from "@/lib/strapi";
import { extractTextFromBlocks } from "@/lib/utils";

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
	quiz: StrapiQuiz;
	onComplete: (result: QuizResult) => void;
	onClose: () => void;
}

export default function Quiz({ quiz, onComplete, onClose }: Readonly<QuizProps>) {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answers, setAnswers] = useState<Record<number, string | boolean>>({});
	const [showResults, setShowResults] = useState(false);
	const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
	const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimit ? quiz.timeLimit * 60 : null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const currentQuestion = quiz.questions[currentQuestionIndex];
	const totalQuestions = quiz.questions.length;
	const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

	const handleAnswerChange = (questionId: number, answer: string | boolean) => {
		setAnswers((prev) => ({
			...prev,
			[questionId]: answer,
		}));
	};

	const handleNext = () => {
		if (currentQuestionIndex < totalQuestions - 1) {
			setCurrentQuestionIndex((prev) => prev + 1);
		}
	};

	const handlePrevious = () => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex((prev) => prev - 1);
		}
	};

	const calculateResults = (): QuizResult => {
		const attempts: QuizAttempt[] = [];
		let correctAnswers = 0;
		let earnedPoints = 0;
		let totalPoints = 0;

		quiz.questions.forEach((question: StrapiQuestion) => {
			const questionPoints = 10; // Default points if not specified
			totalPoints += questionPoints;
			const userAnswer = answers[question.id];
			let isCorrect = false;

			if (question.type === "multipleChoice") {
				const correctOption = question.options?.find((opt) => opt.isCorrect);
				isCorrect = userAnswer === correctOption?.text;
			} else if (question.type === "trueFalse") {
				// For true/false, compare boolean values
				const correctAnswer = question.options?.find((opt) => opt.isCorrect)?.text;
				isCorrect = userAnswer?.toString().toLowerCase() === correctAnswer?.toLowerCase();
			}

			if (isCorrect) {
				correctAnswers++;
				earnedPoints += questionPoints;
			}

			attempts.push({
				questionId: question.id,
				selectedAnswer: userAnswer,
				isCorrect,
				points: isCorrect ? questionPoints : 0,
			});
		});

		const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
		const passed = percentage >= (quiz.passingScore || 70);

		return {
			totalQuestions,
			correctAnswers,
			totalPoints,
			earnedPoints,
			percentage,
			passed,
			attempts,
		};
	};

	const handleSubmitQuiz = async () => {
		setIsSubmitting(true);

		// Simulate API call delay
		await new Promise((resolve) => setTimeout(resolve, 1000));

		const result = calculateResults();
		setQuizResult(result);
		setShowResults(true);
		setIsSubmitting(false);

		onComplete(result);
	};

	const handleRetakeQuiz = () => {
		setCurrentQuestionIndex(0);
		setAnswers({});
		setShowResults(false);
		setQuizResult(null);
		setTimeRemaining(quiz.timeLimit ? quiz.timeLimit * 60 : null);
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const isAnswered = (questionId: number) => {
		return answers[questionId] !== undefined;
	};

	const allQuestionsAnswered = quiz.questions.every((q) => isAnswered(q.id));

	if (showResults && quizResult) {
		return (
			<Card className="mx-auto w-full max-w-4xl">
				<CardHeader className="text-center">
					<div className="mb-4 flex justify-center">
						{quizResult.passed ? (
							<div className="rounded-full bg-primary/10 p-3">
								<Trophy className="h-8 w-8 text-primary" />
							</div>
						) : (
							<div className="rounded-full bg-destructive/10 p-3">
								<XCircle className="h-8 w-8 text-destructive" />
							</div>
						)}
					</div>
					<CardTitle className="text-2xl">
						{quizResult.passed ? "Tebrikler! 🎉" : "Tekrar Deneyin! 💪"}
					</CardTitle>
					<CardDescription>
						{quizResult.passed
							? "Quizi başarıyla tamamladınız!"
							: `Geçmek için %${quiz.passingScore || 70} gerekli. Puanınız %${quizResult.percentage.toFixed(1)}`}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Score Summary */}
					<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
						<div className="rounded-lg bg-primary/10 p-4 text-center">
							<div className="font-bold text-2xl text-primary">
								{quizResult.percentage.toFixed(1)}%
							</div>
							<div className="text-muted-foreground text-sm">Final Puan</div>
						</div>
						<div className="rounded-lg bg-primary/10 p-4 text-center">
							<div className="font-bold text-2xl text-primary">{quizResult.correctAnswers}</div>
							<div className="text-muted-foreground text-sm">Doğru</div>
						</div>
						<div className="rounded-lg bg-destructive/10 p-4 text-center">
							<div className="font-bold text-2xl text-destructive">
								{quizResult.totalQuestions - quizResult.correctAnswers}
							</div>
							<div className="text-muted-foreground text-sm">Yanlış</div>
						</div>
						<div className="rounded-lg bg-primary/10 p-4 text-center">
							<div className="font-bold text-2xl text-primary">
								{quizResult.earnedPoints}/{quizResult.totalPoints}
							</div>
							<div className="text-muted-foreground text-sm">Puan</div>
						</div>
					</div>

					{/* Question Review */}
					<div className="space-y-4">
						<h3 className="font-semibold text-lg">Soru İncelemesi</h3>
						{quiz.questions.map((question, index) => {
							const attempt = quizResult.attempts.find((a) => a.questionId === question.id);
							const questionText = extractTextFromBlocks(question.text);
							const explanationText = extractTextFromBlocks(question.explanation ?? []);

							return (
								<Card
									key={question.id}
									className={`border-l-4 ${attempt?.isCorrect ? "border-l-green-500" : "border-l-red-500"}`}
								>
									<CardContent className="p-4">
										<div className="flex items-start space-x-3">
											<div className="mt-1 shrink-0">
												{attempt?.isCorrect ? (
													<CheckCircle className="h-5 w-5 text-primary" />
												) : (
													<XCircle className="h-5 w-5 text-destructive" />
												)}
											</div>
											<div className="flex-1">
												<p className="mb-2 font-medium text-foreground">
													{index + 1}. {questionText}
												</p>
												<div className="space-y-2 text-sm">
													<div>
														<span className="text-muted-foreground">Cevabınız: </span>
														<span
															className={
																attempt?.isCorrect
																	? "font-medium text-primary"
																	: "font-medium text-destructive"
															}
														>
															{attempt?.selectedAnswer?.toString()}
														</span>
													</div>
													{!attempt?.isCorrect && (
														<div>
															<span className="text-muted-foreground">Doğru cevap: </span>
															<span className="font-medium text-primary">
																{question.options?.find((opt) => opt.isCorrect)?.text}
															</span>
														</div>
													)}
													{explanationText && (
														<div className="mt-2 rounded bg-primary/10 p-2 text-primary">
															<strong>Açıklama:</strong> {explanationText}
														</div>
													)}
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							);
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
		);
	}

	return (
		<Card className="mx-auto w-full max-w-4xl">
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
							<div className="flex items-center space-x-2 text-muted-foreground text-sm">
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
							<h3 className="mb-4 font-medium text-foreground text-lg">
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
											.toSorted((a, b) => (a.order || 0) - (b.order || 0))
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
											.toSorted((a, b) => (a.order || 0) - (b.order || 0))
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

							<div className="mt-4 flex items-center space-x-2 text-muted-foreground text-sm">
								<span>Puan: 1</span>
								{isAnswered(currentQuestion.id) && (
									<Badge variant="secondary" className="text-xs">
										<CheckCircle className="mr-1 h-3 w-3" />
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
							<div className="flex items-center space-x-2 text-accent text-sm">
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
										<div className="h-4 w-4 animate-spin rounded-full border-white border-b-2" />
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
	);
}
