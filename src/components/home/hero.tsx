"use client";

import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateSimpleId } from "@/lib/utils";

export default function Hero() {
	return (
		<section className="relative overflow-hidden pt-3216 pb-20 md:pt-20 md:pb-32">
			{/* Background Blobs */}
			<div className="-z-10 absolute inset-0">
				<div className="absolute top-20 left-10 h-72 w-72 animate-pulse rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-3xl" />
				<div
					className="absolute right-10 bottom-20 h-96 w-96 animate-pulse rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-3xl"
					style={{ animationDelay: "1s" }}
				/>
				<div
					className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-80 w-80 animate-pulse rounded-full bg-gradient-to-br from-amber-400/15 to-orange-400/15 blur-3xl"
					style={{ animationDelay: "2s" }}
				/>
			</div>

			<div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-4xl text-center">
					{/* Badge */}
					<div className="mb-8 inline-flex animate-fadeIn items-center gap-2 rounded-full bg-blue-100 px-4 py-2 font-medium text-blue-800 text-sm">
						<Sparkles className="h-4 w-4" />
						<span>Tüm derslere kolaylıkla ulaş!</span>
					</div>

					{/* Headline */}
					<h1 className="mb-6 animate-slideUp text-balance font-bold text-4xl text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
						Öğrenmeye başlamak için{" "}
						<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
							en iyi yer
						</span>
					</h1>

					{/* Subtitle */}
					<p
						className="mx-auto mb-10 max-w-2xl animate-slideUp text-balance text-gray-700 text-lg leading-relaxed sm:text-xl"
						style={{ animationDelay: "0.2s" }}
					>
						Binlerce ücretsiz ders, kaldığın yerden devam et, quizlerle kendini test et. Öğrenme
						yolculuğunda her adımda yanındayız.
					</p>

					{/* Buttons */}
					<div
						className="mb-16 flex animate-slideUp flex-col items-center justify-center gap-4 sm:flex-row"
						style={{ animationDelay: "0.4s" }}
					>
						<Button
							size="lg"
							className="group h-12 bg-blue-600 px-8 text-base text-white transition-all duration-200 hover:scale-105 hover:bg-blue-700"
						>
							Hemen Başla
							<ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="group h-12 border-gray-300 px-8 text-base text-gray-700 transition-all duration-200 hover:scale-105 hover:bg-gray-50"
						>
							<Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
							Nasıl Çalışır?
						</Button>
					</div>

					<div
						className="mx-auto grid max-w-2xl animate-slideUp grid-cols-3 gap-8"
						style={{ animationDelay: "0.6s" }}
					>
						{[
							{ value: "1000+", label: "Ücretsiz Ders" },
							{ value: "50K+", label: "Öğrenci" },
							{ value: "4.9", label: "Ortalama Puan" },
						].map((stat) => (
							<div
								key={generateSimpleId()}
								className="text-center transition-transform duration-300 hover:scale-110"
							>
								<div className="mb-2 font-bold text-3xl text-blue-600 sm:text-4xl">
									{stat.value}
								</div>
								<div className="text-gray-600 text-sm">{stat.label}</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
