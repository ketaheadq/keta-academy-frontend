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
								<h1 className="mb-4 font-bold text-4xl text-foreground">
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
											className="flex items-start space-x-3 rounded-lg bg-white p-4 shadow-sm"
										>
											<div className="rounded-lg bg-secondary p-2">
												<IconComponent className={`h-5 w-5 ${feature.color}`} />
											</div>
											<div>
												<h3 className="font-semibold text-foreground text-sm">{feature.title}</h3>
												<p className="mt-1 text-muted-foreground text-xs">{feature.description}</p>
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
										className="h-12 w-full border border-border bg-white text-foreground shadow-sm hover:bg-secondary"
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
										<h4 className="font-medium text-foreground text-sm">Neler elde edeceksiniz:</h4>
										<div className="space-y-2">
											<div className="flex items-center space-x-3 text-muted-foreground text-sm">
												<Shield className="h-4 w-4 shrink-0 text-primary" />
												<span>Tüm kurslara ücretsiz erişim</span>
											</div>
											<div className="flex items-center space-x-3 text-muted-foreground text-sm">
												<BookOpen className="h-4 w-4 shrink-0 text-primary" />
												<span>İlerleme takibi</span>
											</div>
											<div className="flex items-center space-x-3 text-muted-foreground text-sm">
												<Users className="h-4 w-4 shrink-0 text-primary" />
												<span>Topluluk desteği ve etkileşim</span>
											</div>
										</div>
									</div>

									{/* Sign In Link */}
									<div className="border-t pt-4 text-center">
										<p className="text-muted-foreground text-sm">
											Zaten hesabınız var mı?{" "}
											<Link href="/giris" className="font-medium text-primary hover:text-primary">
												Buradan giriş yapın
											</Link>
										</p>
									</div>
								</CardContent>
							</Card>

							{/* Terms */}
							<p className="text-center text-muted-foreground text-xs">
								Hesap oluşturarak{" "}
								<Link href="/hizmet-sartlari" className="text-primary hover:text-primary">
									Hizmet Şartlarımızı
								</Link>{" "}
								ve{" "}
								<Link href="/gizlilik-politikasi" className="text-primary hover:text-primary">
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
