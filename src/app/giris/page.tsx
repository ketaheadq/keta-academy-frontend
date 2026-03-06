"use client";

import { BookOpen, GraduationCap, Loader2, Shield, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GoogleIcon } from "@/components/ui/brand-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthError, useAuthLoading, useAuthStore } from "@/stores/auth-store";

export default function LoginPage() {
	const { signInWithGoogle, clearError } = useAuthStore();
	const isLoading = useAuthLoading();
	const error = useAuthError();
	const [isSigningIn, setIsSigningIn] = useState(false);

	// Clear error when component mounts
	useEffect(() => {
		clearError();
	}, [clearError]);

	const handleGoogleSignIn = async () => {
		setIsSigningIn(true);
		clearError();

		try {
			await signInWithGoogle();
		} finally {
			setIsSigningIn(false);
		}
	};

	return (
		<div className="flex min-h-screen flex-col">
			{/* Main Content */}
			<div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
				<div className="w-full max-w-md space-y-8">
					{/* Welcome Section */}
					<div className="text-center">
						<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
							<GraduationCap className="h-8 w-8 text-white" />
						</div>
						<h2 className="mb-2 font-bold text-3xl text-foreground">Tekrar Hoşgeldiniz!</h2>
						<p className="text-muted-foreground">
							Öğrenme yolculuğunuza devam etmek için giriş yapın
						</p>
					</div>

					{/* Login Card */}
					<Card className="shadow-lg">
						<CardHeader className="pb-4 text-center">
							<CardTitle className="text-xl">Keta Akademi'ye Giriş</CardTitle>
							<CardDescription>
								Kurslarınıza erişin, ilerlemenizi takip edin ve öğrenmeye devam edin
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{error && (
								<Alert variant="destructive">
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}

							{/* Google Sign-In Button */}
							<Button
								onClick={handleGoogleSignIn}
								disabled={isSigningIn || isLoading}
								className="h-12 w-full border border-border bg-white text-foreground shadow-sm hover:bg-secondary"
								variant="outline"
							>
								{isSigningIn || isLoading ? (
									<div className="flex items-center space-x-2">
										<Loader2 className="h-5 w-5 animate-spin" />
										<span>Giriş yapılıyor...</span>
									</div>
								) : (
									<div className="flex items-center space-x-3">
										<GoogleIcon size={20} />
										<span className="font-medium">Google ile Devam Et</span>
									</div>
								)}
							</Button>

							{/* Divider */}
							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<div className="w-full border-border border-t" />
								</div>
								<div className="relative flex justify-center text-sm">
									<span className="bg-white px-2 text-muted-foreground">Neden Google Girişi?</span>
								</div>
							</div>

							{/* Benefits */}
							<div className="space-y-3">
								<div className="flex items-center space-x-3 text-muted-foreground text-sm">
									<Shield className="h-4 w-4 shrink-0 text-primary" />
									<span>Güvenli ve şifrelenmiş kimlik doğrulama</span>
								</div>
								<div className="flex items-center space-x-3 text-muted-foreground text-sm">
									<Users className="h-4 w-4 shrink-0 text-primary" />
									<span>Şifre hatırlamadan hızlı erişim</span>
								</div>
								<div className="flex items-center space-x-3 text-muted-foreground text-sm">
									<BookOpen className="h-4 w-4 shrink-0 text-primary" />
									<span>İlerlemenizi tüm cihazlarda senkronize edin</span>
								</div>
							</div>

							{/* Sign Up Link */}
							<div className="border-t pt-4 text-center">
								<p className="text-muted-foreground text-sm">
									Hesabınız yok mu?{" "}
									<Link href="/kayit-ol" className="font-medium text-primary hover:text-primary">
										Buradan kayıt olun
									</Link>
								</p>
							</div>
						</CardContent>
					</Card>

					{/* Terms */}
					<p className="text-center text-muted-foreground text-xs">
						Giriş yaparak{" "}
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
	);
}
