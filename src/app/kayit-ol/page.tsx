"use client";

import { BookOpen, Loader2, Shield, Target, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { GoogleIcon } from "@/components/ui/brand-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthError, useAuthLoading, useAuthStore } from "@/stores/auth-store";

const features = [
	{
		id: 1,
		icon: BookOpen,
		title: "1000+ Kursa Erişim",
		description: "YKS, AYT, LGS, KPSS, DGS ve daha fazlası için hazırlanmış kurslar",
		color: "text-blue-600",
	},
	{
		id: 2,
		icon: Trophy,
		title: "İlerlemenizi Takip Edin",
		description: "Başarılar kazanın ve sertifikalar alın",
		color: "text-yellow-600",
	},
	{
		id: 3,
		icon: Target,
		title: "Etkileşimli Quizler",
		description: "Bilginizi ilgi çekici değerlendirmelerle test edin",
		color: "text-green-600",
	},
	{
		id: 4,
		icon: Users,
		title: "Topluluk Oluşturun",
		description: "Diğer öğrencilerle birlikte öğrenme deneyimi yaşayın",
		color: "text-purple-600",
	},
];

export default function SignUpPage() {
	const { signInWithGoogle, clearError } = useAuthStore();
	const isLoading = useAuthLoading();
	const error = useAuthError();
	const [isSigningUp, setIsSigningUp] = useState(false);

	// Clear error when component mounts
	useEffect(() => {
		clearError();
	}, [clearError]);

	const handleGoogleSignUp = async () => {
		setIsSigningUp(true);
		clearError();

		try {
			await signInWithGoogle();
		} finally {
			setIsSigningUp(false);
		}
	};

	return (
		<div className="flex min-h-screen flex-col">
			{/* Main Content */}
			<div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
				<div className="w-full max-w-4xl">
					<div className="grid items-center gap-8 lg:grid-cols-2">
						{/* Left Side - Features */}
						<div className="space-y-8">
							<div>
								<div className="mb-4 flex items-center space-x-2">
									<Badge className="bg-blue-600">Yeni</Badge>
									<span className="text-gray-600 text-sm">Eğitim yolculuğunuzun ilk adımı</span>
								</div>
								<h1 className="mb-4 font-bold text-4xl text-gray-900">
									Öğrenme Yolculuğunuza Bugün Başlayın
								</h1>
								<p className="text-gray-600 text-xl">
									Kaliteli eğitim içeriklerine erişim sağlayın, ilerlemenizi takip edin ve akademik
									hedeflerinize ulaşın.
								</p>
							</div>

							{/* Features Grid */}
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								{features.map((feature) => {
									const IconComponent = feature.icon;
									return (
										<div
											key={feature.id}
											className="flex items-start space-x-3 rounded-lg bg-white p-4 shadow-sm"
										>
											<div className="rounded-lg bg-gray-50 p-2">
												<IconComponent className={`h-5 w-5 ${feature.color}`} />
											</div>
											<div>
												<h3 className="font-semibold text-gray-900 text-sm">{feature.title}</h3>
												<p className="mt-1 text-gray-600 text-xs">{feature.description}</p>
											</div>
										</div>
									);
								})}
							</div>
						</div>

						{/* Right Side - Sign Up Form */}
						<div className="space-y-8">
							<Card className="shadow-xl">
								<CardHeader className="pb-4 text-center">
									<CardTitle className="text-2xl">Hesabınızı Oluşturun</CardTitle>
									<CardDescription>
										Keta Akademi'ye katılın ve potansiyelinizi açığa çıkarın
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									{error && (
										<Alert variant="destructive">
											<AlertDescription>{error}</AlertDescription>
										</Alert>
									)}

									{/* Google Sign-Up Button */}
									<Button
										onClick={handleGoogleSignUp}
										disabled={isSigningUp || isLoading}
										className="h-12 w-full border border-gray-300 bg-white text-gray-900 shadow-sm hover:bg-gray-50"
										variant="outline"
									>
										{isSigningUp || isLoading ? (
											<div className="flex items-center space-x-2">
												<Loader2 className="h-5 w-5 animate-spin" />
												<span>Hesap oluşturuluyor...</span>
											</div>
										) : (
											<div className="flex items-center space-x-3">
												<GoogleIcon size={20} />
												<span className="font-medium">Google ile Kayıt Ol</span>
											</div>
										)}
									</Button>

									{/* Benefits */}
									<div className="space-y-3 border-t pt-4">
										<h4 className="font-medium text-gray-900 text-sm">Neler elde edeceksiniz:</h4>
										<div className="space-y-2">
											<div className="flex items-center space-x-3 text-gray-600 text-sm">
												<Shield className="h-4 w-4 shrink-0 text-green-600" />
												<span>Tüm kurslara ücretsiz erişim</span>
											</div>
											<div className="flex items-center space-x-3 text-gray-600 text-sm">
												<BookOpen className="h-4 w-4 shrink-0 text-blue-600" />
												<span>İlerleme takibi</span>
											</div>
											<div className="flex items-center space-x-3 text-gray-600 text-sm">
												<Users className="h-4 w-4 shrink-0 text-purple-600" />
												<span>Topluluk desteği ve etkileşim</span>
											</div>
										</div>
									</div>

									{/* Sign In Link */}
									<div className="border-t pt-4 text-center">
										<p className="text-gray-600 text-sm">
											Zaten hesabınız var mı?{" "}
											<Link href="/giris" className="font-medium text-blue-600 hover:text-blue-500">
												Buradan giriş yapın
											</Link>
										</p>
									</div>
								</CardContent>
							</Card>

							{/* Terms */}
							<p className="text-center text-gray-500 text-xs">
								Hesap oluşturarak{" "}
								<Link href="/hizmet-sartlari" className="text-blue-600 hover:text-blue-500">
									Hizmet Şartlarımızı
								</Link>{" "}
								ve{" "}
								<Link href="/gizlilik-politikasi" className="text-blue-600 hover:text-blue-500">
									Gizlilik Politikamızı
								</Link>{" "}
								kabul etmiş olursunuz
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
