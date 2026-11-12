"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { calculateCourseProgressById } from "@/lib/progress-utils";
import { getAllCourseLessons, getUserLessonProgress } from "@/lib/strapi";
import { useJWT } from "@/stores/auth-store";

type ProgressSnapshot = { jwt: string; byCourseId: Map<number, number> };
const CourseProgressContext = createContext<Map<number, number> | null>(null);

export function CourseProgressProvider({ children }: Readonly<{ children: React.ReactNode }>) {
	const jwt = useJWT();
	const pathname = usePathname();
	const [snapshot, setSnapshot] = useState<ProgressSnapshot | null>(null);

	useEffect(() => {
		if (!jwt) {
			setSnapshot(null);
			return;
		}

		let active = true;
		Promise.all([getAllCourseLessons(jwt), getUserLessonProgress(undefined, jwt)])
			.then(([lessons, progress]) => {
				if (active) setSnapshot({ jwt, byCourseId: calculateCourseProgressById(lessons, progress) });
			})
			.catch(error => console.error("Could not load course progress", error));
		return () => { active = false; };
	}, [jwt, pathname]);

	return (
		<CourseProgressContext.Provider value={snapshot?.jwt === jwt ? snapshot.byCourseId : null}>
			{children}
		</CourseProgressContext.Provider>
	);
}

export function useCourseProgress() {
	return useContext(CourseProgressContext);
}
