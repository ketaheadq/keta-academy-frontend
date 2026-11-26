import { BookOpen, Clock, Mail, MessageCircle, Phone, Users } from "lucide-react";
import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { canonicalUrl } from "@/lib/seo";
import { getContactPage, type StrapiContactPage } from "@/lib/strapi";

export const metadata: Metadata = {
	title: "İletişim | KetaLearn",
	description:
		"Sorularınız, önerileriniz veya destek talepleriniz için bize ulaşın. En kısa sürede dönüş yapıyoruz.",
	alternates: { canonical: canonicalUrl("/iletisim") },
};

export default async function ContactPage() {
	let contactData: StrapiContactPage;

	try {
		contactData = await getContactPage();
	} catch (error) {
		console.error("Failed to fetch contact data:", error);
		// Fallback data in case of API failure
		contactData = {
			id: 2,
			documentId: "ijs0djga6psca0romf43blrz",
			createdAt: "2025-07-03T12:03:46.277Z",
			updatedAt: "2025-07-03T12:03:46.277Z",
			publishedAt: "2025-07-03T12:03:46.303Z",
			phone: "05451304287",
			email: "caglar_yildiz@outlook.com.tr",
			address: "",
		};
	}

	return (
		<div className="from-primary/20 to-primary/20 min-h-screen bg-linear-to-br via-white">
			{/* Hero Section */}
			<div className="from-primary to-primary text-background bg-linear-to-r py-16">
				<div className="container mx-auto px-4">
					<div className="mx-auto max-w-3xl text-center">
						<h1 className="mb-6 text-4xl font-bold md:text-5xl">Bizimle İletişime Geçin</h1>
						<p className="text-primary-foreground mb-8 text-xl">
							Sorularınız, önerileriniz veya destek talepleriniz için buradayız. Size en kısa sürede
							dönüş yapacağız.
						</p>
						<div className="flex flex-wrap justify-center gap-6 text-sm">
							<div className="flex items-center gap-2">
								<Clock className="h-4 w-4" />
								<span>24 saat içinde yanıt</span>
							</div>
							<div className="flex items-center gap-2">
								<Users className="h-4 w-4" />
								<span>Uzman destek ekibi</span>
							</div>
							<div className="flex items-center gap-2">
								<BookOpen className="h-4 w-4" />
								<span>Eğitim danışmanlığı</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-12">
				<div className="mx-auto max-w-4xl">
					{/* Contact Information */}
					<div className="mb-12 grid gap-8 md:grid-cols-2">
						{/* Contact Details Card */}
						<Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
							<CardHeader className="pb-4">
								<CardTitle className="text-foreground flex items-center gap-2 text-2xl">
									<MessageCircle className="text-primary h-6 w-6" />
									İletişim Bilgileri
								</CardTitle>
								<CardDescription>
									Bize ulaşmak için aşağıdaki bilgileri kullanabilirsiniz
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								{/* Phone */}
								<div className="bg-primary/10 hover:bg-primary/20 flex items-start gap-4 rounded-lg p-4 transition-colors">
									<div className="bg-primary rounded-lg p-2">
										<Phone className="text-background h-5 w-5" />
									</div>
									<div>
										<h3 className="text-foreground font-semibold">Telefon</h3>
										<a
											href={`tel:${contactData.phone}`}
											className="text-primary hover:text-background font-medium"
										>
											{contactData.phone}
										</a>
										<p className="text-muted-foreground mt-1 text-sm">
											Pazartesi - Cuma: 09:00 - 18:00
										</p>
									</div>
								</div>

								{/* Email */}
								<div className="bg-primary/10 hover:bg-primary/20 flex items-start gap-4 rounded-lg p-4 transition-colors">
									<div className="bg-primary rounded-lg p-2">
										<Mail className="text-background h-5 w-5" />
									</div>
									<div>
										<h3 className="text-foreground font-semibold">E-posta</h3>
										<a
											href={`mailto:${contactData.email}`}
											className="text-primary hover:text-background font-medium break-all"
										>
											{contactData.email}
										</a>
										<p className="text-muted-foreground mt-1 text-sm">
											24 saat içinde yanıt veriyoruz
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* FAQ Section */}
				<div className="mt-16">
					<Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
						<CardHeader className="pb-8 text-center">
							<CardTitle className="text-foreground mb-4 text-3xl">Sıkça Sorulan Sorular</CardTitle>
							<CardDescription className="text-lg">
								En çok merak edilen sorular ve yanıtları
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid gap-8 md:grid-cols-2">
								<div className="space-y-6">
									<div className="border-primary bg-primary/10 rounded-lg border-l-4 p-6">
										<h3 className="text-foreground mb-2 font-semibold">
											Özel ders nasıl alabilirim?
										</h3>
										<p className="text-muted-foreground">
											Öğretmenler sayfamızdan size uygun öğretmeni seçebilir, randevu alabilir ve
											online veya yüz yüze ders alabilirsiniz.
										</p>
									</div>

									<div className="border-primary bg-primary/10 rounded-lg border-l-4 p-6">
										<h3 className="text-foreground mb-2 font-semibold">
											Ders içerikleri ücretsiz mi?
										</h3>
										<p className="text-muted-foreground">
											Temel ders içeriklerimiz ücretsizdir. Özel dersler için ücretlendirme
											yapılmaktadır.
										</p>
									</div>
								</div>

								<div className="space-y-6">
									<div className="border-primary bg-primary/10 rounded-lg border-l-4 p-6">
										<h3 className="text-foreground mb-2 font-semibold">
											Teknik destek nasıl alabilirim?
										</h3>
										<p className="text-muted-foreground">
											Teknik sorunlarınız için telefon veya e-posta ile bizimle iletişime
											geçebilirsiniz.
										</p>
									</div>

									<div className="border-accent bg-accent/10 rounded-lg border-l-4 p-6">
										<h3 className="text-foreground mb-2 font-semibold">
											Öğretmen olmak istiyorum, nasıl başvurabilirim?
										</h3>
										<p className="text-muted-foreground">
											CV'nizi e-posta adresimize gönderebilir veya telefon ile iletişime
											geçebilirsiniz.
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
