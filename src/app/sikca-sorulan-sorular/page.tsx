"use client";

import {
	BookOpen,
	ChevronDown,
	GraduationCap,
	HelpCircle,
	MessageCircle,
	Sparkles,
	Users,
} from "lucide-react";
import { useState } from "react";
import { BreadcrumbNav } from "@/components/layout/breadcrum-nav";
import { Button } from "@/components/ui/button";

const faqs = [
	{
		id: "item-1",
		question: "KetaLearn nedir?",
		answer:
			"KetaLearn, üniversite sınavlarına (YKS, TYT, AYT) hazırlanan öğrencilere kapsamlı bir eğitim platformu sunar. Binlerce ücretsiz ders videosu, güncel taban puanları, blog yazıları ve interaktif içeriklerle öğrencilerin başarıya ulaşmasını hedefliyoruz.",
		icon: <BookOpen className="h-5 w-5 text-primary" />,
	},
	{
		id: "item-2",
		question: "Koçluk sistemi nasıl çalışır?",
		answer:
			"KetaLearn bünyesinde yer alan uzman rehberler ve eğitim koçları ile öğrencilerimizi birebir buluşturuyoruz. Kişiye özel çalışma programları, hedef belirleme ve motivasyon desteği ile sınav sürecini en verimli şekilde yönetmenizi sağlıyoruz.",
		icon: <Sparkles className="h-5 w-5 text-accent" />,
	},
	{
		id: "item-3",
		question: "Eğitim videolarına nasıl ulaşabilirim?",
		answer:
			"Platformumuzda yer alan 'Konular' sekmesinden istediğiniz dersi seçebilir, binlerce ücretsiz videoyu izleyerek eksiklerinizi tamamlayabilirsiniz. Ayrıca 'Videolar' sayfamızdan en güncel içeriklerimize kolayca erişebilirsiniz.",
		icon: <GraduationCap className="h-5 w-5 text-primary" />,
	},
	{
		id: "item-4",
		question: "Hocalarla nasıl iletişim kurabilirim?",
		answer:
			"Platformumuz üzerinden dilediğiniz branşta uzman hocalarımızla online görüşmeler planlayabilir, sorularınızı soraiblir ve konu anlatımı desteği alabilirsiniz. Canlı yayınlar ve interaktif soru-cevap seansları ile hocalarımız her zaman yanınızda.",
		icon: <Users className="h-5 w-5 text-primary" />,
	},
	{
		id: "item-5",
		question: "KetaLearn tamamen ücretsiz mi?",
		answer:
			"Platformumuzdaki ders videoları, taban puanları ve blog içerikleri tamamen ücretsizdir. Özel koçluk ve birebir canlı görüşmeler gibi bazı premium servislerimiz ek hizmet olarak sunulmaktadır.",
		icon: <HelpCircle className="h-5 w-5 text-primary" />,
	},
	{
		id: "item-6",
		question: "Sistemdeki ilerlememi nasıl takip edebilirim?",
		answer:
			"Üye girişi yaptıktan sonra izlediğiniz videoları ve çözdüğünüz quizleri profiliniz üzerinden takip edebilirsiniz. 'Kaldığım Yerden Devam Et' özelliği sayesinde öğrenme süreciniz asla bölünmez.",
		icon: <MessageCircle className="h-5 w-5 text-destructive" />,
	},
];

export default function FAQPage() {
	const [openId, setOpenId] = useState<string | null>("item-1");

	const toggle = (id: string) => {
		setOpenId(openId === id ? null : id);
	};

	return (
		<div className="min-h-screen animate-fadeIn">
			<BreadcrumbNav
				breadcrumbs={[{ label: "Sıkça Sorulan Sorular", href: "/sikca-sorulan-sorular" }]}
			/>

			<div className="container mx-auto max-w-4xl px-4 py-12">
				<div className="mb-16 text-center">
					<h1 className="mb-6 bg-linear-to-r from-primary to-primary bg-clip-text font-bold text-3xl text-transparent sm:text-4xl md:text-5xl">
						Sıkça Sorulan Sorular
					</h1>
					<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
						KetaLearn hakkında merak ettiğiniz her şey burada. Eğer aradığınız cevabı bulamazsanız
						bizimle iletişime geçmekten çekinmeyin.
					</p>
				</div>

				<div className="rounded-2xl border border-border bg-white p-3 shadow-blue-500/5 shadow-xl sm:p-6 md:p-8">
					<div className="w-full space-y-4">
						{faqs.map((faq) => {
							const isOpen = openId === faq.id;
							return (
								<div
									key={faq.id}
									className={`rounded-xl border border-border px-3 transition-all duration-300 sm:px-4 ${
										isOpen ? "border-primary bg-primary/10/30 shadow-sm" : "hover:bg-secondary/50"
									}`}
								>
									{/* h-auto + whitespace-normal: Button defaults to one fixed-height line, which pushed long questions off-screen on mobile */}
									<Button
										variant="ghost"
										type="button"
										aria-expanded={isOpen}
										onClick={() => toggle(faq.id)}
										className="group flex h-auto w-full items-center justify-between gap-3 whitespace-normal px-0 py-4 text-left hover:bg-transparent"
									>
										<div className="flex min-w-0 items-center gap-3 font-semibold text-base text-foreground sm:gap-4 sm:text-lg">
											<div
												className={`shrink-0 rounded-lg border border-border bg-white p-2 shadow-sm transition-transform duration-300 ${isOpen ? "scale-110" : "group-hover:scale-110"}`}
											>
												{faq.icon}
											</div>
											{faq.question}
										</div>
										<ChevronDown
											className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
										/>
									</Button>
									{/* grid-rows 0fr→1fr animates to the real height (max-h-96 clipped long answers on narrow screens) */}
									<div
										className={`grid transition-all duration-300 ease-in-out ${
											isOpen ? "grid-rows-[1fr] pb-4 opacity-100" : "grid-rows-[0fr] opacity-0"
										}`}
									>
										<p className="overflow-hidden text-base text-muted-foreground leading-relaxed sm:pl-14">
											{faq.answer}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* Contact CTA */}
				<div className="mt-20 animate-slideUp text-center">
					<div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 font-medium text-primary text-sm">
						<MessageCircle className="h-4 w-4" />
						Hala sorunuz mu var?
					</div>
					<h2 className="mb-4 font-bold text-2xl text-foreground">
						Size daha fazla yardımcı olabiliriz
					</h2>
					<p className="mb-8 text-muted-foreground">
						Hocalarımızla görüşmek veya koçluk sistemi hakkında daha fazla bilgi almak için
						tıklayın.
					</p>
					<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
						<a
							href="mailto:info@ketalearn.cloud"
							className="w-full rounded-full bg-primary px-8 py-3 font-semibold text-background shadow-blue-500/20 shadow-lg transition-all hover:scale-105 hover:bg-primary sm:w-auto"
						>
							Bize Ulaşın
						</a>
						<a
							href="/iletisim"
							className="w-full rounded-full border border-border bg-white px-8 py-3 font-semibold text-muted-foreground transition-all hover:scale-105 hover:bg-secondary sm:w-auto"
						>
							İletişim Formu
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
