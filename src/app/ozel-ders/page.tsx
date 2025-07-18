import TutoringContent from "@/components/tutoring-content"
import { getTutoringProfiles } from "@/lib/strapi"
import { Calendar, Video } from "lucide-react"

export default async function TutoringPage() {
  // Fetch tutoring profiles from Strapi
  const tutoringProfiles = await getTutoringProfiles()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Uzman Öğretmenlerle
              <span className="block text-yellow-300">Birebir Eğitim</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Alanında uzman, deneyimli öğretmenlerle birebir ders alın. Kişiselleştirilmiş öğrenme deneyimi ile
              hedeflerinize ulaşın.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">{tutoringProfiles.length}+</div>
                <div className="text-blue-100">Uzman Öğretmen</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">5000+</div>
                <div className="text-blue-100">Mutlu Öğrenci</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">95%</div>
                <div className="text-blue-100">Başarı Oranı</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">4.8</div>
                <div className="text-blue-100">Ortalama Puan</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-colors shadow-lg">
                Hemen Başla
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-colors">
                Nasıl Çalışır?
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Content */}
      <TutoringContent data={tutoringProfiles} />

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 md:p-12 text-white mb-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nasıl Çalışır?</h2>
            <p className="text-purple-100 text-lg max-w-2xl mx-auto">
              Sadece 3 adımda uzman öğretmeninizle tanışın ve öğrenmeye başlayın
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">1. Öğretmen Seç</h3>
              <p className="text-purple-100">İhtiyacınıza uygun uzman öğretmeni bulun ve profilini inceleyin</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. Ders Rezerve Et</h3>
              <p className="text-purple-100">Uygun zaman dilimini seçin ve dersinizi rezerve edin</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. Öğrenmeye Başla</h3>
              <p className="text-purple-100">Birebir online derslerle hedeflerinize ulaşın</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Hayalinizdeki Başarıya Ulaşın</h2>
          <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
            Uzman öğretmenlerimizle birebir çalışarak akademik hedeflerinizi gerçekleştirin. İlk dersinizi ücretsiz
            deneyin!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition-colors shadow-lg">
              Ücretsiz Ders Dene
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-green-600 transition-colors">
              Daha Fazla Bilgi
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
