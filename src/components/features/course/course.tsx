"use client";

import { BookOpen, CheckCircle, Circle, Clock, GraduationCap, Target } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Quiz from "@/components/features/quiz/quiz";
import RichTextRenderer from "@/components/shared/content/rich-text-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import ShareButton from "@/components/ui/share-button";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import type { StrapiCourse, StrapiGrade, StrapiLesson, StrapiQuiz } from "@/lib/strapi";
import { submitQuiz } from "@/lib/strapi";
import { extractYouTubeVideoId } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import LessonVideo from "./lesson-video";

// Extended lesson interface for mock data with additional properties
interface ExtendedLesson extends StrapiLesson {
	duration: number;
	order: number;
	youtubeVideoId: string | null;
}

interface CoursePageProps {
	course: StrapiCourse;
	lessons: StrapiLesson[];
	ders_ismi?: string;
	searchParams?: { ders_ismi?: string };
}

export default function CoursePage({
	course,
	lessons,
	ders_ismi,
	searchParams,
}: Readonly<CoursePageProps>) {
	const router = useRouter();
	const pathname = usePathname();
	const { user, jwt, isAuthenticated } = useAuthStore();

	// Convert StrapiLesson to ExtendedLesson format for compatibility
	const [extendedLessons, setExtendedLessons] = useState<ExtendedLesson[]>([]);

	// Use the custom hook for progress management
	const {
		lessonProgress,
		isLoading: isLoadingProgress,
		markLessonComplete,
	} = useLessonProgress(lessons.map(lesson => lesson.documentId));

	useEffect(() => {
		const initialLessons: ExtendedLesson[] = lessons.map((lesson, index) => ({
			...lesson,
			duration: 30, // Default duration, should come from Strapi
			order: index + 1,
			youtubeVideoId: lesson.videoURL ? extractYouTubeVideoId(lesson.videoURL) : null,
		}));
		setExtendedLessons(initialLessons);
	}, [lessons]);

	const [initialLesson, setInitialLesson] = useState<ExtendedLesson | null>(null);

	useEffect(() => {
		if (extendedLessons.length > 0) {
			const targetSlug = searchParams?.ders_ismi || ders_ismi;

			const targetLesson = targetSlug
				? extendedLessons.find((lesson) => lesson.slug === targetSlug)
				: null;

			const lessonToSet = targetLesson || extendedLessons[0];
			setInitialLesson(lessonToSet);
		}
	}, [extendedLessons, searchParams?.ders_ismi, ders_ismi]);

	const [currentLesson, setCurrentLesson] = useState<ExtendedLesson | null>(null);
	const [showQuiz, setShowQuiz] = useState(false);
	const [currentQuiz, setCurrentQuiz] = useState<StrapiQuiz | null>(null);

	// Update current lesson when initial lesson changes
	useEffect(() => {
		if (initialLesson && (!currentLesson || initialLesson.id !== currentLesson.id)) {
			setCurrentLesson(initialLesson);
		}
	}, [initialLesson, currentLesson]);

	const completedLessons = extendedLessons.filter(
		(lesson) => lessonProgress[lesson.documentId],
	).length;
	const totalLessons = extendedLessons.length;

	const formatDuration = (minutes: number) => {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		if (hours > 0) {
			return `${hours}h ${mins}m`;
		}
		return `${mins}m`;
	};

	const getCurrentLessonUrl = () => {
		if (globalThis.window !== undefined) {
			return `${globalThis.window.location.origin}${pathname}?ders_ismi=${currentLesson?.slug}`;
		}
		return "";
	};

	const handleLessonSelect = (lesson: ExtendedLesson) => {
		setCurrentLesson(lesson);
		// Update URL with current lesson
		router.push(`${pathname}?ders_ismi=${lesson.slug}`, { scroll: false });
	};

	const handleNextLesson = () => {
		const currentIndex = extendedLessons.findIndex((lesson) => lesson.id === currentLesson?.id);
		if (currentIndex < extendedLessons.length - 1) {
			const nextLesson = extendedLessons[currentIndex + 1];
			setCurrentLesson(nextLesson);
			// Update URL with next lesson
			router.push(`${pathname}?ders_ismi=${nextLesson.slug}`, {
				scroll: false,
			});
		}
	};

	const handlePreviousLesson = () => {
		const currentIndex = extendedLessons.findIndex((lesson) => lesson.id === currentLesson?.id);
		if (currentIndex > 0) {
			const prevLesson = extendedLessons[currentIndex - 1];
			setCurrentLesson(prevLesson);
			// Update URL with previous lesson
			router.push(`${pathname}?ders_ismi=${prevLesson.slug}`, {
				scroll: false,
			});
		}
	};

	const handleStartQuiz = (quiz: StrapiQuiz) => {
		if (!jwt) {
			router.push('/giris');
			return;
		}
		setCurrentQuiz(quiz);
		setShowQuiz(true);
	};

	const handleCloseQuiz = () => {
		setShowQuiz(false);
		setCurrentQuiz(null);
	};

	// Show loading state while lessons are being initialized
	if (extendedLessons.length === 0 || !currentLesson) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-secondary">
				<div className="text-center">
					<div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-primary border-b-2" />
					<p className="text-muted-foreground">Kurs yükleniyor...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-secondary">
			<div className="mx-auto px-4 py-6 sm:px-6 lg:px-8">
				{/* Show authentication notice if not logged in */}
				{!isAuthenticated && (
					<div className="mb-6 rounded-lg border border-primary bg-primary/10 p-4">
						<p className="text-primary text-sm">
							<strong>Not:</strong> İlerlemenizi kaydetmek için{" "}
							<Link href="/giris" className="underline">
								giriş yapın
							</Link>
							.
						</p>
					</div>
				)}

				<div className="grid gap-6 lg:grid-cols-3">
					{/* Main Content - Video Player */}
					<div className="space-y-6 lg:col-span-2">
						{/* Video Player */}
						<Card className="py-0">
							<CardContent className="p-0">
								{currentLesson.youtubeVideoId && (
									<LessonVideo
										key={currentLesson.documentId}
										videoId={currentLesson.youtubeVideoId}
										title={currentLesson.title}
										onEnded={() => {
											if (isAuthenticated && !lessonProgress[currentLesson.documentId]) {
												void markLessonComplete(currentLesson.documentId);
											}
										}}
									/>
								)}
								<div className="p-6">
									<div className="mb-4 flex items-center justify-between">
										<div>
											<h1 className="mb-2 font-bold text-2xl text-foreground">
												{currentLesson.title}
											</h1>
											<p className="text-muted-foreground">{currentLesson.description}</p>
										</div>
										<div className="flex items-center space-x-2">
											<Clock className="h-4 w-4 text-muted-foreground" />
											<span className="text-muted-foreground text-sm">
												{formatDuration(currentLesson.duration)}
											</span>
										</div>
									</div>

									{currentLesson.content?.length ? <RichTextRenderer content={currentLesson.content} /> : null}
									{currentLesson.attachments?.map(attachment => (
										<a key={attachment.id} href={attachment.url} target="_blank" rel="noreferrer" className="block py-2 underline">
											{attachment.name}
										</a>
									))}
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-4">
											<Button
												variant="outline"
												onClick={handlePreviousLesson}
												disabled={
													extendedLessons.findIndex((l) => l.id === currentLesson?.id) === 0
												}
											>
												Önceki
											</Button>
											<Button
												variant="outline"
												onClick={handleNextLesson}
												disabled={
													extendedLessons.findIndex((l) => l.id === currentLesson?.id) ===
													extendedLessons.length - 1
												}
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
											{user ? (
												<Button
													variant={
														lessonProgress[currentLesson.documentId] ? "secondary" : "default"
													}
													onClick={
														lessonProgress[currentLesson.documentId]
															? () => {}
															: () => markLessonComplete(currentLesson.documentId)
													}
													className="flex items-center space-x-2"
													disabled={!isAuthenticated}
												>
													{lessonProgress[currentLesson.documentId] ? (
														<CheckCircle className="h-4 w-4" />
													) : (
														<Circle className="h-4 w-4" />
													)}
													<span>
														{lessonProgress[currentLesson.documentId]
															? "Tamamlandı"
															: "Tamamlandı İşaretle"}
													</span>
												</Button>
											) : (
												<Button
													variant="outline"
													onClick={() => router.push("/giris")}
													className="flex items-center space-x-2"
												>
													Giriş Yap
												</Button>
											)}

											{currentLesson.quiz?.questions?.length ? (
												<Button
													variant="outline"
													onClick={() => handleStartQuiz(currentLesson.quiz as StrapiQuiz)}
													className="flex items-center space-x-2"
												>
													<Target className="h-4 w-4" />
													<span>Quiz Çöz</span>
												</Button>
											) : null}
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
								<div className="grid gap-6 md:grid-cols-2">
									<div>
										<h3 className="mb-2 font-semibold text-foreground">Kurs Açıklaması</h3>
										<p className="mb-4 text-muted-foreground">{course.description}</p>

										<div className="space-y-2">
											<div className="flex items-center space-x-2">
												<Target className="h-4 w-4 text-muted-foreground" />
												<span className="text-muted-foreground text-sm">
													Konu: {course.subject.title}
												</span>
											</div>
											<div className="flex items-center space-x-2">
												<GraduationCap className="h-4 w-4 text-muted-foreground" />
												<span className="text-muted-foreground text-sm">
													Sınıf: {course.grades.map((g: StrapiGrade) => g.title).join(", ")}
												</span>
											</div>
											<div className="flex items-center space-x-2">
												<Clock className="h-4 w-4 text-muted-foreground" />
												<span className="text-muted-foreground text-sm">
													Toplam Süre: {formatDuration(course.duration)}
												</span>
											</div>
											<div className="flex items-center space-x-2">
												<BookOpen className="h-4 w-4 text-muted-foreground" />
												<span className="text-muted-foreground text-sm">{totalLessons} Ders</span>
											</div>
										</div>
									</div>

									<div>
										<Image
											src={course.thumbnail.url || "/placeholder.svg"}
											alt={course.thumbnail.alternativeText || course.title}
											width={course.thumbnail.width}
											height={course.thumbnail.height}
											className="h-48 w-full rounded-lg object-cover"
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
									{isLoadingProgress && <span className="ml-2 text-primary">(Yükleniyor...)</span>}
								</CardDescription>
							</CardHeader>
							<CardContent className="p-0">
								<ScrollArea className="h-96">
									<div className="space-y-2 p-4">
										{extendedLessons.map((lesson, index) => (
											<div key={lesson.documentId}>
												<button
													type="button"
													className={`w-full cursor-pointer rounded-lg p-3 transition-colors ${
														currentLesson?.id === lesson.id
															? "border-2 border-primary bg-primary/10"
															: "border-2 border-transparent hover:bg-secondary"
													}`}
													onClick={() => handleLessonSelect(lesson)}
												>
													<div className="flex items-start space-x-3">
														<div className="mt-1 shrink-0">
															{lessonProgress[lesson.documentId] ? (
																<CheckCircle className="h-5 w-5 text-primary" />
															) : (
																<Circle className="h-5 w-5 text-muted-foreground" />
															)}
														</div>
														<div className="min-w-0 flex-1">
															<div className="flex items-center justify-between">
																<p className="truncate font-medium text-foreground text-sm">
																	{lesson.order}. {lesson.title}
																</p>
																<div className="flex items-center space-x-1 text-muted-foreground text-xs">
																	<Clock className="h-3 w-3" />
																	<span>{formatDuration(lesson.duration)}</span>
																</div>
															</div>
															<p className="mt-1 line-clamp-2 text-muted-foreground text-xs">
																{lesson.description}
															</p>
														</div>
													</div>
												</button>
												{lesson.quiz && (
													<Badge variant="outline" className="ml-2 text-xs">
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
				{showQuiz && currentQuiz && jwt && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
						<div className="max-h-[90vh] overflow-y-auto">
							<Quiz quiz={currentQuiz} onSubmit={(answers, submissionId) => submitQuiz(currentQuiz.documentId, answers, submissionId, jwt)} onClose={handleCloseQuiz} />
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
