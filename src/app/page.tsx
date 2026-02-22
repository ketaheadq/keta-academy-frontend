import CallToAction from "@/components/features/home/call-to-action";
import Courses from "@/components/features/home/courses";
import Features from "@/components/features/home/features";
import Hero from "@/components/features/home/hero";
import Premium from "@/components/features/home/premium";

export default function Home() {
	return (
		<>
			<Hero />
			<Premium />
			<Features />
			<CallToAction />
			<Courses />
		</>
	);
}
