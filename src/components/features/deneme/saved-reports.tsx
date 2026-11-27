"use client";

import { FileText, X } from "lucide-react";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { getMyDenemeResults } from "@/lib/deneme";
import { trackDeneme } from "@/lib/deneme-tracking";
import {
	getSavedReports,
	onSavedReportsChange,
	removeReport,
	type SavedReport,
} from "@/lib/saved-reports";
import { cn } from "@/lib/utils";
import { useJWT } from "@/stores/auth-store";

type ShownReport = SavedReport & { hesapta: boolean };

/**
 * Reports to show: the ones saved on this device (read after mount, localStorage isn't there
 * during server rendering) plus, for a signed-in member, the ones saved to their account, so
 * they appear on every device. The account's copy wins when both have the same report.
 */
function useSavedReports() {
	const jwt = useJWT();
	const [local, setLocal] = useState<SavedReport[]>([]);
	const [account, setAccount] = useState<SavedReport[]>([]);
	useEffect(() => {
		const load = () => setLocal(getSavedReports());
		load();
		return onSavedReportsChange(load);
	}, []);
	useEffect(() => {
		if (!jwt) {
			setAccount([]);
			return;
		}
		let active = true;
		getMyDenemeResults(jwt)
			.then((results) => {
				if (!active) return;
				setAccount(
					results.flatMap((r) =>
						r.rapor
							? [
									{
										raporKey: r.rapor.raporAnahtari,
										denemeSlug: r.denemeSlug ?? "",
										denemeBaslik: r.denemeBaslik,
										net: r.net,
										soruSayisi: r.soruSayisi,
										tarih: r.tarih,
									},
								]
							: [],
					),
				);
			})
			.catch(() => {
				// Offline or session expired: the device's own list still shows.
			});
		return () => {
			active = false;
		};
	}, [jwt]);
	const accountKeys = new Set(account.map((r) => r.raporKey));
	return [
		...account.map((r) => ({ ...r, hesapta: true })),
		...local.filter((r) => !accountKeys.has(r.raporKey)).map((r) => ({ ...r, hesapta: false })),
	].sort((a, b) => Date.parse(b.tarih) - Date.parse(a.tarih)) as ShownReport[];
}

const reportUrl = (raporKey: string) => `/rapor/${encodeURIComponent(raporKey)}`;
const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
const formatNet = (net: number) => net.toLocaleString("tr-TR", { maximumFractionDigits: 2 });

/** Home page: the exam reports received on this device. Renders nothing when there are none. */
export function SavedReportsSection() {
	const reports = useSavedReports();
	if (!reports.length) return null;
	return (
		<section
			aria-labelledby="kayitli-raporlar"
			className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-4 sm:mt-8 sm:p-6"
		>
			<h2
				id="kayitli-raporlar"
				className="text-foreground flex items-center gap-2 text-lg font-bold"
			>
				<FileText className="h-5 w-5 text-green-700" aria-hidden="true" />
				{reports.length === 1 ? "Deneme raporun hazır" : "Deneme raporların"}
			</h2>
			<ul className="mt-3 space-y-2">
				{reports.map((report) => (
					<li
						key={report.raporKey}
						className="bg-card flex flex-col gap-3 rounded-xl p-3 sm:flex-row sm:items-center sm:justify-between"
					>
						<div className="min-w-0">
							<p className="text-foreground truncate font-semibold">{report.denemeBaslik}</p>
							<p className="text-muted-foreground text-sm">
								{formatNet(report.net)} net · {report.soruSayisi} soru · {formatDate(report.tarih)}
							</p>
						</div>
						<div className="flex shrink-0 items-center gap-2">
							<a
								href={reportUrl(report.raporKey)}
								target="_blank"
								rel="noopener"
								onClick={() =>
									trackDeneme("rapor_ac_tiklama", report.denemeBaslik, { yer: "anasayfa" })
								}
								className={cn(buttonVariants({ size: "sm" }), "flex-1 sm:flex-none")}
							>
								<FileText aria-hidden="true" /> Raporu aç
							</a>
							{!report.hesapta && (
								<button
									type="button"
									onClick={() => removeReport(report.raporKey)}
									className="text-muted-foreground hover:text-foreground rounded-md p-2"
									aria-label={`${report.denemeBaslik} raporunu bu listeden kaldır`}
									title="Bu listeden kaldır"
								>
									<X className="h-4 w-4" aria-hidden="true" />
								</button>
							)}
						</div>
					</li>
				))}
			</ul>
			<p className="text-muted-foreground mt-3 text-xs">
				{reports.some((r) => r.hesapta)
					? "Hesabına kayıtlı raporlar her cihazda burada görünür."
					: "Bu liste yalnızca bu cihazda saklanır. Kaldırmak raporu silmez; linkini kaydettiysen açmaya devam eder. Giriş yaparak çözdüğün denemelerin raporları hesabına kaydedilir."}
			</p>
		</section>
	);
}

/** Exam intro: tells a returning visitor they already have a report for this exam. */
export function SavedReportNotice({ denemeSlug }: Readonly<{ denemeSlug: string }>) {
	const report = useSavedReports().find((r) => r.denemeSlug === denemeSlug);
	if (!report) return null;
	return (
		<output className="mb-6 flex flex-col gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 sm:flex-row sm:items-center sm:justify-between">
			<p className="text-foreground text-sm">
				Bu denemeyi {formatDate(report.tarih)} tarihinde çözdün:{" "}
				<strong>{formatNet(report.net)} net</strong>. Raporun hazır.
			</p>
			<a
				href={reportUrl(report.raporKey)}
				target="_blank"
				rel="noopener"
				onClick={() => trackDeneme("rapor_ac_tiklama", report.denemeBaslik, { yer: "deneme" })}
				className={buttonVariants({ size: "sm" })}
			>
				<FileText aria-hidden="true" /> Raporu aç
			</a>
		</output>
	);
}
