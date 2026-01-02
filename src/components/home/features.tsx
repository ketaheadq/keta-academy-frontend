"use client";

import { BookMarked, Brain, Clock, Trophy, Users, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { generateSimpleId } from "@/lib/utils";

const features = [
	{
		icon: Clock,
		title: "Kaldığın Yerden Devam Et",
		description:
			"İlerleme kaydın otomatik olarak saklanır. İstediğin zaman, istediğin yerden devam edebilirsin.",
	},
	{
		icon: Brain,
		title: "Quizlerle Pekiştir",
		description: "Her ders sonunda quizlerle öğrendiklerini test et ve bilgini kalıcı hale getir.",
	},
	{
		icon: BookMarked,
		title: "Binlerce Ücretsiz Ders",
		description: "Tüm derslerimiz tamamen ücretsiz. Sınırsız erişim, sınırsız öğrenme.",
	},
	{
		icon: Zap,
		title: "Hızlı ve Kolay",
		description: "Kullanıcı dostu arayüzümüzle öğrenme deneyimin sorunsuz ve keyifli.",
	},
	{
		icon: Trophy,
		title: "Sertifika Kazan",
		description: "Dersleri tamamla, quizleri geç ve başarı sertifikalarını kazan.",
	},
	{
		icon: Users,
		title: "Topluluk Desteği",
		description: "Binlerce öğrenciyle birlikte öğren, sorular sor ve deneyimlerini paylaş.",
	},
];

export default function Features() {
	return (
		<section className="relative py-8 md:py-16">
			{/* Background */}
			<div className="absolute top-0 right-0 h-96 w-96 animate-pulse rounded-full bg-gradient-to-br from-green-400/15 to-emerald-400/15 blur-3xl" />

			<div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mx-auto mb-16 max-w-3xl animate-fadeIn text-center">
					<h2 className="mb-4 text-balance font-bold text-3xl text-gray-900 sm:text-4xl md:text-5xl">
						Öğrenmeyi <span className="text-blue-600">kolaylaştıran</span> özellikler
					</h2>
					<p className="text-balance text-gray-600 text-lg leading-relaxed">
						Modern eğitim platformumuz, öğrenme deneyimini en üst seviyeye çıkarmak için tasarlandı.
					</p>
				</div>

				<div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
					{features.map((feature, index) => {
						const Icon = feature.icon;
						return (
							<div
								key={generateSimpleId()}
								className="group animate-slideUp"
								style={{ animationDelay: `${index * 0.1}s` }}
							>
								<Card className="h-full border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
									<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-200">
										<Icon className="h-6 w-6 text-blue-600" />
									</div>
									<h3 className="mb-2 font-semibold text-gray-900 text-xl">{feature.title}</h3>
									<p className="text-gray-600 leading-relaxed">{feature.description}</p>
								</Card>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
