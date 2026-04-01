import { Calendar, Search, Video } from "lucide-react";
import Link from "next/link";
import { use, useId } from "react";
import TutoringContent from "@/components/features/tutoring/tutoring-content";
import { Button } from "@/components/ui/button";
import ScrollToSectionButton from "@/components/ui/scroll-to-section-button";
import { getTutoringProfiles } from "@/lib/strapi";

export default function TutoringPage() {
	// Fetch tutoring profiles from Strapi
	const tutoringProfiles = use(getTutoringProfiles());
	const howItWorksId = useId();

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			<div className="relative isolate overflow-hidden px-6 pt-16 pb-24 sm:pt-24 lg:px-8">
				<div
					className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
					aria-hidden="true"
				>
					<div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-primary to-accent opacity-20 sm:left-[calc(50%-30rem)] sm:w-288.75" />
				</div>

				<div className="mx-auto max-w-4xl animate-float pt-10 text-center">
					<h1 className="mb-8 font-bold text-6xl text-foreground tracking-tight sm:text-7xl">
						Uzman Öğretmenlerle <br />
						<span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
							Birebir Eğitim
						</span>
					</h1>
					<p className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground leading-8">
						Alanında uzman öğretmenlerle hedeflerinize özel ders alın. Kişiselleştirilmiş bir
						öğrenme deneyimi ile potansiyelinizi zirveye taşıyın.
					</p>

					<div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
						<Link href="/iletisim">
							<Button className="h-14 rounded-2xl bg-accent px-10 font-bold text-accent-foreground text-lg shadow-accent transition-all hover:scale-105 hover:bg-accent/90 hover:shadow-[0_0_30px_rgba(253,154,0,0.4)]">
								Hemen Başla
							</Button>
						</Link>
						<ScrollToSectionButton
							sectionId={howItWorksId}
							className="h-14 rounded-2xl border-2 border-primary/20 bg-white px-10 font-bold text-lg text-primary transition-all hover:scale-105 hover:border-primary/50 hover:bg-primary/5"
						>
							Nasıl Çalışır?
						</ScrollToSectionButton>
					</div>
				</div>

				<div
					className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
					aria-hidden="true"
				>
					<div className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-accent to-primary opacity-20 sm:left-[calc(50%+36rem)] sm:w-288.75" />
				</div>
			</div>

			{/* Interactive Content */}
			<TutoringContent data={tutoringProfiles} />

			{/* How It Works Section */}
			<div id={howItWorksId} className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
				<div className="mb-20 text-center">
					<h2 className="mb-4 font-bold text-4xl text-foreground tracking-tight md:text-5xl">
						Geleceğinizi 3 Adımda Planlayın
					</h2>
					<div className="mx-auto mb-6 h-1 w-20 rounded-full bg-accent" />
					<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
						Öğrenme yolculuğunuzu başlatmak hiç bu kadar kolay olmamıştı
					</p>
				</div>

				<div className="grid grid-cols-1 gap-12 md:grid-cols-3">
					<div className="group relative rounded-3xl border border-border bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
						<div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-background">
							<Search className="h-8 w-8" />
						</div>
						<h3 className="mb-3 font-bold text-2xl text-foreground">1. Öğretmen Seç</h3>
						<p className="text-muted-foreground leading-relaxed">
							Hedeflerinize uygun uzman öğretmeni binlerce profesyonel arasından kolayca bulun.
						</p>
						<div className="absolute right-8 bottom-4 font-black text-6xl text-primary/5">01</div>
					</div>

					<div className="group relative rounded-3xl border border-border bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
						<div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-all duration-500 group-hover:bg-accent group-hover:text-accent-foreground">
							<Calendar className="h-8 w-8" />
						</div>
						<h3 className="mb-3 font-bold text-2xl text-foreground">2. Ders Rezerve Et</h3>
						<p className="text-muted-foreground leading-relaxed">
							Size en uygun zaman dilimini seçin ve dakikalar içinde dersinizi planlayın.
						</p>
						<div className="absolute right-8 bottom-4 font-black text-6xl text-accent/5">02</div>
					</div>

					<div className="group relative rounded-3xl border border-border bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
						<div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-foreground/10 text-foreground transition-all duration-500 group-hover:bg-foreground group-hover:text-background">
							<Video className="h-8 w-8" />
						</div>
						<h3 className="mb-3 font-bold text-2xl text-foreground">3. Öğrenmeye Başla</h3>
						<p className="text-muted-foreground leading-relaxed">
							Yüksek kaliteli görüntülü görüşme ile her yerden eğitime başlayın.
						</p>
						<div className="absolute right-8 bottom-4 font-black text-6xl text-foreground/5">
							03
						</div>
					</div>
				</div>
			</div>

			{/* CTA Section */}
			<div className="relative isolate overflow-hidden rounded-4xl bg-foreground px-8 py-20 text-center shadow-2xl sm:px-16">
				<div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 animate-pulse-gentle rounded-full bg-primary/20 blur-3xl" />
				<div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-96 w-96 animate-pulse-gentle rounded-full bg-accent/20 blur-3xl" />

				<h2 className="relative mx-auto max-w-2xl font-bold text-4xl text-white tracking-tight md:text-5xl">
					Geleceğiniz İçin <br /> İlk Adımı Bugün Atın
				</h2>
				<p className="relative mx-auto mt-6 max-w-xl text-lg text-secondary/60">
					Binlerce başarılı öğrenci arasına siz de katılın. İlk dersinizi deneyin ve farkı yaşayın.
				</p>
				<div className="relative mt-10 flex flex-col justify-center gap-6 sm:flex-row">
					<Link href="/iletisim">
						<Button className="h-14 rounded-2xl bg-accent px-10 font-bold text-accent-foreground text-lg shadow-2xl transition-all hover:scale-105 hover:bg-accent/90">
							Hemen Keşfet
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
