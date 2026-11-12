import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import Courses from "@/components/features/home/courses";
import { Button } from "@/components/ui/button";
import styles from "./hero.module.css";

export const metadata: Metadata = {
	title: "KetaLearn | Ücretsiz dersler",
	description: "Ücretsiz ders videolarını izle, ilerlemeni takip et ve quiz çöz.",
};

export default function Home() {
	return (
		<>
			<section aria-labelledby="landing-title" className={styles.hero}>
				<div className={styles.copy}>
					<h1 id="landing-title" className="max-w-3xl text-balance font-bold text-4xl tracking-tight sm:text-5xl">
						Ücretsiz derslerle kendi hızında öğren.
					</h1>
					<p className="mt-4 max-w-xl text-pretty text-base text-slate-700 sm:text-lg">
						Ders videolarını izle, ilerlemeni takip et ve öğrendiklerini quizlerle pekiştir.
					</p>
					<Button asChild size="lg" className="mt-6">
						<Link href="/kurslar">
							Dersleri keşfet <ArrowRight aria-hidden="true" />
						</Link>
					</Button>
				</div>
			</section>
			<Courses preview />
		</>
	);
}
