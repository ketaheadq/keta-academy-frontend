import type { Metadata } from "next";
import Courses from "@/components/features/home/courses";

export const metadata: Metadata = { title: "Dersler | KetaLearn" };

export default function CoursesPage() {
	return (
		<>
			<h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Dersler</h1>
			<Courses />
		</>
	);
}
