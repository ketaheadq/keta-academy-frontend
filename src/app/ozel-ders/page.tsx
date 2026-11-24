import { GraduationCap, MessageCircle, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import TutoringContent from "@/components/features/tutoring/tutoring-content";
import { Button } from "@/components/ui/button";
import ScrollToSectionButton from "@/components/ui/scroll-to-section-button";
import { generateTutoringStructuredData } from "@/lib/seo";
import { getContactPage, getTutoringProfiles, getTutorRatingSummaries } from "@/lib/strapi";

const PAGE_URL = `${process.env.NEXT_PUBLIC_FRONTEND_URL || "https://ketalearn.cloud"}/ozel-ders`;

export const metadata: Metadata = {
	title: "Özel Ders | KetaLearn",
	description:
		"Alanında uzman öğretmenlerle birebir özel ders alın. Hedeflerinize özel, kişiselleştirilmiş öğrenme deneyimi.",
	alternates: { canonical: PAGE_URL },
	openGraph: {
		title: "Özel Ders | KetaLearn",
		description: "Alanında uzman öğretmenlerle birebir özel ders alın.",
		url: PAGE_URL,
		siteName: "KetaLearn",
		locale: "tr_TR",
		type: "website",
	},
};

const howItWorksId = "nasil-calisir";

export default async function TutoringPage() {
	const [tutoringProfiles, ratings, contactPage] = await Promise.all([
		getTutoringProfiles(),
		getTutorRatingSummaries(),
		getContactPage().catch(() => null),
	]);

	const structuredData = generateTutoringStructuredData(tutoringProfiles, PAGE_URL);

	return (
		<div className="bg-background min-h-screen">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(structuredData).replace(/</g, String.raw`\u003c`),
				}}
			/>
			{/* Hero Section */}
			<div
				className="bg-slate-950 bg-cover bg-center px-4 py-14 sm:px-6 sm:pt-24 sm:pb-24 lg:px-8"
				style={{
					backgroundImage:
						"linear-gradient(rgb(2 6 23 / 65%), rgb(2 6 23 / 75%)), url('/images/keta-ozelders-sayfas%C4%B1.jpg')",
				}}
			>
				<div className="sm:animate-float mx-auto max-w-4xl text-center sm:pt-10">
					<h1 className="mb-5 text-3xl font-bold tracking-tight text-balance text-white min-[400px]:text-4xl sm:mb-8 sm:text-5xl lg:text-7xl">
						Uzman Öğretmenlerle <br className="hidden sm:block" />
						<span className="text-amber-300">Birebir Eğitim</span>
					</h1>
					<p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-slate-100 sm:mb-12 sm:text-lg sm:leading-8">
						Alanında uzman öğretmenlerle hedeflerinize özel ders alın. Kişiselleştirilmiş bir
						öğrenme deneyimi ile potansiyelinizi zirveye taşıyın.
					</p>

					<div className="mx-auto flex max-w-xs flex-col justify-center gap-3 sm:max-w-none sm:flex-row sm:gap-6">
						<Link href="#ogretmenler" className="w-full sm:w-auto">
							<Button className="bg-accent text-accent-foreground shadow-accent hover:bg-accent/90 h-14 w-full rounded-2xl px-6 text-lg font-bold transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(253,154,0,0.4)] sm:w-auto sm:px-10">
								Hemen Başla
							</Button>
						</Link>
						<ScrollToSectionButton
							sectionId={howItWorksId}
							className="border-primary/20 text-primary hover:border-primary/50 h-14 w-full rounded-2xl border-2 bg-white px-6 text-lg font-bold transition-all hover:scale-105 hover:bg-slate-100 sm:w-auto sm:px-10"
						>
							Nasıl Çalışır?
						</ScrollToSectionButton>
					</div>
				</div>
			</div>

			{/* Interactive Content */}
			<TutoringContent
				data={tutoringProfiles}
				ratings={ratings}
				fallbackPhone={contactPage?.phone}
			/>

			{/* How It Works Section */}
			<div id={howItWorksId} className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
				<div className="mb-10 text-center sm:mb-20">
					<h2 className="text-foreground mb-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
						Geleceğinizi 3 Adımda Planlayın
					</h2>
					<div className="bg-accent mx-auto mb-6 h-1 w-20 rounded-full" />
					<p className="text-muted-foreground mx-auto max-w-2xl text-lg">
						Öğrenme yolculuğunuzu başlatmak hiç bu kadar kolay olmamıştı
					</p>
				</div>

				<div className="grid grid-cols-1 gap-4 sm:gap-8 md:grid-cols-3 lg:gap-12">
					<div className="group border-border relative rounded-3xl border bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
						<div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-background mb-6 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-500">
							<Search className="h-8 w-8" />
						</div>
						<h3 className="text-foreground mb-3 text-2xl font-bold">1. Öğretmeni Seç</h3>
						<p className="text-muted-foreground leading-relaxed">
							Öğretmen profillerini, verdiği dersleri ve öğrenci değerlendirmelerini inceleyin.
						</p>
						<span
							aria-hidden="true"
							className="absolute top-8 right-8 text-4xl font-black text-slate-600"
						>
							01
						</span>
					</div>

					<div className="group border-border relative rounded-3xl border bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
						<div className="bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground mb-6 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-500">
							<MessageCircle className="h-8 w-8" />
						</div>
						<h3 className="text-foreground mb-3 text-2xl font-bold">2. WhatsApp'tan Yaz</h3>
						<p className="text-muted-foreground leading-relaxed">
							Öğretmene WhatsApp'tan yazın ya da arayın; hedefinizi ve uygun saatleri konuşun.
						</p>
						<span
							aria-hidden="true"
							className="absolute top-8 right-8 text-4xl font-black text-slate-600"
						>
							02
						</span>
					</div>

					<div className="group border-border relative rounded-3xl border bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
						<div className="bg-foreground/10 text-foreground group-hover:bg-foreground group-hover:text-background mb-6 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-500">
							<GraduationCap className="h-8 w-8" />
						</div>
						<h3 className="text-foreground mb-3 text-2xl font-bold">3. Deneme Dersiyle Başla</h3>
						<p className="text-muted-foreground leading-relaxed">
							Ücretsiz deneme dersinde seviyenizi belirleyin, size özel programla devam edin.
						</p>
						<span
							aria-hidden="true"
							className="absolute top-8 right-8 text-4xl font-black text-slate-600"
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
				<h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl md:text-5xl">
					Geleceğiniz İçin <br className="hidden sm:block" /> İlk Adımı Bugün Atın
				</h2>
				<p className="mx-auto mt-6 max-w-xl text-lg text-slate-100">
					Öğretmeninizi seçin, ücretsiz deneme dersinizi planlayın ve farkı yaşayın.
				</p>
				<div className="mt-10 flex flex-col justify-center gap-6 sm:flex-row">
					<Link href="#ogretmenler" className="w-full sm:w-auto">
						<Button className="bg-accent text-accent-foreground hover:bg-accent/90 h-14 w-full rounded-2xl px-6 text-lg font-bold shadow-2xl transition-all hover:scale-105 sm:w-auto sm:px-10">
							Öğretmenleri Gör
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
