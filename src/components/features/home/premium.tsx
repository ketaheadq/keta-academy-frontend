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
			<div className="animate-pulse-gentle from-accent/15 to-destructive/15 absolute top-1/4 right-0 h-[400px] w-[400px] rounded-full bg-linear-to-bl blur-3xl" />
			<div
				className="animate-pulse-gentle from-primary/15 to-primary/15 absolute bottom-0 left-0 h-[350px] w-[350px] rounded-full bg-linear-to-tr blur-3xl"
				style={{ animationDelay: "1s" }}
			/>

			<div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-6xl">
					<div className="grid items-center gap-16 lg:grid-cols-2">
						<div className="animate-slideUp">
							<div className="glass text-accent ring-accent/10 mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-sm ring-1">
								<Crown className="text-accent h-4 w-4" />
								<span>Premium Hizmetler</span>
							</div>

							<h2 className="text-foreground mb-6 text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
								Öğrenme deneyimini <span className="text-accent">bir üst seviyeye</span> taşı
							</h2>

							<p className="text-muted-foreground mb-8 text-lg leading-relaxed">
								Özel dersler ve koçluk programlarımızla hedeflerine daha hızlı ulaş. Uzman
								eğitmenlerimiz sana özel bir öğrenme yolculuğu tasarlıyor.
							</p>

							<div className="mb-10 space-y-4">
								{premiumFeatures.map((feature, index) => (
									<div
										key={feature}
										className="animate-fadeIn flex items-center gap-3"
										style={{ animationDelay: `${0.1 + index * 0.1}s` }}
									>
										<div className="bg-accent/10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full shadow-sm">
											<Check className="text-accent h-3.5 w-3.5" />
										</div>
										<span className="text-muted-foreground font-medium">{feature}</span>
									</div>
								))}
							</div>

							<Button
								size="lg"
								className="bg-accent text-background hover:bg-accent h-14 rounded-full px-10 text-base shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105 active:scale-95"
							>
								Premium'a Geç
							</Button>
						</div>

						<div className="grid gap-8">
							<div className="group animate-slideUp" style={{ animationDelay: "0.2s" }}>
								<Card className="border-accent hover:border-accent overflow-hidden bg-white/50 p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-200/50">
									<div className="bg-accent/10 group-hover:bg-accent/10 mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
										<Video className="text-accent h-7 w-7" />
									</div>
									<h3 className="text-foreground mb-3 text-2xl font-bold">Özel Dersler</h3>
									<p className="text-muted-foreground mb-6 text-lg leading-relaxed">
										Uzman eğitmenlerimizle birebir canlı dersler. Senin hızında, senin ihtiyaçlarına
										göre öğren.
									</p>
									<div className="flex items-baseline gap-1">
										<span className="text-accent text-3xl font-bold tracking-tight">₺299</span>
										<span className="text-muted-foreground text-sm font-medium">/saat</span>
									</div>
								</Card>
							</div>

							<div className="group animate-slideUp" style={{ animationDelay: "0.4s" }}>
								<Card className="border-accent hover:border-accent overflow-hidden bg-white/50 p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-200/50">
									<div className="bg-accent/10 group-hover:bg-accent/10 mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6">
										<MessageCircle className="text-accent h-7 w-7" />
									</div>
									<h3 className="text-foreground mb-3 text-2xl font-bold">Koçluk Programı</h3>
									<p className="text-muted-foreground mb-6 text-lg leading-relaxed">
										3 aylık yoğun koçluk programıyla kariyer hedeflerine ulaş. Mentorluk ve
										rehberlik dahil.
									</p>
									<div className="flex items-baseline gap-1">
										<span className="text-accent text-3xl font-bold tracking-tight">₺2.499</span>
										<span className="text-muted-foreground text-sm font-medium">/ay</span>
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
