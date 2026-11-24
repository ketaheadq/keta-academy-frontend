"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CallToAction() {
	return (
		<section className="relative overflow-hidden py-16 md:py-32">
			<div className="absolute inset-0 -z-10">
				<div className="animate-pulse-gentle bg-primary/10 absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
			</div>

			<div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="from-primary to-primary mx-auto max-w-4xl overflow-hidden rounded-3xl bg-linear-to-br px-6 py-16 shadow-2xl shadow-blue-500/20 sm:px-12 md:py-24">
					<div className="animate-slideUp relative z-10 mx-auto max-w-2xl text-center">
						<div className="text-primary-foreground mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium shadow-inner ring-1 ring-white/20 backdrop-blur-md">
							<Sparkles className="text-primary-foreground h-4 w-4" />
							<span>Hemen başla, kredi kartı gerektirmez</span>
						</div>

						<h2 className="text-background mb-6 text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl lg:text-6xl">
							Öğrenme yolculuğuna <span className="text-primary-foreground">bugün</span> başla
						</h2>

						<p className="text-primary-foreground/80 mb-10 text-lg leading-relaxed text-balance sm:text-xl">
							Binlerce ücretsiz derse anında erişim. Kayıt ol ve hemen öğrenmeye başla.
						</p>

						<div
							className="animate-fadeIn flex flex-col items-center justify-center gap-4 sm:flex-row"
							style={{ animationDelay: "0.3s" }}
						>
							<Button
								size="lg"
								className="group text-primary hover:bg-accent hover:text-primary-foreground h-14 rounded-full bg-white px-10 text-base font-bold shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
							>
								Ücretsiz Hesap Oluştur
								<ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="text-background hover:bg-accent hover:text-primary-foreground h-14 rounded-full border-white/30 bg-white/10 px-10 text-base font-bold backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95"
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
