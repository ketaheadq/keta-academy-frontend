import { useId } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdmissionScoreTableLoading() {
	const _baseId = useId();
	return (
		<div className="animate-pulse space-y-6">
			{/* Table Controls Skeleton */}
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div className="space-y-2">
					<Skeleton className="from-muted via-muted to-muted h-6 w-56 bg-linear-to-r" />
					<Skeleton className="from-muted via-muted to-muted h-3 w-32 bg-linear-to-r" />
				</div>
				<div className="flex items-center gap-3">
					<div className="relative">
						<Skeleton className="from-muted via-muted to-muted h-10 w-64 rounded-lg bg-linear-to-r" />
						<div className="absolute top-1/2 left-3 -translate-y-1/2">
							<Skeleton className="bg-muted h-4 w-4 rounded" />
						</div>
					</div>
					<Skeleton className="from-muted via-muted to-muted h-10 w-24 rounded-lg bg-linear-to-r" />
				</div>
			</div>

			{/* Results Count Skeleton */}
			<Skeleton className="from-muted via-muted to-muted h-4 w-40 bg-linear-to-r" />

			{/* Table Skeleton */}
			<Card className="overflow-hidden shadow-sm">
				<CardContent className="p-0">
					<div className="rounded-lg border bg-white">
						{/* Table Header */}
						<div className="bg-muted/50 border-b px-6 py-4">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-5">
								<Skeleton className="from-muted via-muted to-muted h-4 w-20 bg-linear-to-r" />
								<Skeleton className="from-muted via-muted to-muted h-4 w-24 bg-linear-to-r" />
								<Skeleton className="from-muted via-muted to-muted h-4 w-16 bg-linear-to-r" />
								<Skeleton className="from-muted via-muted to-muted h-4 w-20 bg-linear-to-r" />
								<Skeleton className="from-muted via-muted to-muted h-4 w-18 bg-linear-to-r" />
							</div>
						</div>

						{/* Table Rows */}
						<div className="px-6 py-2">
							{[
								"row-1",
								"row-2",
								"row-3",
								"row-4",
								"row-5",
								"row-6",
								"row-7",
								"row-8",
								"row-9",
								"row-10",
							].map((rowId, index) => (
								<div
									key={rowId}
									className="border-border grid grid-cols-1 gap-4 border-b py-3 last:border-b-0 md:grid-cols-5"
									style={{
										animationDelay: `${index * 100}ms`,
									}}
								>
									<Skeleton className="from-muted via-muted to-muted h-4 w-full max-w-24 bg-linear-to-r" />
									<Skeleton className="from-muted via-muted to-muted h-4 w-full max-w-24 bg-linear-to-r" />
									<Skeleton className="from-muted via-muted to-muted h-4 w-full max-w-20 bg-linear-to-r" />
									<Skeleton className="from-muted via-muted to-muted h-4 w-full max-w-24 bg-linear-to-r" />
									<Skeleton className="from-muted via-muted to-muted h-4 w-full max-w-20 bg-linear-to-r" />
								</div>
							))}
						</div>

						{/* Loading indicator at bottom */}
						<div className="bg-secondary/50 border-t px-6 py-4">
							<div className="flex items-center justify-center space-x-2">
								<div className="flex space-x-1">
									<div className="bg-primary h-2 w-2 animate-bounce rounded-full" />
									<div
										className="bg-primary h-2 w-2 animate-bounce rounded-full"
										style={{ animationDelay: "0.1s" }}
									/>
									<div
										className="bg-primary h-2 w-2 animate-bounce rounded-full"
										style={{ animationDelay: "0.2s" }}
									/>
								</div>
								<Skeleton className="from-primary/20 via-primary/20 to-primary/20 h-3 w-24 bg-linear-to-r" />
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
