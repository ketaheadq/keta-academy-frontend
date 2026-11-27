import type { Metadata } from "next";
import Link from "next/link";
import { VeliForm } from "@/components/features/deneme/veli-form";
import { Button } from "@/components/ui/button";
import { getRaporOzeti } from "@/lib/deneme";

// Reached from the link in a student's PDF report: never indexed.
export const metadata: Metadata = {
	title: "Raporu velinle paylaş | KetaLearn",
	robots: { index: false, follow: false },
};

type PageProps = Readonly<{ params: Promise<{ key: string }> }>;

export default async function VeliPage({ params }: PageProps) {
	const { key } = await params;
	const rapor = await getRaporOzeti(key).catch(() => null);

	return (
		<div className="bg-secondary min-h-screen">
			<div className="mx-auto max-w-xl space-y-5 px-4 py-10 sm:px-6">
				{rapor ? (
					<>
						<header>
							<p className="text-primary text-sm font-medium">{rapor.denemeBaslik}</p>
							<h1 className="text-foreground mt-1 text-2xl font-bold sm:text-3xl">
								Raporu velinle paylaş
							</h1>
							<p className="text-muted-foreground mt-2">
								Velinin numarasını yaz; Çağlar Hoca velini arayıp raporu 15 dakikada ücretsiz
								birlikte değerlendirsin.
							</p>
						</header>
						<VeliForm raporKey={key} denemeBaslik={rapor.denemeBaslik} />
						<p className="text-center text-sm">
							<a
								href={`/rapor/${encodeURIComponent(key)}`}
								className="text-muted-foreground underline"
							>
								Raporu tekrar aç (PDF)
							</a>
						</p>
					</>
				) : (
					<div className="bg-card rounded-2xl border p-8 text-center">
						<h1 className="text-foreground text-2xl font-bold">Rapor bulunamadı</h1>
						<p className="text-muted-foreground mt-2">
							Linki rapordaki haliyle açtığınızdan emin olun.
						</p>
						<Button asChild className="mt-4">
							<Link href="/deneme-sinavlari">Deneme sınavlarına git</Link>
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
