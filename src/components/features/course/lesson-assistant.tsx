"use client";

import { Play } from "lucide-react";
import { type FormEvent, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface RecommendedVideo {
	lessonId: string;
	title: string;
	videoId: string;
	reason: string;
	learningOutcomes: string[];
}

interface LessonAnswer {
	answer: string;
	recommendations: RecommendedVideo[];
}

function isRecommendedVideo(value: unknown): value is RecommendedVideo {
	if (!value || typeof value !== "object") return false;
	const video = value as Partial<RecommendedVideo>;
	return (
		typeof video.lessonId === "string" &&
		typeof video.title === "string" &&
		typeof video.videoId === "string" &&
		/^[\w-]{11}$/.test(video.videoId) &&
		typeof video.reason === "string" &&
		Array.isArray(video.learningOutcomes) &&
		video.learningOutcomes.every((outcome) => typeof outcome === "string")
	);
}

export default function LessonAssistant({
	lessonId,
	onPlaybackChange,
}: Readonly<{ lessonId: string; onPlaybackChange: (playing: boolean) => void }>) {
	const inputId = useId();
	const dialogTitleId = useId();
	const dialog = useRef<HTMLDialogElement>(null);
	const [question, setQuestion] = useState("");
	const [answer, setAnswer] = useState<LessonAnswer | null>(null);
	const [activeVideo, setActiveVideo] = useState<RecommendedVideo | null>(null);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function ask(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const text = question.trim();
		if (!text || loading) return;
		setLoading(true);
		setAnswer(null);
		setError("");
		try {
			const response = await fetch("/api/lesson-assistant", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ lessonId, question: text }),
				signal: AbortSignal.timeout(60_000),
			});
			if (!response.ok) throw new Error("Lesson assistant request failed");
			const result = (await response.json()) as Partial<LessonAnswer>;
			if (typeof result.answer !== "string" || !Array.isArray(result.recommendations)) {
				throw new Error("Invalid lesson assistant response");
			}
			setAnswer({
				answer: result.answer,
				recommendations: result.recommendations.filter(isRecommendedVideo),
			});
		} catch {
			setError("Şu anda yanıt alınamadı. Biraz sonra tekrar deneyebilirsin.");
		} finally {
			setLoading(false);
		}
	}

	function openVideo(video: RecommendedVideo) {
		const playerDialog = dialog.current;
		if (!playerDialog) return;
		playerDialog.showModal();
		setActiveVideo(video);
		onPlaybackChange(true);
	}

	return (
		<section className="border-b p-4 sm:p-6">
			<p className="mb-3 text-sm text-muted-foreground">Yerel geliştirici önizlemesi · Gemini</p>
			<form onSubmit={ask} className="space-y-3">
				<label htmlFor={inputId} className="block font-semibold text-foreground">
					Anlamadığın yeri sor
				</label>
				<textarea
					id={inputId}
					className="min-h-20 w-full rounded-md border bg-background p-3 text-sm focus-visible:ring-2 focus-visible:ring-ring"
					placeholder="Bu derste takıldığın noktayı yaz."
					value={question}
					onChange={(event) => setQuestion(event.target.value)}
					maxLength={500}
					required
				/>
				<Button type="submit" disabled={loading || !question.trim()}>
					Sor
				</Button>
				{loading && <p role="status">Yanıt hazırlanıyor…</p>}
				{error && <p role="alert">{error}</p>}
			</form>
			{answer && (
				<div aria-live="polite" className="mt-5 space-y-4">
					<p className="whitespace-pre-wrap text-sm">{answer.answer}</p>
					{answer.recommendations.length > 0 && (
						<>
							<h2 className="font-semibold">Bu konuyu şu videolarla pekiştirebilirsin</h2>
							<ul className="space-y-3">
								{answer.recommendations.map((video) => (
									<li key={video.lessonId} className="space-y-2 rounded-lg border p-4 text-sm">
										<h3 className="font-semibold">{video.title}</h3>
										<p><strong>Neden bu video?</strong> {video.reason}</p>
										{video.learningOutcomes.length > 0 && (
											<div>
												<p className="font-semibold">Neler öğrenirsin?</p>
												<ul className="list-disc pl-5">
													{video.learningOutcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}
												</ul>
											</div>
										)}
										<Button type="button" variant="outline" onClick={() => openVideo(video)}>
											<Play aria-hidden="true" /> Videoyu izle
										</Button>
									</li>
								))}
							</ul>
						</>
					)}
				</div>
			)}
			<dialog
				ref={dialog}
				aria-labelledby={dialogTitleId}
				className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-3xl rounded-xl bg-background p-4 text-foreground shadow-xl backdrop:bg-black/65 sm:p-6"
				onClose={() => {
					setActiveVideo(null);
					onPlaybackChange(false);
				}}
			>
				<div className="mb-4 flex items-center justify-between gap-3">
					<h2 id={dialogTitleId} className="font-semibold">{activeVideo?.title}</h2>
					<Button type="button" variant="outline" onClick={() => dialog.current?.close()}>
						Geri dön
					</Button>
				</div>
				{activeVideo && (
					<iframe
						className="aspect-video w-full rounded-lg bg-black"
						src={`https://www.youtube-nocookie.com/embed/${activeVideo.videoId}?autoplay=1&playsinline=1`}
						title={activeVideo.title}
						allow="autoplay; encrypted-media; picture-in-picture"
						allowFullScreen
					/>
				)}
			</dialog>
		</section>
	);
}
