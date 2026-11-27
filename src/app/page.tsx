import type { Metadata } from "next";
import { Suspense } from "react";
import { SavedReportsSection } from "@/components/features/deneme/saved-reports";
import Courses from "@/components/features/home/courses";
import { HomeDenemeler, HomeVeliler } from "@/components/features/home/home-sections";
import { HomeSlider } from "@/components/features/home/home-slider";
import { CardGridSkeleton } from "@/components/shared/loading-skeletons";
import { getDenemeler } from "@/lib/deneme";
import { getHomeSlides } from "@/lib/home";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
	title: "KetaLearn | Ücretsiz dersler ve deneme sınavları",
	description: "Ücretsiz ders videolarını izle, deneme sınavı çöz, ilerlemeni takip et.",
	alternates: { canonical: canonicalUrl("/") },
};

export default async function Home() {
	const [slides, denemeler] = await Promise.all([getHomeSlides(), getDenemeler()]);
	return (
		<>
			<HomeSlider slides={slides} />
			<SavedReportsSection />
			<HomeDenemeler denemeler={denemeler} />
			<Suspense
				fallback={
					<output aria-label="Dersler yükleniyor" aria-busy="true" className="block py-8 sm:py-10">
						<span className="sr-only">Dersler yükleniyor</span>
						<CardGridSkeleton count={3} />
					</output>
				}
			>
				<Courses preview />
			</Suspense>
			<HomeVeliler />
		</>
	);
}
