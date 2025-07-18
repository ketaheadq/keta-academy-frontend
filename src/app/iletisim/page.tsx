import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Youtube,
  Clock,
  MessageCircle,
  Users,
  BookOpen,
  Star,
  CheckCircle,
} from "lucide-react"
import { getContactPage, type StrapiContactPage, type StrapiSocialMediaLink } from "@/lib/strapi"

const getSocialIcon = (platform: string) => {
  switch (platform) {
    case "instagram":
      return <Instagram className="w-5 h-5" />
    case "youtube":
      return <Youtube className="w-5 h-5" />
    case "tiktok":
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      )
    default:
      return <MessageCircle className="w-5 h-5" />
  }
}

const getSocialColor = (platform: string) => {
  switch (platform) {
    case "instagram":
      return "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
    case "youtube":
      return "bg-red-500 hover:bg-red-600"
    case "tiktok":
      return "bg-black hover:bg-gray-800"
    default:
      return "bg-blue-500 hover:bg-blue-600"
  }
}

export default async function ContactPage() {
  let contactData: StrapiContactPage

  try {
    contactData = await getContactPage()
  } catch (error) {
    console.error("Failed to fetch contact data:", error)
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
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Bizimle İletişime Geçin</h1>
            <p className="text-xl text-blue-100 mb-8">
              Sorularınız, önerileriniz veya destek talepleriniz için buradayız. Size en kısa sürede dönüş yapacağız.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>24 saat içinde yanıt</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Uzman destek ekibi</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Eğitim danışmanlığı</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Contact Information */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Contact Details Card */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-gray-800 flex items-center gap-2">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                  İletişim Bilgileri
                </CardTitle>
                <CardDescription>Bize ulaşmak için aşağıdaki bilgileri kullanabilirsiniz</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Phone */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Telefon</h3>
                    <a href={`tel:${contactData.phone}`} className="text-blue-600 hover:text-blue-800 font-medium">
                      {contactData.phone}
                    </a>
                    <p className="text-sm text-gray-600 mt-1">Pazartesi - Cuma: 09:00 - 18:00</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
                  <div className="bg-purple-600 p-2 rounded-lg">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">E-posta</h3>
                    <a
                      href={`mailto:${contactData.email}`}
                      className="text-purple-600 hover:text-purple-800 font-medium break-all"
                    >
                      {contactData.email}
                    </a>
                    <p className="text-sm text-gray-600 mt-1">24 saat içinde yanıt veriyoruz</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                  <div className="bg-green-600 p-2 rounded-lg">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Adres</h3>
                    <p className="text-green-600 font-medium">{contactData.address}</p>
                    <p className="text-sm text-gray-600 mt-1">Ofis ziyaretleri randevu ile</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media Card */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-gray-800">Sosyal Medya</CardTitle>
                <CardDescription>Bizi sosyal medyada takip edin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {contactData.socialMediaLinks.map((social: StrapiSocialMediaLink) => (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white font-medium transition-all transform hover:scale-105 ${getSocialColor(social.platform)}`}
                    >
                      {getSocialIcon(social.platform)}
                      <span className="capitalize">{social.platform}</span>
                    </a>
                  ))}
                </div>

                {/* Quick Stats */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Neden Bizi Seçmelisiniz?</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-yellow-300" />
                      <span>4.9/5 müşteri memnuniyeti</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-blue-200" />
                      <span>10,000+ mutlu öğrenci</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-purple-200" />
                      <span>500+ ders içeriği</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-300" />
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
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl text-gray-800 mb-4">Sıkça Sorulan Sorular</CardTitle>
              <CardDescription className="text-lg">En çok merak edilen sorular ve yanıtları</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="p-6 rounded-lg bg-blue-50 border-l-4 border-blue-500">
                    <h3 className="font-semibold text-gray-800 mb-2">Özel ders nasıl alabilirim?</h3>
                    <p className="text-gray-600">
                      Öğretmenler sayfamızdan size uygun öğretmeni seçebilir, randevu alabilir ve online veya yüz yüze
                      ders alabilirsiniz.
                    </p>
                  </div>

                  <div className="p-6 rounded-lg bg-purple-50 border-l-4 border-purple-500">
                    <h3 className="font-semibold text-gray-800 mb-2">Ders içerikleri ücretsiz mi?</h3>
                    <p className="text-gray-600">
                      Temel ders içeriklerimiz ücretsizdir. Özel dersler için ücretlendirme
                      yapılmaktadır.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 rounded-lg bg-green-50 border-l-4 border-green-500">
                    <h3 className="font-semibold text-gray-800 mb-2">Teknik destek nasıl alabilirim?</h3>
                    <p className="text-gray-600">
                      Teknik sorunlarınız için telefon veya e-posta ile bizimle iletişime geçebilirsiniz.
                    </p>
                  </div>

                  <div className="p-6 rounded-lg bg-orange-50 border-l-4 border-orange-500">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Öğretmen olmak istiyorum, nasıl başvurabilirim?
                    </h3>
                    <p className="text-gray-600">
                      CV'nizi e-posta adresimize gönderebilir veya telefon ile iletişime geçebilirsiniz.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
