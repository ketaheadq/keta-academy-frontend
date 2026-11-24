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
		<div className="min-h-screen bg-secondary">
			<div className="mx-auto max-w-xl space-y-5 px-4 py-10 sm:px-6">
				{rapor ? (
					<>
						<header>
							<p className="font-medium text-primary text-sm">{rapor.denemeBaslik}</p>
							<h1 className="mt-1 font-bold text-2xl text-foreground sm:text-3xl">
								Raporu velinle paylaş
							</h1>
							<p className="mt-2 text-muted-foreground">
								Velinin numarasını yaz, PDF raporun ona da SMS ile gönderilsin. Çağlar Hoca raporu
								velinle 15 dakikada ücretsiz değerlendirebilir.
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
					<div className="rounded-2xl border bg-white p-8 text-center">
						<h1 className="font-bold text-2xl text-foreground">Rapor bulunamadı</h1>
						<p className="mt-2 text-muted-foreground">
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
