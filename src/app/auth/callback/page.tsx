"use client";

import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth-store";

export default function AuthCallbackPage() {
	const searchParams = useSearchParams();
	const { handleAuthRedirect, error, isLoading } = useAuthStore();

	useEffect(() => {
		const processCallback = async () => {
			// Check if we have any parameters (error or success)
			const hasParams = searchParams.toString().length > 0;

			if (!hasParams) {
				console.error("No parameters found in callback URL");
				return;
			}

			// Process the authentication with all search parameters
			await handleAuthRedirect(searchParams);
		};

		processCallback();
	}, [searchParams, handleAuthRedirect]);

	if (error) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-secondary px-4">
				<Card className="w-full max-w-md">
					<CardContent className="p-6 text-center">
						<AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
						<h2 className="mb-2 font-semibold text-foreground text-xl">Giriş Başarısız</h2>
						<p className="mb-4 text-muted-foreground">{error}</p>
						<div className="space-y-2">
							<Button
								onClick={() => {
									globalThis.location.href = "/giris";
								}}
								className="w-full"
							>
								Tekrar Deneyin
							</Button>
							<Button
								variant="outline"
								onClick={() => {
									globalThis.location.href = "/";
								}}
								className="w-full"
							>
								Ana Sayfaya Dön
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-secondary px-4">
				<Card className="w-full max-w-md">
					<CardContent className="p-6 text-center">
						<Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
						<h2 className="mb-2 font-semibold text-foreground text-xl">Giriş Yapılıyor...</h2>
						<p className="text-muted-foreground">Hesabınız doğrulanıyor, lütfen bekleyin.</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Success state (this should be brief as user gets redirected)
	return (
		<div className="flex min-h-screen items-center justify-center bg-secondary px-4">
			<Card className="w-full max-w-md">
				<CardContent className="p-6 text-center">
					<CheckCircle className="mx-auto mb-4 h-12 w-12 text-primary" />
					<h2 className="mb-2 font-semibold text-foreground text-xl">Giriş Başarılı!</h2>
					<p className="text-muted-foreground">Yönlendiriliyorsunuz...</p>
				</CardContent>
			</Card>
		</div>
	);
}
