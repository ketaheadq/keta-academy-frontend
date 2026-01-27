"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CallToAction() {
	return (
		<section className="relative overflow-hidden py-16 md:py-32">
			<div className="absolute inset-0 -z-10">
				<div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 animate-pulse-gentle rounded-full bg-blue-400/10 blur-3xl" />
			</div>

			<div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-linear-to-br from-blue-600 to-indigo-700 px-6 py-16 shadow-2xl shadow-blue-500/20 sm:px-12 md:py-24">
					<div className="relative z-10 mx-auto max-w-2xl animate-slideUp text-center">
						<div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-medium text-blue-50 text-sm shadow-inner ring-1 ring-white/20 backdrop-blur-md">
							<Sparkles className="h-4 w-4 text-blue-200" />
							<span>Hemen başla, kredi kartı gerektirmez</span>
						</div>

						<h2 className="mb-6 text-balance font-bold text-3xl text-white tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
							Öğrenme yolculuğuna <span className="text-blue-200">bugün</span> başla
						</h2>

						<p className="mb-10 text-balance text-blue-100/80 text-lg leading-relaxed sm:text-xl">
							Binlerce ücretsiz derse anında erişim. Kayıt ol ve hemen öğrenmeye başla.
						</p>

						<div
							className="flex animate-fadeIn flex-col items-center justify-center gap-4 sm:flex-row"
							style={{ animationDelay: "0.3s" }}
						>
							<Button
								size="lg"
								className="group h-14 rounded-full bg-white px-10 font-bold text-base text-blue-600 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-blue-50 active:scale-95"
							>
								Ücretsiz Hesap Oluştur
								<ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="h-14 rounded-full border-white/30 bg-white/10 px-10 font-bold text-base text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20 active:scale-95"
							>
								Daha Fazla Bilgi
							</Button>
						</div>
					</div>

					{/* Decorative circles */}
					<div className="absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5" />
					<div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full bg-black/5" />
				</div>
			</div>
		</section>
	);
}
