"use client";

import { ArrowRight, Play, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// const stats = [
// 	{ value: "1000+", label: "Ücretsiz Ders" },
// 	{ value: "50K+", label: "Öğrenci" },
// 	{ value: "4.9", label: "Ortalama Puan" },
// ];

export default function Hero() {
	return (
		<section className="relative overflow-hidden mb:pt-24 pt-12 pb-8 md:pb-16">
			{/* Background Blobs */}
			<div className="absolute inset-0 -z-10 overflow-hidden">
				<div className="absolute top-20 left-10 h-72 w-72 animate-pulse-gentle rounded-full bg-linear-to-br from-blue-400/20 to-cyan-400/20 blur-3xl" />
				<div
					className="absolute right-10 bottom-20 h-96 w-96 animate-pulse-gentle rounded-full bg-linear-to-br from-purple-400/20 to-pink-400/20 blur-3xl"
					style={{ animationDelay: "1s" }}
				/>
				<div
					className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 animate-pulse-gentle rounded-full bg-linear-to-br from-amber-400/15 to-orange-400/15 blur-3xl"
					style={{ animationDelay: "2s" }}
				/>
			</div>

			<div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-4xl text-center">
					{/* Badge */}
					<div className="glass mb-8 inline-flex animate-fadeIn items-center gap-2 rounded-full px-4 py-2 font-medium text-blue-800 text-sm shadow-sm ring-1 ring-blue-900/10">
						<Sparkles className="h-4 w-4 text-blue-600" />
						<span>Tüm derslere kolaylıkla ulaş!</span>
					</div>

					{/* Headline */}
					<h1 className="mb-6 animate-slideUp text-balance font-bold text-4xl text-gray-900 tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
						Öğrenmeye başlamak için <span className="text-gradient">en iyi yer</span>
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
						<Link href="/giris">
							<Button
								size="lg"
								className="group h-14 rounded-full bg-blue-600 px-10 text-base text-white shadow-blue-500/25 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-700 active:scale-95"
							>
								Hemen Başla
								<ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
							</Button>
						</Link>
						<Link href="/sikca-sorulan-sorular">
							<Button
								size="lg"
								variant="outline"
								className="group h-14 rounded-full border-gray-200 bg-white/50 px-10 text-base text-gray-700 backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95"
							>
								<Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
								Nasıl Çalışır?
							</Button>
						</Link>
					</div>

					<div
						className="mx-auto grid max-w-2xl animate-slideUp grid-cols-3 gap-8"
						style={{ animationDelay: "0.6s" }}
					>
						{/* {stats.map((stat) => (
							<div
								key={stat.label}
								className="group text-center transition-transform duration-300 hover:scale-110"
							>
								<div className="mb-2 font-bold text-3xl text-blue-600 sm:text-4xl lg:text-5xl">
									{stat.value}
								</div>
								<div className="font-medium text-gray-600 text-sm uppercase tracking-wider">
									{stat.label}
								</div>
							</div>
						))} */}
					</div>
				</div>
			</div>
		</section>
	);
}
