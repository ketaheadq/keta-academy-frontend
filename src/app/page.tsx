import CallToAction from "@/components/home/call-to-action";
import Courses from "@/components/home/courses";
import Features from "@/components/home/features";
import Hero from "@/components/home/hero";
import Premium from "@/components/home/premium";

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
