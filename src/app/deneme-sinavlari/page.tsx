import type { Metadata } from "next";
import { DenemeList } from "@/components/features/deneme/deneme-list";
import { BreadcrumbNav } from "@/components/layout/breadcrum-nav";
import { getDenemeler } from "@/lib/deneme";

const PAGE_URL = `${process.env.NEXT_PUBLIC_FRONTEND_URL || "https://ketalearn.cloud"}/deneme-sinavlari`;

export const metadata: Metadata = {
	title: "Ücretsiz Deneme Sınavları – LGS ve Lise Matematik | KetaLearn",
	description:
		"Kayıt olmadan ücretsiz LGS ve lise matematik denemesi çöz, netini hemen gör, eksik konularını öğren.",
	alternates: { canonical: PAGE_URL },
	openGraph: {
		title: "Ücretsiz Deneme Sınavları | KetaLearn",
		description: "Kayıt olmadan ücretsiz deneme çöz, netini hemen gör.",
		url: PAGE_URL,
		siteName: "KetaLearn",
		locale: "tr_TR",
		type: "website",
	},
};

export default async function DenemeSinavlariPage() {
	const denemeler = await getDenemeler();
	return (
		<div className="min-h-screen">
			<BreadcrumbNav breadcrumbs={[{ label: "Deneme Sınavları", href: "/deneme-sinavlari" }]} />
			<div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="mb-8">
					<h1 className="text-foreground text-3xl font-bold sm:text-4xl">
						Ücretsiz Deneme Sınavları
					</h1>
					<p className="text-muted-foreground mt-3 max-w-2xl text-lg">
						Kayıt olmadan çöz, netini hemen gör. Hangi konularda eksik olduğunu gösteren detaylı
						raporu telefonuna gönderelim.
					</p>
				</div>
				<h2 className="sr-only">Denemeler</h2>
				<DenemeList denemeler={denemeler} />
			</div>
		</div>
	);
}
