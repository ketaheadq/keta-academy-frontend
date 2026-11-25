import type { Metadata } from "next";
import Courses from "@/components/features/home/courses";
import { HomeDenemeler, HomeVeliler } from "@/components/features/home/home-sections";
import { HomeSlider } from "@/components/features/home/home-slider";
import { getDenemeler } from "@/lib/deneme";
import { getHomeSlides } from "@/lib/home";

export const metadata: Metadata = {
	title: "KetaLearn | Ücretsiz dersler ve deneme sınavları",
	description: "Ücretsiz ders videolarını izle, deneme sınavı çöz, ilerlemeni takip et.",
};

export default async function Home() {
	const [slides, denemeler] = await Promise.all([getHomeSlides(), getDenemeler()]);
	return (
		<>
			<HomeSlider slides={slides} />
			<HomeDenemeler denemeler={denemeler} />
			<Courses preview />
			<HomeVeliler />
		</>
	);
}
