import { Calendar, Video } from "lucide-react";
import TutoringContent from "@/components/tutoring-content";
import { getTutoringProfiles } from "@/lib/strapi";

export default async function TutoringPage() {
	// Fetch tutoring profiles from Strapi
	const tutoringProfiles = await getTutoringProfiles();

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
			{/* Hero Section */}
			<div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
				<div className="absolute inset-0 bg-black opacity-10" />
				<div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
					<div className="text-center">
						<h1 className="mb-6 font-bold text-5xl leading-tight md:text-6xl">
							Uzman Öğretmenlerle
							<span className="block text-yellow-300">Birebir Eğitim</span>
						</h1>
						<p className="mx-auto mb-8 max-w-3xl text-blue-100 text-xl leading-relaxed">
							Alanında uzman, deneyimli öğretmenlerle birebir ders alın.
							Kişiselleştirilmiş öğrenme deneyimi ile hedeflerinize ulaşın.
						</p>

						{/* Stats */}
						<div className="mb-8 flex flex-wrap justify-center gap-8">
							<div className="text-center">
								<div className="font-bold text-3xl text-yellow-300">
									{tutoringProfiles.length}+
								</div>
								<div className="text-blue-100">Uzman Öğretmen</div>
							</div>
							<div className="text-center">
								<div className="font-bold text-3xl text-yellow-300">5000+</div>
								<div className="text-blue-100">Mutlu Öğrenci</div>
							</div>
							<div className="text-center">
								<div className="font-bold text-3xl text-yellow-300">95%</div>
								<div className="text-blue-100">Başarı Oranı</div>
							</div>
							<div className="text-center">
								<div className="font-bold text-3xl text-yellow-300">4.8</div>
								<div className="text-blue-100">Ortalama Puan</div>
							</div>
						</div>

						<div className="flex flex-col justify-center gap-4 sm:flex-row">
							<button
								type="button"
								className="rounded-xl bg-yellow-400 px-8 py-4 font-bold text-gray-900 text-lg shadow-lg transition-colors hover:bg-yellow-300"
							>
								Hemen Başla
							</button>
							<button
								type="button"
								className="rounded-xl border-2 border-white px-8 py-4 font-bold text-lg text-white transition-colors hover:bg-white hover:text-blue-600"
							>
								Nasıl Çalışır?
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Interactive Content */}
			<TutoringContent data={tutoringProfiles} />

			{/* How It Works Section */}
			<div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
				<div className="mb-12 rounded-3xl bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white md:p-12">
					<div className="mb-12 text-center">
						<h2 className="mb-4 font-bold text-3xl md:text-4xl">
							Nasıl Çalışır?
						</h2>
						<p className="mx-auto max-w-2xl text-lg text-purple-100">
							Sadece 3 adımda uzman öğretmeninizle tanışın ve öğrenmeye başlayın
						</p>
					</div>

					<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
						<div className="text-center">
							<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white bg-opacity-20">
								<svg
									aria-label="Search Icon"
									aria-labelledby="search-icon"
									className="h-8 w-8"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<title>Search Icon</title>
									<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
								</svg>
							</div>
							<h3 className="mb-2 font-bold text-xl">1. Öğretmen Seç</h3>
							<p className="text-purple-100">
								İhtiyacınıza uygun uzman öğretmeni bulun ve profilini inceleyin
							</p>
						</div>

						<div className="text-center">
							<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white bg-opacity-20">
								<Calendar className="h-8 w-8" />
							</div>
							<h3 className="mb-2 font-bold text-xl">2. Ders Rezerve Et</h3>
							<p className="text-purple-100">
								Uygun zaman dilimini seçin ve dersinizi rezerve edin
							</p>
						</div>

						<div className="text-center">
							<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white bg-opacity-20">
								<Video className="h-8 w-8" />
							</div>
							<h3 className="mb-2 font-bold text-xl">3. Öğrenmeye Başla</h3>
							<p className="text-purple-100">
								Birebir online derslerle hedeflerinize ulaşın
							</p>
						</div>
					</div>
				</div>

				{/* CTA Section */}
				<div className="rounded-3xl bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center text-white md:p-12">
					<h2 className="mb-4 font-bold text-3xl md:text-4xl">
						Hayalinizdeki Başarıya Ulaşın
					</h2>
					<p className="mx-auto mb-8 max-w-2xl text-green-100 text-lg">
						Uzman öğretmenlerimizle birebir çalışarak akademik hedeflerinizi
						gerçekleştirin. İlk dersinizi ücretsiz deneyin!
					</p>
					<div className="flex flex-col justify-center gap-4 sm:flex-row">
						<button
							type="button"
							className="rounded-xl bg-white px-8 py-4 font-bold text-green-600 text-lg shadow-lg transition-colors hover:bg-green-50"
						>
							Ücretsiz Ders Dene
						</button>
						<button
							type="button"
							className="rounded-xl border-2 border-white px-8 py-4 font-bold text-lg text-white transition-colors hover:bg-white hover:text-green-600"
						>
							Daha Fazla Bilgi
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
