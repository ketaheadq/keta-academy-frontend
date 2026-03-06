"use client";

import { Check, Crown, MessageCircle, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const premiumFeatures = [
	"Birebir özel ders seansları",
	"Kişiselleştirilmiş öğrenme planı",
	"Öncelikli destek",
	"Canlı grup çalışmaları",
	"Kariyer koçluğu",
	"Sertifika programları",
];

export default function Premium() {
	return (
		<section className="relative overflow-hidden py-16 md:py-24">
			{/* Background */}
			<div className="absolute top-1/4 right-0 h-[400px] w-[400px] animate-pulse-gentle rounded-full bg-linear-to-bl from-accent/15 to-destructive/15 blur-3xl" />
			<div
				className="absolute bottom-0 left-0 h-[350px] w-[350px] animate-pulse-gentle rounded-full bg-linear-to-tr from-primary/15 to-primary/15 blur-3xl"
				style={{ animationDelay: "1s" }}
			/>

			<div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-6xl">
					<div className="grid items-center gap-16 lg:grid-cols-2">
						<div className="animate-slideUp">
							<div className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 font-medium text-accent text-sm shadow-sm ring-1 ring-accent/10">
								<Crown className="h-4 w-4 text-accent" />
								<span>Premium Hizmetler</span>
							</div>

							<h2 className="mb-6 text-balance font-bold text-3xl text-foreground tracking-tight sm:text-4xl md:text-5xl">
								Öğrenme deneyimini <span className="text-accent">bir üst seviyeye</span> taşı
							</h2>

							<p className="mb-8 text-lg text-muted-foreground leading-relaxed">
								Özel dersler ve koçluk programlarımızla hedeflerine daha hızlı ulaş. Uzman
								eğitmenlerimiz sana özel bir öğrenme yolculuğu tasarlıyor.
							</p>

							<div className="mb-10 space-y-4">
								{premiumFeatures.map((feature, index) => (
									<div
										key={feature}
										className="flex animate-fadeIn items-center gap-3"
										style={{ animationDelay: `${0.1 + index * 0.1}s` }}
									>
										<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 shadow-sm">
											<Check className="h-3.5 w-3.5 text-accent" />
										</div>
										<span className="font-medium text-muted-foreground">{feature}</span>
									</div>
								))}
							</div>

							<Button
								size="lg"
								className="h-14 rounded-full bg-accent px-10 text-base text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105 hover:bg-accent active:scale-95"
							>
								Premium'a Geç
							</Button>
						</div>

						<div className="grid gap-8">
							<div className="group animate-slideUp" style={{ animationDelay: "0.2s" }}>
								<Card className="overflow-hidden border-accent bg-white/50 p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-accent hover:shadow-2xl hover:shadow-orange-200/50">
									<div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-accent/10">
										<Video className="h-7 w-7 text-accent" />
									</div>
									<h3 className="mb-3 font-bold text-2xl text-foreground">Özel Dersler</h3>
									<p className="mb-6 text-lg text-muted-foreground leading-relaxed">
										Uzman eğitmenlerimizle birebir canlı dersler. Senin hızında, senin ihtiyaçlarına
										göre öğren.
									</p>
									<div className="flex items-baseline gap-1">
										<span className="font-bold text-3xl text-accent tracking-tight">₺299</span>
										<span className="font-medium text-muted-foreground text-sm">/saat</span>
									</div>
								</Card>
							</div>

							<div className="group animate-slideUp" style={{ animationDelay: "0.4s" }}>
								<Card className="overflow-hidden border-accent bg-white/50 p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-accent hover:shadow-2xl hover:shadow-orange-200/50">
									<div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 transition-all duration-500 group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-accent/10">
										<MessageCircle className="h-7 w-7 text-accent" />
									</div>
									<h3 className="mb-3 font-bold text-2xl text-foreground">Koçluk Programı</h3>
									<p className="mb-6 text-lg text-muted-foreground leading-relaxed">
										3 aylık yoğun koçluk programıyla kariyer hedeflerine ulaş. Mentorluk ve
										rehberlik dahil.
									</p>
									<div className="flex items-baseline gap-1">
										<span className="font-bold text-3xl text-accent tracking-tight">₺2.499</span>
										<span className="font-medium text-muted-foreground text-sm">/ay</span>
									</div>
								</Card>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
