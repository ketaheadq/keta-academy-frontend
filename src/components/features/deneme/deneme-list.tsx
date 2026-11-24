"use client";

import { useState } from "react";
import { type DenemeSummary, SINAV_TURU_LABEL } from "@/lib/deneme";
import { cn } from "@/lib/utils";
import { DenemeCard } from "./deneme-card";

type Filter = { kind: "all" } | { kind: "tur"; value: string } | { kind: "sinif"; value: string };

/** Exam list with one-tap filters by exam type (LGS, TYT…) and grade (9. sınıf…). */
export function DenemeList({ denemeler }: Readonly<{ denemeler: DenemeSummary[] }>) {
	const [filter, setFilter] = useState<Filter>({ kind: "all" });

	// Exam types first, then grades used by school exams; only options that have exams.
	const types = [...new Set(denemeler.map((d) => d.sinavTuru))].filter((t) => t !== "Okul");
	const grades = [
		...new Map(
			denemeler
				.filter((d) => d.sinavTuru === "Okul" && d.sinif)
				.map((d) => [d.sinif?.slug, d.sinif?.title]),
		),
	] as [string, string][];
	const options: { label: string; filter: Filter }[] = [
		{ label: "Tümü", filter: { kind: "all" } },
		...types.map((t) => ({
			label: SINAV_TURU_LABEL[t],
			filter: { kind: "tur", value: t } as Filter,
		})),
		...grades.map(([slug, title]) => ({
			label: title,
			filter: { kind: "sinif", value: slug } as Filter,
		})),
	];

	const visible = denemeler.filter((d) =>
		filter.kind === "all"
			? true
			: filter.kind === "tur"
				? d.sinavTuru === filter.value
				: d.sinavTuru === "Okul" && d.sinif?.slug === filter.value,
	);

	const isActive = (f: Filter) => JSON.stringify(f) === JSON.stringify(filter);

	return (
		<div>
			{options.length > 2 && (
				<fieldset className="mb-6 flex flex-wrap gap-2">
					<legend className="sr-only">Denemeleri filtrele</legend>
					{options.map((option) => (
						<button
							key={option.label}
							type="button"
							aria-pressed={isActive(option.filter)}
							onClick={() => setFilter(option.filter)}
							className={cn(
								"rounded-full px-4 py-2 font-medium text-sm transition-colors",
								isActive(option.filter)
									? "bg-primary text-primary-foreground"
									: "bg-secondary text-muted-foreground hover:text-foreground",
							)}
						>
							{option.label}
						</button>
					))}
				</fieldset>
			)}
			{visible.length ? (
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{visible.map((deneme) => (
						<DenemeCard key={deneme.documentId} deneme={deneme} />
					))}
				</div>
			) : (
				<p className="rounded-xl border bg-white p-8 text-center text-muted-foreground">
					Bu filtrede henüz deneme yok. Yakında eklenecek.
				</p>
			)}
		</div>
	);
}
