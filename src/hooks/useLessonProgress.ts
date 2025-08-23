import { useCallback, useEffect, useRef, useState } from "react";
import {
	getUserLessonProgress,
	updateLessonProgress,
	updateUserCourseProgress,
} from "@/lib/strapi";
import { useAuthStore } from "@/stores/auth-store";

interface UseLessonProgressProps {
	documentIds: string[];
	documentId: string;
}

interface UseLessonProgressReturn {
	lessonProgress: Record<string, boolean>;
	isLoading: boolean;
	markLessonComplete: (documentId: string) => Promise<void>;
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
	const prevDependencies = useRef<string | null>(null);

	// Create a stable dependency string
	const dependencies = JSON.stringify([
		isAuthenticated,
		jwt,
		user?.id,
		documentIds
			.slice()
			.sort(), // Create a copy before sorting
	]);

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
						const docId = parts[1];

						if (userId === user?.id?.toString()) {
							progressMap[docId] = progress.isCompleted;
						}
					}
				});

				setLessonProgress(progressMap);

				// Update course status to "in_progress" when viewing
				try {
					if (user?.id) {
						await updateUserCourseProgress(
							documentId,
							user.id,
							"in_progress",
							jwt,
						);
					}
				} catch (courseError) {
					console.warn("Failed to update course progress:", courseError);
				}
			} catch (error) {
				console.error("Failed to fetch progress:", error);
				setLessonProgress({});
			} finally {
				setIsLoading(false);
			}
		};

		// Only re-fetch if dependencies have actually changed
		if (prevDependencies.current !== dependencies) {
			prevDependencies.current = dependencies;
			fetchProgress();
		}
	}, [dependencies, documentId, documentIds, isAuthenticated, jwt, user]); // Added all missing dependencies

	const markLessonComplete = useCallback(
		async (docId: string) => {
			if (!isAuthenticated || !jwt || !user) {
				console.log("User not authenticated, cannot mark lesson as complete");
				return;
			}

			try {
				const currentStatus = lessonProgress[docId] || false;
				const newStatus = !currentStatus;

				// Update local state immediately for better UX
				setLessonProgress((prev) => ({
					...prev,
					[docId]: newStatus,
				}));

				// Update progress in backend
				if (user?.id) {
					await updateLessonProgress(docId, user.id, newStatus, jwt);
				}

				// Check if all lessons are completed and update course progress
				const updatedProgress = { ...lessonProgress, [docId]: newStatus };
				const allCompleted = documentIds.every((id) => updatedProgress[id]);

				if (allCompleted) {
					try {
						if (user?.id) {
							await updateUserCourseProgress(
								documentId,
								user.id,
								"completed",
								jwt,
							);
						}
					} catch (courseError) {
						console.warn(
							"Failed to update course completion status:",
							courseError,
						);
					}
				}

				console.log(
					`Document ${docId} marked as ${newStatus ? "completed" : "incomplete"}`,
				);
			} catch (error) {
				console.error("Failed to update lesson progress:", error);
				// Revert local state on error
				setLessonProgress((prev) => ({
					...prev,
					[docId]: !prev[docId],
				}));
			}
		},
		[isAuthenticated, jwt, user, lessonProgress, documentIds, documentId],
	);

	const refreshProgress = useCallback(async () => {
		if (!isAuthenticated || !jwt || !user || documentIds.length === 0) {
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
					const docId = parts[1];

					if (userId === user?.id?.toString()) {
						progressMap[docId] = progress.isCompleted;
					}
				}
			});

			console.log("Progress refreshed:", progressMap);
			setLessonProgress(progressMap);
		} catch (error) {
			console.error("Failed to refresh progress:", error);
			setLessonProgress({});
		} finally {
			setIsLoading(false);
		}
	}, [isAuthenticated, jwt, user, documentIds]);

	return {
		lessonProgress,
		isLoading,
		markLessonComplete,
		refreshProgress,
	};
}
