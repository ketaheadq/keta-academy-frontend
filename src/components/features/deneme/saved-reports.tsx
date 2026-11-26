"use client";

import { FileText, X } from "lucide-react";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { trackDeneme } from "@/lib/deneme-tracking";
import {
	getSavedReports,
	onSavedReportsChange,
	removeReport,
	type SavedReport,
} from "@/lib/saved-reports";
import { cn } from "@/lib/utils";

/** Saved reports, read after mount (localStorage isn't there during server rendering). */
function useSavedReports() {
	const [reports, setReports] = useState<SavedReport[]>([]);
	useEffect(() => {
		const load = () => setReports(getSavedReports());
		load();
		return onSavedReportsChange(load);
	}, []);
	return reports;
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
						className="flex flex-col gap-3 rounded-xl bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
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
							<button
								type="button"
								onClick={() => removeReport(report.raporKey)}
								className="text-muted-foreground hover:text-foreground rounded-md p-2"
								aria-label={`${report.denemeBaslik} raporunu bu listeden kaldır`}
								title="Bu listeden kaldır"
							>
								<X className="h-4 w-4" aria-hidden="true" />
							</button>
						</div>
					</li>
				))}
			</ul>
			<p className="text-muted-foreground mt-3 text-xs">
				Bu liste yalnızca bu cihazda saklanır. Kaldırmak raporu silmez; linkini kaydettiysen açmaya
				devam eder.
			</p>
		</section>
	);
}

/** Exam intro: tells a returning visitor they already have a report for this exam. */
export function SavedReportNotice({ denemeSlug }: Readonly<{ denemeSlug: string }>) {
	const report = useSavedReports().find((r) => r.denemeSlug === denemeSlug);
	if (!report) return null;
	return (
		<div
			role="status"
			className="mb-6 flex flex-col gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 sm:flex-row sm:items-center sm:justify-between"
		>
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
		</div>
	);
}
