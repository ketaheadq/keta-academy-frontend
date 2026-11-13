import { getCourse, getLessonsByCourseId } from "@/lib/strapi";
import { extractYouTubeVideoId } from "@/lib/utils";

export async function POST(request: Request) {
	if (process.env.LESSON_ASSISTANT_PREVIEW !== "1") {
		return new Response(null, { status: 404 });
	}

	const body: unknown = await request.json().catch(() => null);
	if (
		!body ||
		typeof body !== "object" ||
		!("question" in body) ||
		typeof body.question !== "string" ||
		!body.question.trim() ||
		body.question.length > 500 ||
		!("lessonId" in body) ||
		typeof body.lessonId !== "string"
	) {
		return new Response(null, { status: 400 });
	}

	try {
		const course = await getCourse("demo-kesirler");
		if (!course) return new Response(null, { status: 404 });

		const lessons = await getLessonsByCourseId(course.id);
		const source = lessons.find(({ lesson }) => lesson?.documentId === body.lessonId)?.lesson;
		const sourceVideoId = source?.videoURL && extractYouTubeVideoId(source.videoURL);
		if (!sourceVideoId || !/^[\w-]{11}$/.test(sourceVideoId)) {
			return new Response(null, { status: 404 });
		}

		const key = process.env.GEMINI_API_KEY;
		if (!key) return new Response(null, { status: 503 });

		const catalog = lessons.flatMap(({ lesson }) => {
			const videoId = lesson?.videoURL && extractYouTubeVideoId(lesson.videoURL);
			if (!videoId || !/^[\w-]{11}$/.test(videoId) || videoId === sourceVideoId) return [];
			return [{ lessonId: lesson.documentId, title: lesson.title, description: lesson.description, videoId }];
		});
		const response = await fetch(
			"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent",
			{
				method: "POST",
				headers: { "Content-Type": "application/json", "x-goog-api-key": key },
				signal: AbortSignal.timeout(45_000),
				body: JSON.stringify({
					systemInstruction: {
						parts: [{ text: "Bu bir KetaLearn geliştirici önizlemesidir. Soruyu verilen videonun konuşmasına ve içeriğine dayanarak Türkçe yanıtla. Ders dışıysa kısaca belirt. Yalnızca verilen katalogdan gerçekten ilgili en fazla üç ders kimliği öner. Uygun aday yoksa boş dizi döndür. URL üretme." }],
					},
					contents: [{ parts: [
						{ fileData: { fileUri: "https://www.youtube.com/watch?v=" + sourceVideoId } },
						{ text: JSON.stringify({ question: body.question.trim(), catalog: catalog.map(({ lessonId, title, description }) => ({ lessonId, title, description })) }) },
					] }],
					generationConfig: {
						responseMimeType: "application/json",
						responseSchema: {
							type: "OBJECT",
							required: ["answer", "recommendations"],
							properties: {
								answer: { type: "STRING" },
								recommendations: {
									type: "ARRAY",
									items: {
										type: "OBJECT",
										required: ["lessonId", "reason", "learningOutcomes"],
										properties: {
											lessonId: { type: "STRING" },
											reason: { type: "STRING" },
											learningOutcomes: { type: "ARRAY", items: { type: "STRING" } },
										},
									},
								},
							},
						},
					},
				}),
			},
		);
		if (!response.ok) return new Response(null, { status: 502 });

		const data = (await response.json()) as {
			candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] } }[];
		};
		const content = data.candidates?.[0]?.content?.parts?.filter((part) => !part.thought)
			.map((part) => part.text ?? "").join("");
		const result = JSON.parse(content ?? "") as {
			answer?: string;
			recommendations?: { lessonId: string; reason: string; learningOutcomes: string[] }[];
		};
		if (typeof result.answer !== "string" || !Array.isArray(result.recommendations)) {
			return new Response(null, { status: 502 });
		}
		const seen = new Set<string>();
		const recommendations = result.recommendations.flatMap((item) => {
			const video = catalog.find(({ lessonId }) => lessonId === item?.lessonId);
			if (!video || seen.has(video.lessonId) || typeof item.reason !== "string" ||
				!Array.isArray(item.learningOutcomes) ||
				!item.learningOutcomes.every((outcome) => typeof outcome === "string")) return [];
			seen.add(video.lessonId);
			return [{ lessonId: video.lessonId, title: video.title, videoId: video.videoId,
				reason: item.reason, learningOutcomes: item.learningOutcomes }];
		}).slice(0, 3);

		return Response.json({ answer: result.answer, recommendations });
	} catch {
		return new Response(null, { status: 503 });
	}
}
