"use client";

import { Check, Crown, MessageCircle, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { generateSimpleId } from "@/lib/utils";

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
		<section className="relative py-20 md:py-32">
			{/* Background */}
			<div className="absolute top-1/4 right-0 h-[400px] w-[400px] animate-pulse rounded-full bg-gradient-to-bl from-rose-400/15 to-pink-400/15 blur-3xl" />
			<div
				className="absolute bottom-0 left-0 h-[350px] w-[350px] animate-pulse rounded-full bg-gradient-to-tr from-violet-400/15 to-purple-400/15 blur-3xl"
				style={{ animationDelay: "1s" }}
			/>

			<div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-6xl">
					<div className="grid items-center gap-12 lg:grid-cols-2">
						<div className="animate-slideUp">
							<div className="mb-6 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 font-medium text-orange-800 text-sm">
								<Crown className="h-4 w-4" />
								<span>Premium Hizmetler</span>
							</div>

							<h2 className="mb-6 text-balance font-bold text-3xl text-gray-900 sm:text-4xl md:text-5xl">
								Öğrenme deneyimini <span className="text-orange-600">bir üst seviyeye</span> taşı
							</h2>

							<p className="mb-8 text-gray-600 text-lg leading-relaxed">
								Özel dersler ve koçluk programlarımızla hedeflerine daha hızlı ulaş. Uzman
								eğitmenlerimiz sana özel bir öğrenme yolculuğu tasarlıyor.
							</p>

							<div className="mb-8 space-y-3">
								{premiumFeatures.map((feature, index) => (
									<div
										key={generateSimpleId()}
										className="flex animate-fadeIn items-center gap-3"
										style={{ animationDelay: `${0.1 + index * 0.1}s` }}
									>
										<div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-orange-100">
											<Check className="h-3 w-3 text-orange-600" />
										</div>
										<span className="text-gray-900">{feature}</span>
									</div>
								))}
							</div>

							<Button
								size="lg"
								className="bg-orange-600 px-8 text-base text-white transition-all duration-200 hover:scale-105 hover:bg-orange-700"
							>
								Premium'a Geç
							</Button>
						</div>

						<div className="grid gap-6">
							<div className="group animate-slideUp" style={{ animationDelay: "0.2s" }}>
								<Card className="hover:-translate-y-2 border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-lg">
									<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 transition-all duration-300 group-hover:scale-110 group-hover:bg-orange-200">
										<Video className="h-6 w-6 text-orange-600" />
									</div>
									<h3 className="mb-2 font-semibold text-gray-900 text-xl">Özel Dersler</h3>
									<p className="mb-4 text-gray-600 leading-relaxed">
										Uzman eğitmenlerimizle birebir canlı dersler. Senin hızında, senin ihtiyaçlarına
										göre öğren.
									</p>
									<div className="font-bold text-2xl text-orange-600">
										₺299<span className="font-normal text-gray-500 text-sm">/saat</span>
									</div>
								</Card>
							</div>

							<div className="group animate-slideUp" style={{ animationDelay: "0.4s" }}>
								<Card className="hover:-translate-y-2 border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-lg">
									<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 transition-all duration-300 group-hover:scale-110 group-hover:bg-orange-200">
										<MessageCircle className="h-6 w-6 text-orange-600" />
									</div>
									<h3 className="mb-2 font-semibold text-gray-900 text-xl">Koçluk Programı</h3>
									<p className="mb-4 text-gray-600 leading-relaxed">
										3 aylık yoğun koçluk programıyla kariyer hedeflerine ulaş. Mentorluk ve
										rehberlik dahil.
									</p>
									<div className="font-bold text-2xl text-orange-600">
										₺2.499<span className="font-normal text-gray-500 text-sm">/ay</span>
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
