"use client";

import { BookMarked, Brain, Clock, Trophy, Users, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

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
		<section className="relative overflow-hidden py-16 md:py-24">
			{/* Background */}
			<div className="animate-pulse-gentle from-primary/10 to-primary/10 absolute top-0 right-0 h-96 w-96 rounded-full bg-linear-to-br blur-3xl" />

			<div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="animate-fadeIn mx-auto mb-16 max-w-3xl text-center">
					<h2 className="text-foreground mb-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
						Öğrenmeyi <span className="text-primary">kolaylaştıran</span> özellikler
					</h2>
					<p className="text-muted-foreground text-lg leading-relaxed text-balance">
						Modern eğitim platformumuz, öğrenme deneyimini en üst seviyeye çıkarmak için tasarlandı.
					</p>
				</div>

				<div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
					{features.map((feature, index) => {
						const Icon = feature.icon;
						return (
							<div
								key={feature.title}
								className="group animate-slideUp"
								style={{ animationDelay: `${index * 0.1}s` }}
							>
								<Card className="border-border hover:border-primary bg-card h-full p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10">
									<div className="bg-primary/10 group-hover:bg-primary group-hover:text-background mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-110">
										<Icon className="text-primary group-hover:text-background h-7 w-7 transition-colors duration-500" />
									</div>
									<h3 className="text-foreground mb-3 text-xl font-bold tracking-tight">
										{feature.title}
									</h3>
									<p className="text-muted-foreground text-base leading-relaxed">
										{feature.description}
									</p>
								</Card>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
