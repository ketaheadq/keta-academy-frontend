import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DenemeRunner } from "@/components/features/deneme/deneme-runner";
import { BreadcrumbNav } from "@/components/layout/breadcrum-nav";
import { getDeneme, SINAV_TURU_LABEL } from "@/lib/deneme";

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://ketalearn.cloud";

type PageProps = Readonly<{ params: Promise<{ slug: string }> }>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const deneme = await getDeneme(slug);
	if (!deneme) return { title: "Deneme bulunamadı | KetaLearn" };
	// Title and URL match what people search for, e.g. "9. Sınıf Matematik 1. Dönem Ara Deneme".
	const title = deneme.SEO?.metaTitle || `${deneme.baslik} – Ücretsiz Çöz | KetaLearn`;
	const description =
		deneme.SEO?.metaDescription ||
		`${deneme.baslik}: ${deneme.soruSayisi} soru, ${deneme.sureDakika} dakika. Kayıt olmadan ücretsiz çöz, netini hemen gör.`;
	const url = `${FRONTEND_URL}/deneme-sinavlari/${deneme.slug}`;
	return {
		title,
		description: description.slice(0, 160),
		keywords: deneme.SEO?.keywords ?? undefined,
		alternates: { canonical: url },
		openGraph: {
			title,
			description: description.slice(0, 160),
			url,
			type: "website",
			siteName: "KetaLearn",
			locale: "tr_TR",
			...(deneme.SEO?.metaImage?.url && { images: [{ url: deneme.SEO.metaImage.url }] }),
		},
	};
}

export default async function DenemePage({ params }: PageProps) {
	const { slug } = await params;
	const deneme = await getDeneme(slug);
	if (!deneme) notFound();

	return (
		<div className="min-h-screen bg-secondary">
			<BreadcrumbNav
				breadcrumbs={[
					{ label: "Deneme Sınavları", href: "/deneme-sinavlari" },
					{ label: deneme.baslik, href: `/deneme-sinavlari/${deneme.slug}` },
				]}
			/>
			<div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
				<div className="mb-6">
					<p className="font-medium text-primary text-sm">
						{SINAV_TURU_LABEL[deneme.sinavTuru]}
						{deneme.sinif ? ` · ${deneme.sinif.title}` : ""}
						{deneme.ders ? ` · ${deneme.ders.title}` : ""}
					</p>
					<h1 className="mt-1 font-bold text-2xl text-foreground sm:text-3xl">{deneme.baslik}</h1>
					{deneme.aciklama && (
						<p className="mt-2 max-w-3xl text-muted-foreground">{deneme.aciklama}</p>
					)}
				</div>
				<DenemeRunner deneme={deneme} />
			</div>
		</div>
	);
}
