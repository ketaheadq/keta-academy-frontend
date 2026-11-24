// components/CookieConsent.tsx
"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CookieConsent() {
	const [isVisible, setIsVisible] = useState<boolean>(false);

	useEffect(() => {
		// Check if user has already consented
		const hasConsented: string | null = localStorage.getItem("cookieConsent");
		if (!hasConsented) {
			setIsVisible(true);
		}
	}, []);

	const handleAccept = (): void => {
		localStorage.setItem("cookieConsent", "accepted");
		setIsVisible(false);

		// Enable analytics/tracking here
		const win = globalThis.window as (Window & { gtag?: (...args: unknown[]) => void }) | undefined;
		if (win?.gtag) {
			win.gtag("consent", "update", {
				analytics_storage: "granted",
			});
		}
	};

	const handleDecline = (): void => {
		localStorage.setItem("cookieConsent", "declined");
		setIsVisible(false);
	};

	if (!isVisible) return null;

	return (
		<div className="fixed right-4 bottom-4 left-4 z-50 md:right-4 md:left-auto md:max-w-md">
			<Card className="shadow-lg">
				<CardContent className="p-4">
					<div className="mb-3 flex items-start justify-between">
						<h3 className="text-sm font-semibold">Çerez Bildirimi</h3>
						<Button
							variant="ghost"
							size="sm"
							onClick={handleDecline}
							className="hover:bg-secondary h-6 w-6 p-0"
						>
							<X className="h-4 w-4" />
						</Button>
					</div>

					<p className="text-muted-foreground mb-4 text-sm">
						Çerezleri kullanarak deneyiminizi ve site kullanımınızı iyileştirmek için kullanıyoruz.{" "}
						<a href="/gizlilik-politikasi" className="hover:text-foreground underline">
							Daha fazla bilgi al
						</a>
					</p>

					<div className="flex gap-2">
						<Button onClick={handleAccept} size="sm" className="flex-1">
							Kabul Et
						</Button>
						<Button onClick={handleDecline} variant="outline" size="sm" className="flex-1">
							Reddet
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
