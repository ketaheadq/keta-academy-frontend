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
			<div
				className="bg-slate-950 bg-cover bg-center px-4 py-14 sm:px-6 sm:pt-24 sm:pb-24 lg:px-8"
				style={{
					backgroundImage:
						"linear-gradient(rgb(2 6 23 / 65%), rgb(2 6 23 / 75%)), url('/images/keta-ozelders-sayfas%C4%B1.jpg')",
				}}
			>
				<div className="mx-auto max-w-4xl text-center sm:animate-float sm:pt-10">
					<h1 className="mb-5 text-balance font-bold text-3xl text-white tracking-tight min-[400px]:text-4xl sm:mb-8 sm:text-5xl lg:text-7xl">
						Uzman Öğretmenlerle <br className="hidden sm:block" />
						<span className="text-amber-300">Birebir Eğitim</span>
					</h1>
					<p className="mx-auto mb-8 max-w-2xl text-base text-slate-100 leading-7 sm:mb-12 sm:text-lg sm:leading-8">
						Alanında uzman öğretmenlerle hedeflerinize özel ders alın. Kişiselleştirilmiş bir
						öğrenme deneyimi ile potansiyelinizi zirveye taşıyın.
					</p>

					<div className="mx-auto flex max-w-xs flex-col justify-center gap-3 sm:max-w-none sm:flex-row sm:gap-6">
						<Link href="/iletisim" className="w-full sm:w-auto">
							<Button className="h-14 w-full rounded-2xl bg-accent px-6 sm:w-auto sm:px-10 font-bold text-accent-foreground text-lg shadow-accent transition-all hover:scale-105 hover:bg-accent/90 hover:shadow-[0_0_30px_rgba(253,154,0,0.4)]">
								Hemen Başla
							</Button>
						</Link>
						<ScrollToSectionButton
							sectionId={howItWorksId}
							className="h-14 w-full rounded-2xl border-2 border-primary/20 bg-white px-6 sm:w-auto sm:px-10 font-bold text-lg text-primary transition-all hover:scale-105 hover:border-primary/50 hover:bg-slate-100"
						>
							Nasıl Çalışır?
						</ScrollToSectionButton>
					</div>
				</div>
			</div>

			{/* Interactive Content */}
			<TutoringContent data={tutoringProfiles} />

			{/* How It Works Section */}
			<div id={howItWorksId} className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
				<div className="mb-10 text-center sm:mb-20">
					<h2 className="mb-4 text-balance font-bold text-3xl text-foreground sm:text-4xl tracking-tight md:text-5xl">
						Geleceğinizi 3 Adımda Planlayın
					</h2>
					<div className="mx-auto mb-6 h-1 w-20 rounded-full bg-accent" />
					<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
						Öğrenme yolculuğunuzu başlatmak hiç bu kadar kolay olmamıştı
					</p>
				</div>

				<div className="grid grid-cols-1 gap-4 sm:gap-8 md:grid-cols-3 lg:gap-12">
					<div className="group relative rounded-3xl border border-border bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
						<div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-background">
							<Search className="h-8 w-8" />
						</div>
						<h3 className="mb-3 font-bold text-2xl text-foreground">1. Öğretmen Seç</h3>
						<p className="text-muted-foreground leading-relaxed">
							Hedeflerinize uygun uzman öğretmeni binlerce profesyonel arasından kolayca bulun.
						</p>
						<span
							aria-hidden="true"
							className="absolute top-8 right-8 font-black text-4xl text-slate-600"
						>
							01
						</span>
					</div>

					<div className="group relative rounded-3xl border border-border bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
						<div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-all duration-500 group-hover:bg-accent group-hover:text-accent-foreground">
							<Calendar className="h-8 w-8" />
						</div>
						<h3 className="mb-3 font-bold text-2xl text-foreground">2. Ders Rezerve Et</h3>
						<p className="text-muted-foreground leading-relaxed">
							Size en uygun zaman dilimini seçin ve dakikalar içinde dersinizi planlayın.
						</p>
						<span
							aria-hidden="true"
							className="absolute top-8 right-8 font-black text-4xl text-slate-600"
						>
							02
						</span>
					</div>

					<div className="group relative rounded-3xl border border-border bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
						<div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-foreground/10 text-foreground transition-all duration-500 group-hover:bg-foreground group-hover:text-background">
							<Video className="h-8 w-8" />
						</div>
						<h3 className="mb-3 font-bold text-2xl text-foreground">3. Öğrenmeye Başla</h3>
						<p className="text-muted-foreground leading-relaxed">
							Yüksek kaliteli görüntülü görüşme ile her yerden eğitime başlayın.
						</p>
						<span
							aria-hidden="true"
							className="absolute top-8 right-8 font-black text-4xl text-slate-600"
						>
							03
						</span>
					</div>
				</div>
			</div>

			{/* CTA Section */}
			<div
				className="overflow-hidden rounded-3xl bg-slate-950 bg-cover bg-center px-4 py-14 text-center shadow-2xl sm:rounded-4xl sm:px-16 sm:py-20"
				style={{
					backgroundImage:
						"linear-gradient(rgb(2 6 23 / 70%), rgb(2 6 23 / 78%)), url('/images/keta-ozel-ders-2.jpg')",
				}}
			>
				<h2 className="mx-auto max-w-2xl text-balance font-bold text-3xl text-white sm:text-4xl tracking-tight md:text-5xl">
					Geleceğiniz İçin <br className="hidden sm:block" /> İlk Adımı Bugün Atın
				</h2>
				<p className="mx-auto mt-6 max-w-xl text-lg text-slate-100">
					Binlerce başarılı öğrenci arasına siz de katılın. İlk dersinizi deneyin ve farkı yaşayın.
				</p>
				<div className="mt-10 flex flex-col justify-center gap-6 sm:flex-row">
					<Link href="/iletisim" className="w-full sm:w-auto">
						<Button className="h-14 w-full rounded-2xl bg-accent px-6 sm:w-auto sm:px-10 font-bold text-accent-foreground text-lg shadow-2xl transition-all hover:scale-105 hover:bg-accent/90">
							Hemen Keşfet
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
