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
		color: "text-primary",
	},
	{
		id: 2,
		icon: Trophy,
		title: "İlerlemenizi Takip Edin",
		description: "Başarılar kazanın ve sertifikalar alın",
		color: "text-accent",
	},
	{
		id: 3,
		icon: Target,
		title: "Etkileşimli Quizler",
		description: "Bilginizi ilgi çekici değerlendirmelerle test edin",
		color: "text-primary",
	},
	{
		id: 4,
		icon: Users,
		title: "Topluluk Oluşturun",
		description: "Diğer öğrencilerle birlikte öğrenme deneyimi yaşayın",
		color: "text-primary",
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
									<Badge className="bg-primary">Yeni</Badge>
									<span className="text-muted-foreground text-sm">
										Eğitim yolculuğunuzun ilk adımı
									</span>
								</div>
								<h1 className="text-foreground mb-4 text-4xl font-bold">
									Öğrenme Yolculuğunuza Bugün Başlayın
								</h1>
								<p className="text-muted-foreground text-xl">
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
											className="bg-card flex items-start space-x-3 rounded-lg p-4 shadow-sm"
										>
											<div className="bg-secondary rounded-lg p-2">
												<IconComponent className={`h-5 w-5 ${feature.color}`} />
											</div>
											<div>
												<h3 className="text-foreground text-sm font-semibold">{feature.title}</h3>
												<p className="text-muted-foreground mt-1 text-xs">{feature.description}</p>
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
										KetaLearn'e katılın ve potansiyelinizi açığa çıkarın
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
										className="border-border text-foreground hover:bg-secondary bg-card h-12 w-full border shadow-sm"
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
										<h4 className="text-foreground text-sm font-medium">Neler elde edeceksiniz:</h4>
										<div className="space-y-2">
											<div className="text-muted-foreground flex items-center space-x-3 text-sm">
												<Shield className="text-primary h-4 w-4 shrink-0" />
												<span>Tüm kurslara ücretsiz erişim</span>
											</div>
											<div className="text-muted-foreground flex items-center space-x-3 text-sm">
												<BookOpen className="text-primary h-4 w-4 shrink-0" />
												<span>İlerleme takibi</span>
											</div>
											<div className="text-muted-foreground flex items-center space-x-3 text-sm">
												<Users className="text-primary h-4 w-4 shrink-0" />
												<span>Topluluk desteği ve etkileşim</span>
											</div>
										</div>
									</div>

									{/* Sign In Link */}
									<div className="border-t pt-4 text-center">
										<p className="text-muted-foreground text-sm">
											Zaten hesabınız var mı?{" "}
											<Link
												href="/giris"
												className="accent-link text-primary inline-block font-medium"
											>
												Buradan giriş yapın
											</Link>
										</p>
									</div>
								</CardContent>
							</Card>

							{/* Terms */}
							<p className="text-muted-foreground text-center text-xs">
								Hesap oluşturarak{" "}
								<Link href="/hizmet-sartlari" className="accent-link text-primary inline-block">
									Hizmet Şartlarımızı
								</Link>{" "}
								ve{" "}
								<Link href="/gizlilik-politikasi" className="accent-link text-primary inline-block">
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
