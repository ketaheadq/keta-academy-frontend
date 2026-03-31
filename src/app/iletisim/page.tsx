import { BookOpen, Clock, Mail, MapPin, MessageCircle, Phone, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getContactPage, type StrapiContactPage } from "@/lib/strapi";

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
			address: "Keklikpınarı Mah. 913. sok.",
		};
	}

	return (
		<div className="min-h-screen bg-linear-to-br from-primary/20 via-white to-primary/20">
			{/* Hero Section */}
			<div className="bg-linear-to-r from-primary to-primary py-16 text-background">
				<div className="container mx-auto px-4">
					<div className="mx-auto max-w-3xl text-center">
						<h1 className="mb-6 font-bold text-4xl md:text-5xl">Bizimle İletişime Geçin</h1>
						<p className="mb-8 text-primary-foreground text-xl">
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
								<CardTitle className="flex items-center gap-2 text-2xl text-foreground">
									<MessageCircle className="h-6 w-6 text-primary" />
									İletişim Bilgileri
								</CardTitle>
								<CardDescription>
									Bize ulaşmak için aşağıdaki bilgileri kullanabilirsiniz
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								{/* Phone */}
								<div className="flex items-start gap-4 rounded-lg bg-primary/10 p-4 transition-colors hover:bg-primary/20">
									<div className="rounded-lg bg-primary p-2">
										<Phone className="h-5 w-5 text-background" />
									</div>
									<div>
										<h3 className="font-semibold text-foreground">Telefon</h3>
										<a
											href={`tel:${contactData.phone}`}
											className="font-medium text-primary hover:text-background"
										>
											{contactData.phone}
										</a>
										<p className="mt-1 text-muted-foreground text-sm">
											Pazartesi - Cuma: 09:00 - 18:00
										</p>
									</div>
								</div>

								{/* Email */}
								<div className="flex items-start gap-4 rounded-lg bg-primary/10 p-4 transition-colors hover:bg-primary/20">
									<div className="rounded-lg bg-primary p-2">
										<Mail className="h-5 w-5 text-background" />
									</div>
									<div>
										<h3 className="font-semibold text-foreground">E-posta</h3>
										<a
											href={`mailto:${contactData.email}`}
											className="break-all font-medium text-primary hover:text-background"
										>
											{contactData.email}
										</a>
										<p className="mt-1 text-muted-foreground text-sm">
											24 saat içinde yanıt veriyoruz
										</p>
									</div>
								</div>

								{/* Address */}
								<div className="flex items-start gap-4 rounded-lg bg-primary/10 p-4 transition-colors hover:bg-primary/20">
									<div className="rounded-lg bg-primary p-2">
										<MapPin className="h-5 w-5 text-background" />
									</div>
									<div>
										<h3 className="font-semibold text-foreground">Adres</h3>
										<p className="font-medium text-primary">{contactData.address}</p>
										<p className="mt-1 text-muted-foreground text-sm">
											Ofis ziyaretleri randevu ile
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
							<CardTitle className="mb-4 text-3xl text-foreground">Sıkça Sorulan Sorular</CardTitle>
							<CardDescription className="text-lg">
								En çok merak edilen sorular ve yanıtları
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid gap-8 md:grid-cols-2">
								<div className="space-y-6">
									<div className="rounded-lg border-primary border-l-4 bg-primary/10 p-6">
										<h3 className="mb-2 font-semibold text-foreground">
											Özel ders nasıl alabilirim?
										</h3>
										<p className="text-muted-foreground">
											Öğretmenler sayfamızdan size uygun öğretmeni seçebilir, randevu alabilir ve
											online veya yüz yüze ders alabilirsiniz.
										</p>
									</div>

									<div className="rounded-lg border-primary border-l-4 bg-primary/10 p-6">
										<h3 className="mb-2 font-semibold text-foreground">
											Ders içerikleri ücretsiz mi?
										</h3>
										<p className="text-muted-foreground">
											Temel ders içeriklerimiz ücretsizdir. Özel dersler için ücretlendirme
											yapılmaktadır.
										</p>
									</div>
								</div>

								<div className="space-y-6">
									<div className="rounded-lg border-primary border-l-4 bg-primary/10 p-6">
										<h3 className="mb-2 font-semibold text-foreground">
											Teknik destek nasıl alabilirim?
										</h3>
										<p className="text-muted-foreground">
											Teknik sorunlarınız için telefon veya e-posta ile bizimle iletişime
											geçebilirsiniz.
										</p>
									</div>

									<div className="rounded-lg border-accent border-l-4 bg-accent/10 p-6">
										<h3 className="mb-2 font-semibold text-foreground">
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
