"use client";

import { FileText, Loader2, Target } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { getMyDenemeResults, type MyDenemeResult } from "@/lib/deneme";
import { trackDeneme } from "@/lib/deneme-tracking";
import { cn } from "@/lib/utils";

const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
const formatNet = (net: number) => net.toLocaleString("tr-TR", { maximumFractionDigits: 2 });

/** "Deneme sonuçlarım": every exam the signed-in member solved, with its report when there is one. */
export function MyDenemeResults({ jwt }: Readonly<{ jwt: string }>) {
	const [results, setResults] = useState<MyDenemeResult[] | null>(null);
	const [error, setError] = useState(false);

	useEffect(() => {
		let active = true;
		setError(false);
		getMyDenemeResults(jwt)
			.then((data) => active && setResults(data))
			.catch(() => active && setError(true));
		return () => {
			active = false;
		};
	}, [jwt]);

	return (
		<section aria-labelledby="deneme-sonuclarim" className="mt-12">
			<h2 id="deneme-sonuclarim" className="text-foreground mb-4 text-2xl font-bold">
				Deneme sonuçlarım
			</h2>
			{error ? (
				<p className="text-destructive">
					Deneme sonuçların yüklenemedi, sayfayı yenileyip tekrar dene.
				</p>
			) : results === null ? (
				<p className="text-muted-foreground flex items-center gap-2">
					<Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Yükleniyor…
				</p>
			) : results.length === 0 ? (
				<div className="bg-secondary rounded-md border p-6 text-center">
					<p className="text-muted-foreground mb-4">
						Henüz deneme çözmedin. Giriş yapmışken çözdüğün denemeler ve raporları burada görünür.
					</p>
					<Link href="/deneme-sinavlari" className={buttonVariants()}>
						<Target aria-hidden="true" /> Ücretsiz deneme çöz
					</Link>
				</div>
			) : (
				<ul className="space-y-3">
					{results.map((r) => (
						<li
							key={`${r.tarih}-${r.denemeSlug}`}
							className="flex flex-col gap-3 rounded-xl border bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
						>
							<div className="min-w-0">
								{r.denemeSlug ? (
									<Link
										href={`/deneme-sinavlari/${r.denemeSlug}`}
										className="text-foreground font-semibold hover:underline"
									>
										{r.denemeBaslik}
									</Link>
								) : (
									<p className="text-foreground font-semibold">{r.denemeBaslik}</p>
								)}
								<p className="text-muted-foreground text-sm">
									<strong className="text-foreground">{formatNet(r.net)} net</strong> · {r.dogru}{" "}
									doğru, {r.yanlis} yanlış, {r.bos} boş · {formatDate(r.tarih)}
								</p>
							</div>
							{r.rapor?.hazir ? (
								<a
									href={`/rapor/${encodeURIComponent(r.rapor.raporAnahtari)}`}
									target="_blank"
									rel="noopener"
									onClick={() =>
										trackDeneme("rapor_ac_tiklama", r.denemeBaslik, { yer: "derslerim" })
									}
									className={cn(buttonVariants({ size: "sm" }), "shrink-0")}
								>
									<FileText aria-hidden="true" /> Raporu aç
								</a>
							) : r.rapor ? (
								<span className="text-muted-foreground flex shrink-0 items-center gap-2 text-sm">
									<Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Rapor hazırlanıyor
								</span>
							) : (
								<span className="text-muted-foreground shrink-0 text-sm">Rapor istenmedi</span>
							)}
						</li>
					))}
				</ul>
			)}
		</section>
	);
}
