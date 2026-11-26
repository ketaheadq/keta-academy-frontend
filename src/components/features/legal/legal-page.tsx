import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import RichTextRenderer from "@/components/shared/content/rich-text-renderer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StrapiBlock } from "@/lib/strapi";

type LegalDocument = { text?: StrapiBlock[] | null; updatedAt?: string } | null;

/**
 * Privacy policy, terms of service and similar pages: the text comes from a Strapi single type
 * (headings, lists and links kept), the contact e-mail from the contact page.
 */
export function LegalPage({
	title,
	document,
	email,
}: Readonly<{ title: string; document: LegalDocument; email: string | null }>) {
	const blocks = Array.isArray(document?.text) ? document.text : [];
	return (
		<div className="bg-secondary min-h-screen px-4 py-12 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-4xl">
				<div className="mb-8">
					<Button asChild variant="ghost" className="flex w-fit items-center gap-2">
						<Link href="/">
							<ArrowLeft className="h-4 w-4" aria-hidden="true" />
							<span>Ana sayfaya dön</span>
						</Link>
					</Button>
				</div>

				<Card className="shadow-lg">
					<CardHeader className="border-b">
						<div className="flex items-center space-x-3">
							<div className="bg-primary/10 rounded-lg p-2">
								<FileText className="text-primary h-6 w-6" aria-hidden="true" />
							</div>
							<div>
								<CardTitle className="text-2xl">
									<h1>{title}</h1>
								</CardTitle>
								{document?.updatedAt && (
									<p className="text-muted-foreground mt-1 text-sm">
										Son güncelleme: {new Date(document.updatedAt).toLocaleDateString("tr-TR")}
									</p>
								)}
							</div>
						</div>
					</CardHeader>
					<CardContent className="p-6 sm:p-8">
						{blocks.length > 0 ? (
							<div
								className="wrap-break-word [&_:is(h1,h2,h3):first-child]:mt-0"
								style={{ hyphens: "auto" }}
							>
								<RichTextRenderer content={blocks} />
							</div>
						) : (
							<div className="text-muted-foreground py-12 text-center">
								<FileText className="mx-auto mb-4 h-12 w-12 opacity-50" aria-hidden="true" />
								<p className="text-sm">Bu metin henüz yayınlanmadı.</p>
							</div>
						)}
					</CardContent>
				</Card>

				<p className="text-muted-foreground mt-10 text-center text-sm leading-relaxed">
					Sorularınız için{" "}
					{email ? (
						<>
							<a href={`mailto:${email}`} className="text-primary font-medium hover:underline">
								{email}
							</a>{" "}
							adresinden
						</>
					) : (
						<Link href="/iletisim" className="text-primary font-medium hover:underline">
							iletişim sayfamızdan
						</Link>
					)}{" "}
					bize ulaşabilirsiniz.
				</p>
			</div>
		</div>
	);
}
