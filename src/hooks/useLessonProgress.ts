import { useEffect, useState } from "react";
import {
	getUserLessonProgress,
	updateLessonProgress,
	updateUserCourseProgress,
} from "@/lib/strapi";
import { useAuthStore } from "@/stores/auth-store";

interface UseLessonProgressProps {
	documentIds: string[]; // Changed from lessonIds to documentIds
	documentId: string;
}

interface UseLessonProgressReturn {
	lessonProgress: Record<string, boolean>; // documentId -> isCompleted (changed from lessonId)
	isLoading: boolean;
	markLessonComplete: (documentId: string) => Promise<void>; // Changed parameter type
	refreshProgress: () => Promise<void>;
}

export function useLessonProgress({
	documentIds,
	documentId,
}: UseLessonProgressProps): UseLessonProgressReturn {
	const { user, jwt, isAuthenticated } = useAuthStore();
	const [lessonProgress, setLessonProgress] = useState<Record<string, boolean>>(
		{},
	);
	const [isLoading, setIsLoading] = useState(false);

	// Fetch initial progress
	useEffect(() => {
		const fetchProgress = async () => {
			if (!isAuthenticated || !jwt || !user || documentIds.length === 0) {
				setLessonProgress({});
				return;
			}

			setIsLoading(true);
			try {
				const progressData = await getUserLessonProgress(documentIds, jwt);

				const progressMap: Record<string, boolean> = {};
				progressData.forEach((progress) => {
					const parts = progress.user_plus_lesson_id.split("_");
					if (parts.length >= 2) {
						const userId = parts[0];
						const documentId = parts[1];

						if (userId === user.id.toString()) {
							progressMap[documentId] = progress.isCompleted;
						}
					}
				});

				setLessonProgress(progressMap);

				// Optional: update course status to "in_progress" when viewing
				await updateUserCourseProgress(documentId, user.id, "in_progress", jwt);
			} catch (error) {
				console.error("Failed to fetch progress:", error);
			} finally {
				setIsLoading(false);
			}
		};

		// Only re-fetch if auth state, user ID, or document IDs (values) change
		fetchProgress();
	}, [
		isAuthenticated,
		jwt,
		user?.id,
		JSON.stringify(documentIds.sort()), // Stable dep based on value
	]);

	const markLessonComplete = async (documentId: string) => {
		if (!isAuthenticated || !jwt || !user) {
			console.log("User not authenticated, cannot mark lesson as complete");
			return;
		}

		try {
			const currentStatus = lessonProgress[documentId] || false;
			const newStatus = !currentStatus;

			// Update local state immediately for better UX
			setLessonProgress((prev) => ({
				...prev,
				[documentId]: newStatus,
			}));

			// Update progress in backend
			await updateLessonProgress(documentId, user.id, newStatus, jwt);

			// Check if all lessons are completed and update course progress
			const updatedProgress = { ...lessonProgress, [documentId]: newStatus };
			const allCompleted = documentIds.every((id) => updatedProgress[id]);

			if (allCompleted) {
				await updateUserCourseProgress(
					documentId.toString(),
					user.id,
					"completed",
					jwt,
				);
			}

			console.log(
				`Document ${documentId} marked as ${newStatus ? "completed" : "incomplete"}`,
			);
		} catch (error) {
			console.error("Failed to update lesson progress:", error);
			// Revert local state on error
			setLessonProgress((prev) => ({
				...prev,
				[documentId]: !prev[documentId],
			}));
		}
	};

	const refreshProgress = async () => {
		if (!isAuthenticated || !jwt || !user || documentIds.length === 0) return;

		setIsLoading(true);
		try {
			const progressData = await getUserLessonProgress(documentIds, jwt);

			const progressMap: Record<string, boolean> = {};
			progressData.forEach((progress) => {
				// Extract document ID from composite ID (user_id_documentId)
				const parts = progress.user_plus_lesson_id.split("_");
				if (parts.length >= 2) {
					const userId = parts[0];
					const documentId = parts[1];

					// Only include progress for the current user
					if (userId === user.id) {
						progressMap[documentId] = progress.isCompleted;
					}
				}
			});

			console.log("Progress refreshed:", progressMap);
			setLessonProgress(progressMap);
		} catch (error) {
			console.error("Failed to refresh progress:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return {
		lessonProgress,
		isLoading,
		markLessonComplete,
		refreshProgress,
	};
}
