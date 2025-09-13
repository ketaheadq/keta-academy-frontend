import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdmissionScoreTableLoading() {
	return (
		<div className="animate-pulse space-y-6">
			{/* Table Controls Skeleton */}
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div className="space-y-2">
					<Skeleton className="h-6 w-56 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
					<Skeleton className="h-3 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
				</div>
				<div className="flex items-center gap-3">
					<div className="relative">
						<Skeleton className="h-10 w-64 rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
						<div className="-translate-y-1/2 absolute top-1/2 left-3">
							<Skeleton className="h-4 w-4 rounded bg-gray-300" />
						</div>
					</div>
					<Skeleton className="h-10 w-24 rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
				</div>
			</div>

			{/* Results Count Skeleton */}
			<Skeleton className="h-4 w-40 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />

			{/* Table Skeleton */}
			<Card className="overflow-hidden shadow-sm">
				<CardContent className="p-0">
					<div className="rounded-lg border bg-white">
						{/* Table Header */}
						<div className="border-b bg-muted/50 px-6 py-4">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-5">
								<Skeleton className="h-4 w-20 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300" />
								<Skeleton className="h-4 w-24 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300" />
								<Skeleton className="h-4 w-16 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300" />
								<Skeleton className="h-4 w-20 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300" />
								<Skeleton className="h-4 w-18 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300" />
							</div>
						</div>

						{/* Table Rows */}
						<div className="px-6 py-2">
							{Array.from({ length: 10 }).map((_, index) => (
								<div
									key={index}
									className="grid grid-cols-1 gap-4 border-gray-100 border-b py-3 last:border-b-0 md:grid-cols-5"
									style={{
										animationDelay: `${index * 100}ms`,
									}}
								>
									<Skeleton className="h-4 w-full max-w-[120px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
									<Skeleton className="h-4 w-full max-w-[150px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
									<Skeleton className="h-4 w-full max-w-[80px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
									<Skeleton className="h-4 w-full max-w-[100px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
									<Skeleton className="h-4 w-full max-w-[90px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
								</div>
							))}
						</div>

						{/* Loading indicator at bottom */}
						<div className="border-t bg-gray-50/50 px-6 py-4">
							<div className="flex items-center justify-center space-x-2">
								<div className="flex space-x-1">
									<div className="h-2 w-2 animate-bounce rounded-full bg-blue-400" />
									<div
										className="h-2 w-2 animate-bounce rounded-full bg-blue-400"
										style={{ animationDelay: "0.1s" }}
									/>
									<div
										className="h-2 w-2 animate-bounce rounded-full bg-blue-400"
										style={{ animationDelay: "0.2s" }}
									/>
								</div>
								<Skeleton className="h-3 w-24 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200" />
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
