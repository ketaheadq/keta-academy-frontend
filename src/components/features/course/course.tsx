"use client";

import { BookOpen, CheckCircle, Circle, Clock, GraduationCap, Target } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Quiz from "@/components/features/quiz/quiz";
import RichTextRenderer from "@/components/shared/content/rich-text-renderer";
import { DetailLoadingSkeleton } from "@/components/shared/loading-skeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import ShareButton from "@/components/ui/share-button";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { DURATION, EASE_IN, EASE_OUT } from "@/lib/motion";
import type { StrapiCourse, StrapiGrade, StrapiLesson, StrapiQuiz } from "@/lib/strapi";
import { startCourse, submitQuiz } from "@/lib/strapi";
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
	/** Lesson documentId → a mock exam that covers the lesson's topic. */
	miniDenemeler?: Record<string, { baslik: string; slug: string }>;
}

export default function CoursePage({
	course,
	lessons,
	ders_ismi,
	searchParams,
	miniDenemeler = {},
}: Readonly<CoursePageProps>) {
	const router = useRouter();
	const pathname = usePathname();
	const { user, jwt, isAuthenticated } = useAuthStore();

	// Opening a course while signed in counts as starting it (shows up in /derslerim).
	useEffect(() => {
		if (!jwt) return;
		startCourse(course.documentId, jwt).catch((error) =>
			console.error("Could not mark course as started", error),
		);
	}, [jwt, course.documentId]);

	// Convert StrapiLesson to ExtendedLesson format for compatibility
	const [extendedLessons, setExtendedLessons] = useState<ExtendedLesson[]>([]);

	// Use the custom hook for progress management
	const {
		lessonProgress,
		isLoading: isLoadingProgress,
		markLessonComplete,
	} = useLessonProgress(lessons.map((lesson) => lesson.documentId));

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
		if (initialLesson && initialLesson.id !== currentLesson?.id) {
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
			router.push("/giris");
			return;
		}
		setCurrentQuiz(quiz);
		setShowQuiz(true);
	};

	const handleCloseQuiz = () => {
		setShowQuiz(false);
		setCurrentQuiz(null);
	};

	if (extendedLessons.length === 0 || !currentLesson) {
		return <DetailLoadingSkeleton showBreadcrumb={false} />;
	}

	return (
		<div className="bg-secondary min-h-screen">
			<div className="mx-auto px-4 py-6 sm:px-6 lg:px-8">
				{/* Show authentication notice if not logged in */}
				{!isAuthenticated && (
					<div className="border-primary bg-primary/10 mb-6 rounded-lg border p-4">
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
					{/* min-w-0: grid items default to min-width:auto, so wide content pushed the page past the viewport on mobile */}
					<div className="min-w-0 space-y-6 lg:col-span-2">
						<AnimatePresence mode="wait" initial={false}>
							<m.div
								key={currentLesson.documentId}
								initial={{ opacity: 0, x: 12 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -8 }}
								transition={{ duration: DURATION.base, ease: EASE_OUT }}
							>
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
										<div className="p-4 sm:p-6">
											<div className="mb-4">
												<h1 className="text-foreground mb-2 text-xl font-bold wrap-break-word sm:text-2xl">
													{currentLesson.title}
												</h1>
												<p className="text-muted-foreground">{currentLesson.description}</p>
											</div>

											{currentLesson.content?.length ? (
												<RichTextRenderer content={currentLesson.content} />
											) : null}
											{miniDenemeler[currentLesson.documentId] && (
												<Link
													href={`/deneme-sinavlari/${miniDenemeler[currentLesson.documentId].slug}`}
													className="border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 mt-4 flex items-center gap-2 rounded-xl border p-3 font-medium"
												>
													<Target className="h-4 w-4 shrink-0" aria-hidden="true" />
													Bu konunun mini denemesini çöz:{" "}
													{miniDenemeler[currentLesson.documentId].baslik}
												</Link>
											)}
											{currentLesson.attachments?.map((attachment) => (
												<a
													key={attachment.id}
													href={attachment.url}
													target="_blank"
													rel="noreferrer"
													className="block py-2 break-all underline"
												>
													{attachment.name}
												</a>
											))}
											<div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
												<div className="flex items-center gap-2">
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

												<div className="flex flex-wrap items-center gap-2">
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
							</m.div>
						</AnimatePresence>

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
										<h2 className="text-foreground mb-2 font-semibold">Kurs Açıklaması</h2>
										<p className="text-muted-foreground mb-4">{course.description}</p>

										<div className="space-y-2">
											<div className="flex items-center space-x-2">
												<Target className="text-muted-foreground h-4 w-4" />
												<span className="text-muted-foreground text-sm">
													Konu: {course.subject.title}
												</span>
											</div>
											<div className="flex items-center space-x-2">
												<GraduationCap className="text-muted-foreground h-4 w-4" />
												<span className="text-muted-foreground text-sm">
													Sınıf: {course.grades.map((g: StrapiGrade) => g.title).join(", ")}
												</span>
											</div>
											<div className="flex items-center space-x-2">
												<Clock className="text-muted-foreground h-4 w-4" />
												<span className="text-muted-foreground text-sm">
													Toplam Süre: {formatDuration(course.duration)}
												</span>
											</div>
											<div className="flex items-center space-x-2">
												<BookOpen className="text-muted-foreground h-4 w-4" />
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
					<div className="min-w-0 lg:col-span-1">
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
									{isLoadingProgress && <span className="text-primary ml-2">(Yükleniyor...)</span>}
								</CardDescription>
							</CardHeader>
							<CardContent className="p-0">
								{/* Radix wraps the content in a `display: table` div that grows with the longest
								    line, which disables truncate/line-clamp; force it back to a normal block. */}
								<ScrollArea className="h-96 [&_[data-slot=scroll-area-viewport]>div]:block!">
									<div className="space-y-2 p-4">
										{extendedLessons.map((lesson, index) => (
											<div key={lesson.documentId}>
												<button
													type="button"
													className={`w-full cursor-pointer rounded-lg p-3 text-left transition-colors ${
														currentLesson?.id === lesson.id
															? "border-primary bg-primary/10 border-2"
															: "hover:bg-secondary border-2 border-transparent"
													}`}
													onClick={() => handleLessonSelect(lesson)}
												>
													<div className="flex items-start space-x-3">
														<div className="mt-1 shrink-0">
															{lessonProgress[lesson.documentId] ? (
																<CheckCircle className="text-primary h-5 w-5" />
															) : (
																<Circle className="text-muted-foreground h-5 w-5" />
															)}
														</div>
														<div className="min-w-0 flex-1">
															<div className="flex items-center justify-between gap-2">
																<p
																	className="text-foreground min-w-0 flex-1 truncate text-sm font-medium"
																	title={`${lesson.order}. ${lesson.title}`}
																>
																	{lesson.order}. {lesson.title}
																</p>
															</div>
															<p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
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
				<AnimatePresence>
					{showQuiz && currentQuiz && jwt && (
						<m.div
							className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: DURATION.fast, ease: EASE_IN }}
						>
							<m.div
								className="max-h-[90vh] overflow-y-auto"
								initial={{ opacity: 0, scale: 0.97, y: 12 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								transition={{ duration: DURATION.base, ease: EASE_OUT }}
							>
								<Quiz
									quiz={currentQuiz}
									onSubmit={(answers, submissionId) =>
										submitQuiz(currentQuiz.documentId, answers, submissionId, jwt)
									}
									onClose={handleCloseQuiz}
								/>
							</m.div>
						</m.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
