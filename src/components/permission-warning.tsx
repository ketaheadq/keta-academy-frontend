"use client";

import { AlertTriangle, Settings, Shield } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface PermissionWarningProps {
	contentType: string;
	endpoint?: string;
}

export default function PermissionWarning({ contentType, endpoint }: PermissionWarningProps) {
	return (
		<div className="mx-auto max-w-2xl">
			<Alert className="border-orange-200 bg-orange-50">
				<AlertTriangle className="h-4 w-4 text-orange-600" />
				<AlertTitle className="text-orange-800">İçerik Yüklenemedi - İzin Hatası</AlertTitle>
				<AlertDescription className="space-y-3 text-orange-700">
					<p>
						<strong>{contentType}</strong> içeriği yüklenemiyor. Bu sorun genellikle Strapi yönetim
						panelinde gerekli izinlerin ayarlanmamış olmasından kaynaklanır.
					</p>

					<div className="rounded border border-orange-200 bg-white p-3">
						<h4 className="mb-2 flex items-center font-semibold">
							<Settings className="mr-2 h-4 w-4" />
							Çözüm Adımları:
						</h4>
						<ol className="list-inside list-decimal space-y-1 text-sm">
							<li>Strapi yönetim paneline giriş yapın</li>
							<li>
								<Badge variant="outline">Settings → Roles → Public</Badge> bölümüne gidin
							</li>
							<li>
								<strong>{contentType}</strong> koleksiyonu için{" "}
								<Badge className="bg-green-500">find</Badge> iznini etkinleştirin
							</li>
							<li>Değişiklikleri kaydedin ve sayfayı yeniden yükleyin</li>
						</ol>
					</div>

					{endpoint && (
						<div className="rounded bg-orange-100 p-2 text-orange-600 text-xs">
							<strong>Endpoint:</strong> <code className="rounded bg-white px-1">{endpoint}</code>
						</div>
					)}

					<p className="text-sm">
						<Shield className="mr-1 inline h-4 w-4" />
						Bu mesaj yalnızca geliştirme aşamasında görüntülenir.
					</p>
				</AlertDescription>
			</Alert>
		</div>
	);
}
