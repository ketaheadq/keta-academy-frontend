import { ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { DenemeCard } from "@/components/features/deneme/deneme-card";
import { MeterBar } from "@/components/motion/meter-bar";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import type { DenemeSummary } from "@/lib/deneme";

/** "Bu dönemin denemeleri": featured exams first, then the newest. */
export function HomeDenemeler({ denemeler }: Readonly<{ denemeler: DenemeSummary[] }>) {
	if (!denemeler.length) return null;
	return (
		<section aria-labelledby="home-denemeler" className="mt-5 sm:mt-10">
			<Reveal className="mb-3 flex items-end justify-between gap-4 sm:mb-4">
				<div>
					<h2 id="home-denemeler" className="text-foreground text-xl font-bold sm:text-2xl">
						Bu dönemin denemeleri
					</h2>
					<p className="text-muted-foreground mt-1 hidden sm:block">
						Kayıt olmadan çöz, netini hemen gör.
					</p>
				</div>
				<Link
					href="/deneme-sinavlari"
					className="accent-link text-primary group flex shrink-0 items-center gap-1 text-sm font-medium"
				>
					Tümünü gör{" "}
					<ArrowRight
						className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
						aria-hidden="true"
					/>
				</Link>
			</Reveal>
			<RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{denemeler.slice(0, 4).map((deneme) => (
					<RevealItem key={deneme.documentId}>
						<DenemeCard deneme={deneme} />
					</RevealItem>
				))}
			</RevealGroup>
		</section>
	);
}

/** For parents: what the report looks like, and the trial lesson call to action. */
export function HomeVeliler() {
	const sample = [
		{ ad: "Üslü İfadeler", oran: 83 },
		{ ad: "Çarpanlar ve Katlar", oran: 60 },
		{ ad: "Kareköklü İfadeler", oran: 25 },
	];
	return (
		<section
			aria-labelledby="home-veliler"
			className="mt-12 mb-4 grid gap-6 rounded-3xl bg-slate-950 p-6 text-white sm:p-10 lg:grid-cols-2"
		>
			<Reveal>
				<h2 id="home-veliler" className="text-2xl font-bold sm:text-3xl">
					Veliler için: çocuğunuz nerede eksik, görün
				</h2>
				<p className="mt-3 leading-relaxed text-slate-200">
					Ücretsiz denemeyi çözen öğrencinin PDF analiz raporu hemen hazırlanır: yanlış yaptığı her
					soru çözümüyle, konu konu başarısı, izlemesi gereken dersler ve Çağlar Hoca'nın notu.
					İsterseniz raporu 15 dakikada birlikte değerlendiririz.
				</p>
				<div className="mt-6 flex flex-col gap-3 sm:flex-row">
					<Button
						asChild
						size="lg"
						className="bg-amber-400 text-slate-950 transition-transform hover:scale-[1.02] hover:bg-amber-300 active:scale-[0.98]"
					>
						<Link href="/deneme-sinavlari">Ücretsiz deneme çöz</Link>
					</Button>
					<Button
						asChild
						size="lg"
						variant="outline"
						className="border-white/40 bg-transparent text-white transition-transform hover:scale-[1.02] hover:bg-white/10 active:scale-[0.98]"
					>
						<Link href="/ozel-ders">
							<MessageCircle aria-hidden="true" /> Deneme dersi için yazın
						</Link>
					</Button>
				</div>
			</Reveal>
			<Reveal
				as="figure"
				variant="scale"
				delay={0.12}
				className="bg-card text-card-foreground rounded-2xl p-5"
			>
				<figcaption className="mb-3 text-sm font-semibold">
					Örnek rapor · konu bazında başarı
				</figcaption>
				<ul className="space-y-3">
					{sample.map((konu) => (
						<li key={konu.ad}>
							<div className="mb-1 flex justify-between text-sm">
								<span>{konu.ad}</span>
								<span className="font-semibold">%{konu.oran}</span>
							</div>
							<MeterBar
								value={konu.oran}
								className={
									konu.oran >= 75 ? "bg-green-600" : konu.oran >= 50 ? "bg-amber-500" : "bg-red-500"
								}
							/>
						</li>
					))}
				</ul>
				<p className="bg-secondary text-secondary-foreground mt-4 rounded-lg p-3 text-sm">
					"Öncelikle kareköklü ifadelere çalışalım: şu dersi izle → Kareköklü İfadelerde
					Sadeleştirme"
				</p>
				<a
					href="/ornek-deneme-raporu.pdf"
					target="_blank"
					rel="noopener"
					className="accent-link mt-3 inline-block text-sm font-medium"
				>
					Örnek PDF raporu inceleyin
				</a>
			</Reveal>
		</section>
	);
}
