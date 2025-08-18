import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CourseLoading() {
	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header Skeleton */}
			<header className="border-b bg-white shadow-sm">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center space-x-4">
							<Skeleton className="h-5 w-20" />
							<div className="h-6 w-px bg-gray-300" />
							<Skeleton className="h-6 w-64" />
						</div>
						<div className="flex items-center space-x-4">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-2 w-24" />
						</div>
					</div>
				</div>
			</header>

			<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
				<div className="grid gap-6 lg:grid-cols-3">
					{/* Main Content Skeleton */}
					<div className="space-y-6 lg:col-span-2">
						<Card>
							<CardContent className="p-0">
								<Skeleton className="aspect-video w-full rounded-t-lg" />
								<div className="p-6">
									<Skeleton className="mb-2 h-8 w-3/4" />
									<Skeleton className="mb-4 h-4 w-full" />
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-4">
											<Skeleton className="h-10 w-20" />
											<Skeleton className="h-10 w-16" />
											<Skeleton className="h-10 w-16" />
										</div>
										<Skeleton className="h-10 w-32" />
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<Skeleton className="h-6 w-48" />
							</CardHeader>
							<CardContent>
								<div className="grid gap-6 md:grid-cols-2">
									<div className="space-y-4">
										<Skeleton className="h-4 w-full" />
										<Skeleton className="h-4 w-full" />
										<Skeleton className="h-4 w-3/4" />
										<div className="space-y-2">
											<Skeleton className="h-4 w-32" />
											<Skeleton className="h-4 w-28" />
											<Skeleton className="h-4 w-36" />
										</div>
									</div>
									<Skeleton className="h-48 w-full rounded-lg" />
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Sidebar Skeleton */}
					<div className="lg:col-span-1">
						<Card>
							<CardHeader>
								<Skeleton className="h-6 w-32" />
								<Skeleton className="h-4 w-48" />
							</CardHeader>
							<CardContent className="space-y-4">
								{/* eslint-disable-next-line lint/suspicious/noArrayIndexKey */}
								{Array.from({ length: 6 }).map((_, i) => (
									<div
										key={`skeleton-${i}`}
										className="flex items-start space-x-3 p-3"
									>
										<Skeleton className="mt-1 h-5 w-5 flex-shrink-0 rounded-full" />
										<div className="flex-1 space-y-2">
											<Skeleton className="h-4 w-full" />
											<Skeleton className="h-3 w-3/4" />
										</div>
										<Skeleton className="h-3 w-8" />
									</div>
								))}
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
