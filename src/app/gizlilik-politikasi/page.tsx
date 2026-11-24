"use client";

import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StrapiPrivacyPolicy } from "@/lib/strapi";
import { getPrivacyPolicy } from "@/lib/strapi";
import { extractTextFromBlocks } from "@/lib/utils";

function PrivacyPolicyContent() {
	const [privacyPolicy, setPrivacyPolicy] = useState<StrapiPrivacyPolicy | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const id = useId();

	useEffect(() => {
		const fetchPrivacyPolicy = async () => {
			try {
				setLoading(true);
				setError(null);
				const data: StrapiPrivacyPolicy = await getPrivacyPolicy();
				setPrivacyPolicy(data);
			} catch (err) {
				console.error("Error loading privacy policy:", err);
				setError("Gizlilik politikası yüklenirken bir hata oluştu.");
			} finally {
				setLoading(false);
			}
		};

		fetchPrivacyPolicy();
	}, []);

	if (loading) {
		return (
			<Card className="shadow-lg">
				<CardHeader className="border-b">
					<div className="flex items-center space-x-3">
						<div className="bg-primary/10 rounded-lg p-2">
							<FileText className="text-primary h-6 w-6" />
						</div>
						<div>
							<div className="bg-secondary h-8 w-48 animate-pulse rounded" />
							<div className="bg-secondary mt-2 h-4 w-32 animate-pulse rounded" />
						</div>
					</div>
				</CardHeader>
				<CardContent className="p-6 sm:p-8">
					<div className="space-y-6">
						{["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"].map((skId, i) => (
							<div key={skId} className="space-y-2">
								<div className="bg-secondary h-4 w-full animate-pulse rounded" />
								<div className="bg-secondary h-4 w-5/6 animate-pulse rounded" />
								{i % 2 === 0 && <div className="bg-secondary h-4 w-4/6 animate-pulse rounded" />}
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		);
	}

	if (error || !privacyPolicy) {
		return (
			<Card className="shadow-lg">
				<CardContent className="p-8 text-center">
					<FileText className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
					<h3 className="text-foreground mb-2 text-lg font-medium">Yükleme Hatası</h3>
					<p className="text-muted-foreground mb-4">
						{error || "Gizlilik politikası yüklenirken bir hata oluştu."}
					</p>
					<Button variant="outline" onClick={() => router.refresh()}>
						Tekrar Dene
					</Button>
				</CardContent>
			</Card>
		);
	}

	const contentText = extractTextFromBlocks(privacyPolicy.text);

	// Split into paragraphs and prepare with stable keys
	const paragraphs = contentText
		.split("\n\n")
		.map((text, index) => ({ text: text.trim(), key: `${id}-p-${index}` }))
		.filter((block) => block.text);

	return (
		<Card className="shadow-lg">
			<CardHeader className="border-b">
				<div className="flex items-center space-x-3">
					<div className="bg-primary/10 rounded-lg p-2">
						<FileText className="text-primary h-6 w-6" />
					</div>
					<div>
						<CardTitle className="text-2xl">Gizlilik Politikası</CardTitle>
						<p className="text-muted-foreground mt-1 text-sm">
							Son güncelleme: {new Date(privacyPolicy.updatedAt).toLocaleDateString("tr-TR")}
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
								className="overflow-wrap-anywhere text-muted-foreground mb-4 leading-relaxed wrap-break-word"
							>
								{text}
							</p>
						))}
					</div>
				) : (
					<div className="text-muted-foreground py-12 text-center">
						<FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
						<p className="text-sm">Gizlilik politikası içeriği bulunamadı.</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

export default function PrivacyPolicyPage() {
	return (
		<div className="bg-secondary min-h-screen px-4 py-12 sm:px-6 lg:px-8">
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
				<PrivacyPolicyContent />

				{/* Footer */}
				<div className="mt-10 text-center">
					<p className="text-muted-foreground text-sm leading-relaxed">
						Sorularınız için{" "}
						<a
							href="mailto:destek@ketaacademy.com"
							className="text-primary hover:text-background font-medium transition-colors"
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
