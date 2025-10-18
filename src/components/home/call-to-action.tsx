"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CallToAction() {
	return (
		<section className="relative py-12 md:py-24">
			<div className="-z-10 absolute inset-0">
				<div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-[600px] w-[600px] animate-pulse rounded-full bg-blue-400/10 blur-3xl" />
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-3xl animate-slideUp text-center">
					<div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 font-medium text-blue-800 text-sm">
						<Sparkles className="h-4 w-4" />
						<span>Hemen başla, kredi kartı gerektirmez</span>
					</div>

					<h2 className="mb-6 text-balance font-bold text-3xl text-gray-900 sm:text-4xl md:text-5xl">
						Öğrenme yolculuğuna <span className="text-blue-600">bugün</span> başla
					</h2>

					<p className="mb-10 text-balance text-gray-600 text-lg leading-relaxed">
						Binlerce ücretsiz derse anında erişim. Kayıt ol ve hemen öğrenmeye başla.
					</p>

					<div
						className="flex animate-fadeIn flex-col items-center justify-center gap-4 sm:flex-row"
						style={{ animationDelay: "0.3s" }}
					>
						<Button
							size="lg"
							className="group h-12 bg-blue-600 px-8 text-base text-white transition-all duration-200 hover:scale-105 hover:bg-blue-700"
						>
							Ücretsiz Hesap Oluştur
							<ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="h-12 border-gray-300 bg-transparent px-8 text-base text-gray-700 transition-all duration-200 hover:scale-105 hover:bg-gray-50"
						>
							Daha Fazla Bilgi
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
