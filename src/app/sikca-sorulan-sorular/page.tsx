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
		question: "Keta Akademi nedir?",
		answer:
			"Keta Akademi, üniversite sınavlarına (YKS, TYT, AYT) hazırlanan öğrencilere kapsamlı bir eğitim platformu sunar. Binlerce ücretsiz ders videosu, güncel taban puanları, blog yazıları ve interaktif içeriklerle öğrencilerin başarıya ulaşmasını hedefliyoruz.",
		icon: <BookOpen className="h-5 w-5 text-blue-500" />,
	},
	{
		id: "item-2",
		question: "Koçluk sistemi nasıl çalışır?",
		answer:
			"Keta Akademi bünyesinde yer alan uzman rehberler ve eğitim koçları ile öğrencilerimizi birebir buluşturuyoruz. Kişiye özel çalışma programları, hedef belirleme ve motivasyon desteği ile sınav sürecini en verimli şekilde yönetmenizi sağlıyoruz.",
		icon: <Sparkles className="h-5 w-5 text-amber-500" />,
	},
	{
		id: "item-3",
		question: "Eğitim videolarına nasıl ulaşabilirim?",
		answer:
			"Platformumuzda yer alan 'Konular' sekmesinden istediğiniz dersi seçebilir, binlerce ücretsiz videoyu izleyerek eksiklerinizi tamamlayabilirsiniz. Ayrıca 'Videolar' sayfamızdan en güncel içeriklerimize kolayca erişebilirsiniz.",
		icon: <GraduationCap className="h-5 w-5 text-purple-500" />,
	},
	{
		id: "item-4",
		question: "Hocalarla nasıl iletişim kurabilirim?",
		answer:
			"Platformumuz üzerinden dilediğiniz branşta uzman hocalarımızla online görüşmeler planlayabilir, sorularınızı soraiblir ve konu anlatımı desteği alabilirsiniz. Canlı yayınlar ve interaktif soru-cevap seansları ile hocalarımız her zaman yanınızda.",
		icon: <Users className="h-5 w-5 text-green-500" />,
	},
	{
		id: "item-5",
		question: "Keta Akademi tamamen ücretsiz mi?",
		answer:
			"Platformumuzdaki ders videoları, taban puanları ve blog içerikleri tamamen ücretsizdir. Özel koçluk ve birebir canlı görüşmeler gibi bazı premium servislerimiz ek hizmet olarak sunulmaktadır.",
		icon: <HelpCircle className="h-5 w-5 text-sky-500" />,
	},
	{
		id: "item-6",
		question: "Sistemdeki ilerlememi nasıl takip edebilirim?",
		answer:
			"Üye girişi yaptıktan sonra izlediğiniz videoları ve çözdüğünüz quizleri profiliniz üzerinden takip edebilirsiniz. 'Kaldığım Yerden Devam Et' özelliği sayesinde öğrenme süreciniz asla bölünmez.",
		icon: <MessageCircle className="h-5 w-5 text-rose-500" />,
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
				breadcrumbs={[
					{ label: "Ana Sayfa", href: "/" },
					{ label: "Sıkça Sorulan Sorular", href: "/sikca-sorulan-sorular" },
				]}
			/>

			<div className="container mx-auto max-w-4xl px-4 py-12">
				<div className="mb-16 text-center">
					<h1 className="mb-6 bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text font-bold text-4xl text-transparent md:text-5xl">
						Sıkça Sorulan Sorular
					</h1>
					<p className="mx-auto max-w-2xl text-gray-600 text-lg">
						Keta Akademi hakkında merak ettiğiniz her şey burada. Eğer aradığınız cevabı
						bulamazsanız bizimle iletişime geçmekten çekinmeyin.
					</p>
				</div>

				<div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-blue-500/5 shadow-xl md:p-8">
					<div className="w-full space-y-4">
						{faqs.map((faq) => {
							const isOpen = openId === faq.id;
							return (
								<div
									key={faq.id}
									className={`rounded-xl border border-gray-100 px-4 transition-all duration-300 ${
										isOpen ? "border-blue-100 bg-blue-50/30 shadow-sm" : "hover:bg-gray-50/50"
									}`}
								>
									<Button
										variant="secondary"
										type="button"
										onClick={() => toggle(faq.id)}
										className="group flex w-full items-center justify-between py-4 text-left"
									>
										<div className="flex items-center gap-4 font-semibold text-gray-800 text-lg">
											<div
												className={`shrink-0 rounded-lg border border-gray-50 bg-white p-2 shadow-sm transition-transform duration-300 ${isOpen ? "scale-110" : "group-hover:scale-110"}`}
											>
												{faq.icon}
											</div>
											{faq.question}
										</div>
										<ChevronDown
											className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
										/>
									</Button>
									<div
										className={`overflow-hidden transition-all duration-300 ease-in-out ${
											isOpen ? "max-h-96 pb-4 opacity-100" : "max-h-0 opacity-0"
										}`}
									>
										<p className="pt-0 pl-14 text-base text-gray-600 leading-relaxed">
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
					<div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 font-medium text-blue-600 text-sm">
						<MessageCircle className="h-4 w-4" />
						Hala sorunuz mu var?
					</div>
					<h2 className="mb-4 font-bold text-2xl text-gray-900">
						Size daha fazla yardımcı olabiliriz
					</h2>
					<p className="mb-8 text-gray-600">
						Hocalarımızla görüşmek veya koçluk sistemi hakkında daha fazla bilgi almak için
						tıklayın.
					</p>
					<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
						<a
							href="mailto:info@ketaakademi.com"
							className="w-full rounded-full bg-blue-600 px-8 py-3 font-semibold text-white shadow-blue-500/20 shadow-lg transition-all hover:scale-105 hover:bg-blue-700 sm:w-auto"
						>
							Bize Ulaşın
						</a>
						<a
							href="/iletisim"
							className="w-full rounded-full border border-gray-200 bg-white px-8 py-3 font-semibold text-gray-700 transition-all hover:scale-105 hover:bg-gray-50 sm:w-auto"
						>
							İletişim Formu
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
