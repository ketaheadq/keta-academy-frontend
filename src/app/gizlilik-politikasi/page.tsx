import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StrapiPrivacyPolicy } from "@/lib/strapi";
import { getPrivacyPolicy } from "@/lib/strapi";
import { extractTextFromBlocks } from "@/lib/utils";

async function PrivacyPolicyContent() {
	try {
		const privacyPolicy: StrapiPrivacyPolicy = await getPrivacyPolicy();
		const contentText = extractTextFromBlocks(privacyPolicy.text);

		return (
			<Card className="shadow-lg">
				<CardHeader className="border-b">
					<div className="flex items-center space-x-3">
						<div className="rounded-lg bg-blue-100 p-2">
							<Shield className="h-6 w-6 text-blue-600" />
						</div>
						<div>
							<CardTitle className="text-2xl">Gizlilik Politikası</CardTitle>
							<p className="mt-1 text-gray-600 text-sm">
								Son güncelleme:{" "}
								{new Date(privacyPolicy.updatedAt).toLocaleDateString("tr-TR")}
							</p>
						</div>
					</div>
				</CardHeader>
				<CardContent className="p-8">
					{contentText ? (
						<div className="prose max-w-none">
							{contentText.split("\n\n").map(
								(paragraph, index) =>
									paragraph.trim() && (
										<p
											key={index}
											className="mb-4 text-gray-700 leading-relaxed"
										>
											{paragraph.trim()}
										</p>
									),
							)}
						</div>
					) : (
						<div className="py-12 text-center">
							<Shield className="mx-auto mb-4 h-12 w-12 text-gray-300" />
							<h3 className="mb-2 font-medium text-gray-900 text-lg">
								Gizlilik Politikası Yükleniyor
							</h3>
							<p className="text-gray-600">
								Gizlilik politikası içeriği hazırlanıyor...
							</p>
						</div>
					)}
				</CardContent>
			</Card>
		);
	} catch (error) {
		console.error("Error loading privacy policy:", error);
		return (
			<Card className="shadow-lg">
				<CardContent className="p-8 text-center">
					<Shield className="mx-auto mb-4 h-12 w-12 text-gray-300" />
					<h3 className="mb-2 font-medium text-gray-900 text-lg">
						Yükleme Hatası
					</h3>
					<p className="mb-4 text-gray-600">
						Gizlilik politikası yüklenirken bir hata oluştu.
					</p>
					<Button
						variant="outline"
						onClick={() => {
							window.location.reload();
						}}
					>
						Tekrar Dene
					</Button>
				</CardContent>
			</Card>
		);
	}
}

function LoadingSkeleton() {
	return (
		<Card className="shadow-lg">
			<CardHeader className="border-b">
				<div className="flex items-center space-x-3">
					<div className="rounded-lg bg-blue-100 p-2">
						<Shield className="h-6 w-6 text-blue-600" />
					</div>
					<div>
						<div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
						<div className="mt-2 h-4 w-32 animate-pulse rounded bg-gray-200" />
					</div>
				</div>
			</CardHeader>
			<CardContent className="p-8">
				<div className="space-y-4">
					{[...Array(6)].map((_, i) => (
						<div key={i} className="space-y-2">
							<div className="h-4 animate-pulse rounded bg-gray-200" />
							<div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
							<div className="h-4 w-4/6 animate-pulse rounded bg-gray-200" />
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

export default function PrivacyPolicyPage() {
	return (
		<div className="min-h-screen bg-gray-50 py-12">
			<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<Link href="/kayit-ol">
						<Button variant="ghost" className="mb-4">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Kayıt Sayfasına Dön
						</Button>
					</Link>
				</div>

				{/* Content */}
				<Suspense fallback={<LoadingSkeleton />}>
					<PrivacyPolicyContent />
				</Suspense>

				{/* Footer */}
				<div className="mt-8 text-center">
					<p className="text-gray-600 text-sm">
						Sorularınız için{" "}
						<a
							href="mailto:destek@ketaacademy.com"
							className="text-blue-600 hover:text-blue-500"
						>
							destek@ketaacademy.com
						</a>{" "}
						adresinden bize ulaşabilirsiniz.
					</p>
				</div>
			</div>
		</div>
	);
}
