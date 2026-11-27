import { Skeleton } from "@/components/ui/skeleton";

export default function AdmissionScoreTableLoading() {
	return (
		<output aria-label="Taban puanları yükleniyor" aria-busy="true" className="block space-y-6">
			<span className="sr-only">Taban puanları yükleniyor</span>
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div className="space-y-2">
					<Skeleton className="h-6 w-56" />
					<Skeleton className="h-3 w-32" />
				</div>
				<div className="flex items-center gap-3">
					<Skeleton className="h-10 w-full md:w-64" />
					<Skeleton className="h-10 w-24" />
				</div>
			</div>

			<Skeleton className="h-4 w-40" />

			<div className="bg-card overflow-hidden rounded-lg border">
				<div className="bg-muted/50 border-b px-6 py-4">
					<div className="grid grid-cols-2 gap-4 md:grid-cols-5">
						{["school", "program", "type", "score", "quota"].map((column) => (
							<Skeleton key={column} className="h-4 w-20" />
						))}
					</div>
				</div>
				<div className="px-6 py-2">
					{Array.from({ length: 10 }, (_, index) => index).map((row) => (
						<div
							key={`score-row-${row}`}
							className="grid grid-cols-2 gap-4 border-b py-3 last:border-b-0 md:grid-cols-5"
						>
							<Skeleton className="h-4 w-full max-w-24" />
							<Skeleton className="h-4 w-full max-w-24" />
							<Skeleton className="h-4 w-full max-w-20" />
							<Skeleton className="h-4 w-full max-w-24" />
							<Skeleton className="h-4 w-full max-w-20" />
						</div>
					))}
				</div>
			</div>
		</output>
	);
}
