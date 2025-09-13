import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdmissionScoreTableLoading() {
	return (
		<div className="space-y-6 animate-pulse">
			{/* Table Controls Skeleton */}
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div className="space-y-2">
					<Skeleton className="h-6 w-56 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
					<Skeleton className="h-3 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
				</div>
				<div className="flex items-center gap-3">
					<div className="relative">
						<Skeleton className="h-10 w-64 rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
						<div className="absolute left-3 top-1/2 -translate-y-1/2">
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
						<div className="bg-muted/50 px-6 py-4 border-b">
							<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
									className="grid grid-cols-1 md:grid-cols-5 gap-4 py-3 border-b border-gray-100 last:border-b-0"
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
						<div className="px-6 py-4 border-t bg-gray-50/50">
							<div className="flex items-center justify-center space-x-2">
								<div className="flex space-x-1">
									<div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce"></div>
									<div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
									<div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
