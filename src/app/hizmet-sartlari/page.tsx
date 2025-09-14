import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StrapiTermsOfService } from "@/lib/strapi";
import { getTermsAndCondition } from "@/lib/strapi";
import { extractTextFromBlocks, generateSimpleId } from "@/lib/utils";

async function TermsOfServiceContent() {
	try {
		const termsOfService: StrapiTermsOfService = await getTermsAndCondition();
		const contentText = extractTextFromBlocks(termsOfService.text);

		// Split into paragraphs and prepare with stable keys
		const paragraphs = contentText
			.split("\n\n")
			.map((text, index) => ({ text: text.trim(), key: `p-${index}` }))
			.filter((block) => block.text);

		return (
			<Card className="shadow-lg">
				<CardHeader className="border-b">
					<div className="flex items-center space-x-3">
						<div className="rounded-lg bg-green-100 p-2">
							<FileText className="h-6 w-6 text-green-600" />
						</div>
						<div>
							<CardTitle className="text-2xl">Hizmet Şartları</CardTitle>
							<p className="mt-1 text-gray-600 text-sm">
								Son güncelleme: {new Date(termsOfService.updatedAt).toLocaleDateString("tr-TR")}
							</p>
						</div>
					</div>
				</CardHeader>
				<CardContent className="p-6 sm:p-8">
					{paragraphs.length > 0 ? (
						<div className="prose prose-sm sm:prose-base max-w-none" style={{ hyphens: "auto" }}>
							{paragraphs.map(({ text, key }) => (
								<p
									key={key}
									className="overflow-wrap-anywhere mb-4 break-words text-gray-700 leading-relaxed"
								>
									{text}
								</p>
							))}
						</div>
					) : (
						<div className="py-12 text-center text-gray-500">
							<FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
							<p className="text-sm">Hizmet şartları içeriği bulunamadı.</p>
						</div>
					)}
				</CardContent>
			</Card>
		);
	} catch (error) {
		console.error("Error loading terms of service:", error);
		return (
			<Card className="shadow-lg">
				<CardContent className="p-8 text-center">
					<FileText className="mx-auto mb-4 h-12 w-12 text-gray-300" />
					<h3 className="mb-2 font-medium text-gray-900 text-lg">Yükleme Hatası</h3>
					<p className="mb-4 text-gray-600">Hizmet şartları yüklenirken bir hata oluştu.</p>
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
					<div className="rounded-lg bg-green-100 p-2">
						<FileText className="h-6 w-6 text-green-600" />
					</div>
					<div>
						<div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
						<div className="mt-2 h-4 w-32 animate-pulse rounded bg-gray-200" />
					</div>
				</div>
			</CardHeader>
			<CardContent className="p-6 sm:p-8">
				<div className="space-y-6">
					{[...Array(6)].map((_, i) => (
						<div key={generateSimpleId()} className="space-y-2">
							<div className="h-4 w-full animate-pulse rounded bg-gray-200" />
							<div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
							{i % 2 === 0 && <div className="h-4 w-4/6 animate-pulse rounded bg-gray-200" />}
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

export default function TermsOfServicePage() {
	return (
		<div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-4xl">
				{/* Header */}
				<div className="mb-8">
					<Link href="/kayit-ol">
						<Button variant="ghost" className="flex items-center gap-2">
							<ArrowLeft className="h-4 w-4" />
							<span>Kayıt Sayfasına Dön</span>
						</Button>
					</Link>
				</div>

				{/* Content */}
				<Suspense fallback={<LoadingSkeleton />}>
					<TermsOfServiceContent />
				</Suspense>

				{/* Footer */}
				<div className="mt-10 text-center">
					<p className="text-gray-600 text-sm leading-relaxed">
						Sorularınız için{" "}
						<a
							href="mailto:destek@ketaacademy.com"
							className="font-medium text-blue-600 transition-colors hover:text-blue-500"
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
