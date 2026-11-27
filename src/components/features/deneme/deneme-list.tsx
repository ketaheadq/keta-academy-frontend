"use client";

import { AnimatePresence, m } from "motion/react";
import { useState } from "react";
import { type DenemeSummary, SINAV_TURU_LABEL } from "@/lib/deneme";
import { DURATION, EASE_OUT } from "@/lib/motion";
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

	const matchesFilter = (deneme: DenemeSummary) => {
		if (filter.kind === "all") return true;
		if (filter.kind === "tur") return deneme.sinavTuru === filter.value;
		return deneme.sinavTuru === "Okul" && deneme.sinif?.slug === filter.value;
	};
	const visible = denemeler.filter(matchesFilter);

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
								"rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ease-out active:scale-95",
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
			{/*
				Keyed on the filter so a new result set replaces the old one as a whole:
				the cards that were already there fade out, the survivors settle back in.
				Per-card layout animation would be smoother but needs the `layout` feature,
				which measures and reflows — not worth it for a grid this size.
			*/}
			<AnimatePresence mode="wait" initial={false}>
				<m.div
					key={JSON.stringify(filter)}
					initial={{ opacity: 0, y: 10 }}
					animate={{
						opacity: 1,
						y: 0,
						transition: {
							duration: DURATION.base,
							ease: EASE_OUT,
							staggerChildren: 0.045,
							delayChildren: 0.04,
						},
					}}
					exit={{ opacity: 0, y: -6, transition: { duration: 0.12, ease: EASE_OUT } }}
					className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
				>
					{visible.length ? (
						visible.map((deneme) => (
							<m.div
								key={deneme.documentId}
								variants={{
									initial: { opacity: 0, y: 12 },
									animate: { opacity: 1, y: 0 },
								}}
							>
								<DenemeCard deneme={deneme} />
							</m.div>
						))
					) : (
						<m.p
							variants={{
								initial: { opacity: 0, y: 12 },
								animate: { opacity: 1, y: 0 },
							}}
							className="text-muted-foreground bg-card col-span-full rounded-xl border p-8 text-center"
						>
							Bu filtrede henüz deneme yok. Yakında eklenecek.
						</m.p>
					)}
				</m.div>
			</AnimatePresence>
		</div>
	);
}
