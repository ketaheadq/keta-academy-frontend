import { useCallback, useEffect, useState } from "react";
import { getUserLessonProgress, updateLessonProgress } from "@/lib/strapi";
import { useAuthStore } from "@/stores/auth-store";

export function useLessonProgress(documentIds: string[]) {
	const { jwt } = useAuthStore();
	const [lessonProgress, setLessonProgress] = useState<Record<string, boolean>>({});
	const [isLoading, setIsLoading] = useState(false);
	const lessonIds = JSON.stringify(documentIds);

	useEffect(() => {
		let active = true;
		setLessonProgress({});
		setIsLoading(Boolean(jwt));
		if (jwt) {
			getUserLessonProgress(JSON.parse(lessonIds), jwt)
				.then(rows => {
					if (active) setLessonProgress(Object.fromEntries(rows.map(row => [row.documentId, row.isCompleted])));
				})
				.catch(error => console.error("Could not load lesson progress", error))
				.finally(() => { if (active) setIsLoading(false); });
		}
		return () => { active = false; };
	}, [jwt, lessonIds]);

	const markLessonComplete = useCallback(async (documentId: string) => {
		if (!jwt) return;
		try {
			const row = await updateLessonProgress(documentId, true, jwt);
			if (useAuthStore.getState().jwt === jwt) {
				setLessonProgress(previous => ({ ...previous, [row.documentId]: row.isCompleted }));
			}
		} catch (error) {
			console.error("Could not save lesson progress", error);
		}
	}, [jwt]);

	return { lessonProgress, isLoading, markLessonComplete };
}
