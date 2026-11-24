import { ArrowRight, GraduationCap, MessageCircle } from "lucide-react";
import Link from "next/link";
import { DenemeCard } from "@/components/features/deneme/deneme-card";
import { Button } from "@/components/ui/button";
import type { DenemeSummary } from "@/lib/deneme";

/** "Bu dönemin denemeleri": featured exams first, then the newest. */
export function HomeDenemeler({ denemeler }: Readonly<{ denemeler: DenemeSummary[] }>) {
	if (!denemeler.length) return null;
	return (
		<section aria-labelledby="home-denemeler" className="mt-5 sm:mt-10">
			<div className="mb-3 flex items-end justify-between gap-4 sm:mb-4">
				<div>
					<h2 id="home-denemeler" className="font-bold text-foreground text-xl sm:text-2xl">
						Bu dönemin denemeleri
					</h2>
					<p className="mt-1 hidden text-muted-foreground sm:block">
						Kayıt olmadan çöz, netini hemen gör.
					</p>
				</div>
				<Link
					href="/deneme-sinavlari"
					className="flex shrink-0 items-center gap-1 font-medium text-primary text-sm"
				>
					Tümünü gör <ArrowRight className="h-4 w-4" aria-hidden="true" />
				</Link>
			</div>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{denemeler.slice(0, 4).map((deneme) => (
					<DenemeCard key={deneme.documentId} deneme={deneme} />
				))}
			</div>
		</section>
	);
}

/** Trust section: who teaches here. */
export function HomeHoca() {
	return (
		<section aria-labelledby="home-hoca" className="mt-12 rounded-3xl border bg-white p-6 sm:p-10">
			<div className="flex flex-col gap-6 md:flex-row md:items-center">
				<div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
					<GraduationCap className="h-8 w-8 text-primary" aria-hidden="true" />
				</div>
				<div className="flex-1">
					<h2 id="home-hoca" className="font-bold text-2xl text-foreground">
						Çağlar Hoca kimdir?
					</h2>
					<p className="mt-2 max-w-3xl text-muted-foreground leading-relaxed">
						ODTÜ Fizik mezunu Çağlar Hoca, ortaokul ve lise öğrencilerine LGS, TYT, AYT ve okul
						sınavları için matematik dersi veriyor. Konuları ezberletmeden, "neden" ve "nasıl"
						sorularıyla anlatıyor; her öğrenciyle seviyesine ve hedefine göre ilerliyor.
					</p>
				</div>
				<Button asChild variant="outline" className="shrink-0">
					<Link href="/ozel-ders">Özel ders bilgisi</Link>
				</Button>
			</div>
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
			<div>
				<h2 id="home-veliler" className="font-bold text-2xl sm:text-3xl">
					Veliler için: çocuğunuz nerede eksik, görün
				</h2>
				<p className="mt-3 text-slate-200 leading-relaxed">
					Ücretsiz denemeyi çözen öğrencinin PDF analiz raporu telefonunuza SMS ile gelir: yanlış
					yaptığı her soru çözümüyle, konu konu başarısı, izlemesi gereken dersler ve Çağlar
					Hoca'nın notu. İsterseniz raporu 15 dakikada birlikte değerlendiririz.
				</p>
				<div className="mt-6 flex flex-col gap-3 sm:flex-row">
					<Button asChild size="lg" className="bg-amber-400 text-slate-950 hover:bg-amber-300">
						<Link href="/deneme-sinavlari">Ücretsiz deneme çöz</Link>
					</Button>
					<Button
						asChild
						size="lg"
						variant="outline"
						className="border-white/40 bg-transparent text-white hover:bg-white/10"
					>
						<Link href="/ozel-ders">
							<MessageCircle aria-hidden="true" /> Deneme dersi için yazın
						</Link>
					</Button>
				</div>
			</div>
			<figure className="rounded-2xl bg-white p-5 text-slate-900">
				<figcaption className="mb-3 font-semibold text-sm">
					Örnek rapor · konu bazında başarı
				</figcaption>
				<ul className="space-y-3">
					{sample.map((konu) => (
						<li key={konu.ad}>
							<div className="mb-1 flex justify-between text-sm">
								<span>{konu.ad}</span>
								<span className="font-semibold">%{konu.oran}</span>
							</div>
							<div className="h-2 rounded-full bg-slate-100" aria-hidden="true">
								<div
									className={`h-2 rounded-full ${konu.oran >= 75 ? "bg-green-600" : konu.oran >= 50 ? "bg-amber-500" : "bg-red-500"}`}
									style={{ width: `${konu.oran}%` }}
								/>
							</div>
						</li>
					))}
				</ul>
				<p className="mt-4 rounded-lg bg-slate-50 p-3 text-slate-600 text-sm">
					"Öncelikle kareköklü ifadelere çalışalım: şu dersi izle → Kareköklü İfadelerde
					Sadeleştirme"
				</p>
				<a
					href="/ornek-deneme-raporu.pdf"
					target="_blank"
					rel="noopener"
					className="mt-3 inline-block font-medium text-sm underline"
				>
					Örnek PDF raporu inceleyin
				</a>
			</figure>
		</section>
	);
}
