import {
	BookOpen,
	CheckCircle,
	Clock,
	Instagram,
	Mail,
	MapPin,
	MessageCircle,
	Phone,
	Star,
	Users,
	Youtube,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getContactPage, type StrapiContactPage, type StrapiSocialMediaLink } from "@/lib/strapi";

const getSocialIcon = (platform: string) => {
	switch (platform) {
		case "instagram":
			return <Instagram className="h-5 w-5" />;
		case "youtube":
			return <Youtube className="h-5 w-5" />;
		case "tiktok":
			return (
				<svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
					<title>Tiktok</title>
					<path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
				</svg>
			);
		default:
			return <MessageCircle className="h-5 w-5" />;
	}
};

const getSocialColor = (platform: string) => {
	switch (platform) {
		case "instagram":
			return "bg-linear-to-r from-primary to-destructive hover:from-primary hover:to-destructive";
		case "youtube":
			return "bg-destructive/100 hover:bg-destructive";
		case "tiktok":
			return "bg-black hover:bg-foreground";
		default:
			return "bg-primary hover:bg-primary";
	}
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
			address: "Keklikpınarı Mah. 913. sok.",
			socialMediaLinks: [
				{
					id: 4,
					platform: "instagram",
					url: "https://chatgpt.com/c/686647b4-3c94-800b-a960-365b1fc08e3f",
				},
				{
					id: 5,
					platform: "youtube",
					url: "https://chatgpt.com/c/686647b4-3c94-800b-a960-365b1fc08e3f",
				},
				{
					id: 6,
					platform: "tiktok",
					url: "https://chatgpt.com/c/686647b4-3c94-800b-a960-365b1fc08e3f",
				},
			],
		};
	}

	return (
		<div className="min-h-screen bg-linear-to-br from-primary/20 via-white to-primary/20">
			{/* Hero Section */}
			<div className="bg-linear-to-r from-primary to-primary py-16 text-white">
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
								<div className="flex items-start gap-4 rounded-lg bg-primary/10 p-4 transition-colors hover:bg-primary/10">
									<div className="rounded-lg bg-primary p-2">
										<Phone className="h-5 w-5 text-white" />
									</div>
									<div>
										<h3 className="font-semibold text-foreground">Telefon</h3>
										<a
											href={`tel:${contactData.phone}`}
											className="font-medium text-primary hover:text-primary"
										>
											{contactData.phone}
										</a>
										<p className="mt-1 text-muted-foreground text-sm">
											Pazartesi - Cuma: 09:00 - 18:00
										</p>
									</div>
								</div>

								{/* Email */}
								<div className="flex items-start gap-4 rounded-lg bg-primary/10 p-4 transition-colors hover:bg-primary/10">
									<div className="rounded-lg bg-primary p-2">
										<Mail className="h-5 w-5 text-white" />
									</div>
									<div>
										<h3 className="font-semibold text-foreground">E-posta</h3>
										<a
											href={`mailto:${contactData.email}`}
											className="break-all font-medium text-primary hover:text-primary"
										>
											{contactData.email}
										</a>
										<p className="mt-1 text-muted-foreground text-sm">
											24 saat içinde yanıt veriyoruz
										</p>
									</div>
								</div>

								{/* Address */}
								<div className="flex items-start gap-4 rounded-lg bg-primary/10 p-4 transition-colors hover:bg-primary/10">
									<div className="rounded-lg bg-primary p-2">
										<MapPin className="h-5 w-5 text-white" />
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

						{/* Social Media Card */}
						<Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
							<CardHeader className="pb-4">
								<CardTitle className="text-foreground text-xl">Sosyal Medya</CardTitle>
								<CardDescription>Bizi sosyal medyada takip edin</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="mb-6 space-y-4">
									{contactData.socialMediaLinks.map((social: StrapiSocialMediaLink) => (
										<a
											key={social.id}
											href={social.url}
											target="_blank"
											rel="noopener noreferrer"
											className={`flex transform items-center gap-3 rounded-lg px-4 py-3 font-medium text-white transition-all hover:scale-105 ${getSocialColor(social.platform)}`}
										>
											{getSocialIcon(social.platform)}
											<span className="capitalize">{social.platform}</span>
										</a>
									))}
								</div>

								{/* Quick Stats */}
								<div className="rounded-lg bg-linear-to-r from-primary to-primary p-6 text-white">
									<h3 className="mb-4 font-semibold text-lg">Neden Bizi Seçmelisiniz?</h3>
									<div className="space-y-3">
										<div className="flex items-center gap-3">
											<Star className="h-5 w-5 text-accent/20" />
											<span>4.9/5 müşteri memnuniyeti</span>
										</div>
										<div className="flex items-center gap-3">
											<Users className="h-5 w-5 text-primary-foreground" />
											<span>10,000+ mutlu öğrenci</span>
										</div>
										<div className="flex items-center gap-3">
											<BookOpen className="h-5 w-5 text-primary/20" />
											<span>500+ ders içeriği</span>
										</div>
										<div className="flex items-center gap-3">
											<CheckCircle className="h-5 w-5 text-primary/20" />
											<span>%95 başarı oranı</span>
										</div>
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
