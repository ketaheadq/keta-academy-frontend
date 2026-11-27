import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function LoadingRegion({
	label,
	className,
	children,
}: Readonly<{ label: string; className?: string; children: ReactNode }>) {
	return (
		<output aria-label={label} aria-busy="true" className={cn("animate-rise block", className)}>
			<span className="sr-only">{label}</span>
			{children}
		</output>
	);
}

function TextLines({ lines = 3 }: Readonly<{ lines?: number }>) {
	return (
		<div className="space-y-3">
			{Array.from({ length: lines }, (_, index) => index).map((item) => (
				<Skeleton
					key={`line-${item}`}
					className={cn("h-4", item === lines - 1 ? "w-3/4" : "w-full")}
				/>
			))}
		</div>
	);
}

export function BreadcrumbSkeleton() {
	return (
		<div className="border-border/60 bg-muted/30 mb-4 flex min-h-12 w-full items-center gap-2 overflow-hidden border-b py-2">
			<Skeleton className="h-8 w-24 rounded-full" />
			<Skeleton className="size-3.5 shrink-0 rounded-full" />
			<Skeleton className="h-8 w-40 max-w-[50%] rounded-full" />
		</div>
	);
}

export function PageHeaderSkeleton({
	centered = false,
	description = true,
}: Readonly<{ centered?: boolean; description?: boolean }>) {
	return (
		<div className={cn("mb-8 space-y-3", centered && "text-center")}>
			<Skeleton className={cn("h-9 w-56 sm:h-10 sm:w-72", centered && "mx-auto")} />
			{description && <Skeleton className={cn("h-5 w-full max-w-xl", centered && "mx-auto")} />}
		</div>
	);
}

export function FilterBarSkeleton() {
	return (
		<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<Skeleton className="h-10 w-full sm:w-64" />
			<div className="flex gap-3">
				<Skeleton className="h-10 w-28" />
				<Skeleton className="h-10 w-28" />
			</div>
		</div>
	);
}

export function ContentCardSkeleton({ className }: Readonly<{ className?: string }>) {
	return (
		<Card className={cn("h-full overflow-hidden py-0", className)}>
			<Skeleton className="aspect-video w-full rounded-none" />
			<CardContent className="space-y-4 p-5">
				<div className="flex gap-2">
					<Skeleton className="h-5 w-16" />
					<Skeleton className="h-5 w-20" />
				</div>
				<Skeleton className="h-6 w-4/5" />
				<TextLines lines={2} />
				<Skeleton className="mt-5 h-9 w-full" />
			</CardContent>
		</Card>
	);
}

export function CardGridSkeleton({
	count = 6,
	gridClassName,
}: Readonly<{ count?: number; gridClassName?: string }>) {
	return (
		<div className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-3", gridClassName)}>
			{Array.from({ length: count }, (_, index) => index).map((item) => (
				<ContentCardSkeleton key={`skeleton-card-${item}`} />
			))}
		</div>
	);
}

export function ListingLoadingSkeleton({
	count = 6,
	centered = false,
	gridClassName,
}: Readonly<{ count?: number; centered?: boolean; gridClassName?: string }>) {
	return (
		<LoadingRegion label="İçerik listesi yükleniyor">
			<BreadcrumbSkeleton />
			<PageHeaderSkeleton centered={centered} />
			<FilterBarSkeleton />
			<CardGridSkeleton count={count} gridClassName={gridClassName} />
		</LoadingRegion>
	);
}

export function PageLoadingSkeleton() {
	return (
		<LoadingRegion label="Sayfa yükleniyor" className="space-y-8">
			<BreadcrumbSkeleton />
			<PageHeaderSkeleton />
			<Card>
				<CardContent className="space-y-5 py-8">
					<TextLines lines={6} />
				</CardContent>
			</Card>
		</LoadingRegion>
	);
}

export function HomeLoadingSkeleton() {
	return (
		<LoadingRegion label="Ana sayfa yükleniyor" className="space-y-10">
			<div className="relative overflow-hidden rounded-3xl border p-6 sm:p-10">
				<div className="max-w-xl space-y-5">
					<Skeleton className="h-4 w-32" />
					<Skeleton className="h-10 w-4/5 sm:h-14" />
					<Skeleton className="h-10 w-3/5 sm:h-14" />
					<Skeleton className="h-5 w-full max-w-md" />
					<Skeleton className="h-11 w-40 rounded-lg" />
				</div>
				<Skeleton className="absolute right-0 bottom-0 h-3/4 w-1/2 rounded-none opacity-60" />
			</div>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{Array.from({ length: 4 }, (_, index) => index).map((item) => (
					<ContentCardSkeleton key={`home-exam-${item}`} />
				))}
			</div>
			<div className="space-y-4">
				<Skeleton className="h-7 w-32" />
				<CardGridSkeleton count={3} />
			</div>
		</LoadingRegion>
	);
}

export function DetailLoadingSkeleton({
	variant = "video",
	showBreadcrumb = true,
}: Readonly<{ variant?: "video" | "tutor"; showBreadcrumb?: boolean }>) {
	return (
		<LoadingRegion label="Sayfa detayı yükleniyor">
			{showBreadcrumb && <BreadcrumbSkeleton />}
			<div className="grid gap-6 lg:grid-cols-3">
				<div className="min-w-0 space-y-6 lg:col-span-2">
					<Card className="overflow-hidden py-0">
						{variant === "video" ? (
							<Skeleton className="aspect-video w-full rounded-none" />
						) : (
							<CardContent className="p-4 sm:p-6">
								<div className="flex flex-col gap-5 sm:flex-row sm:items-center">
									<Skeleton className="h-28 w-28 shrink-0 rounded-full" />
									<div className="flex-1 space-y-3">
										<Skeleton className="h-8 w-3/4" />
										<Skeleton className="h-5 w-1/2" />
										<div className="flex gap-2">
											<Skeleton className="h-6 w-20 rounded-full" />
											<Skeleton className="h-6 w-24 rounded-full" />
										</div>
									</div>
								</div>
								<div className="mt-6 grid grid-cols-3 gap-3">
									{Array.from({ length: 3 }, (_, index) => index).map((item) => (
										<Skeleton key={`stat-${item}`} className="h-20 rounded-xl" />
									))}
								</div>
							</CardContent>
						)}
						<CardContent className="space-y-4 p-4 sm:p-6">
							<Skeleton className="h-8 w-3/4" />
							<TextLines lines={2} />
							<div className="flex gap-3 pt-2">
								<Skeleton className="h-10 w-28" />
								<Skeleton className="h-10 w-28" />
								<Skeleton className="ml-auto h-10 w-32" />
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="space-y-5">
							<Skeleton className="h-6 w-44" />
							<TextLines lines={5} />
						</CardContent>
					</Card>
				</div>
				<Card className="h-fit">
					<CardContent className="space-y-4">
						<Skeleton className="h-6 w-36" />
						<Skeleton className="h-4 w-48 max-w-full" />
						{Array.from({ length: 6 }, (_, index) => index).map((item) => (
							<div key={`detail-row-${item}`} className="flex items-center gap-3 py-2">
								<Skeleton className="h-5 w-5 shrink-0 rounded-full" />
								<div className="flex-1 space-y-2">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-3 w-2/3" />
								</div>
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		</LoadingRegion>
	);
}

const EXAM_QUESTION_NUMBERS = Array.from({ length: 20 }, (_, index) => index + 1);

export function ExamLoadingSkeleton() {
	return (
		<LoadingRegion label="Deneme sınavı yükleniyor">
			<BreadcrumbSkeleton />
			<div className="mb-6 space-y-3">
				<Skeleton className="h-4 w-40" />
				<Skeleton className="h-8 w-3/4 sm:h-9" />
				<Skeleton className="h-5 w-full max-w-2xl" />
			</div>
			<div className="grid gap-6 lg:grid-cols-3">
				<Card className="lg:col-span-2">
					<CardContent className="space-y-6">
						<div className="flex items-center justify-between gap-4">
							<Skeleton className="h-5 w-24" />
							<Skeleton className="h-9 w-28" />
						</div>
						<Skeleton className="h-2 w-full rounded-full" />
						<div className="space-y-4 pt-4">
							<Skeleton className="h-6 w-full" />
							<Skeleton className="h-6 w-4/5" />
							{["A", "B", "C", "D", "E"].map((option) => (
								<div key={option} className="flex items-center gap-3 rounded-xl border p-4">
									<Skeleton className="h-6 w-6 shrink-0 rounded-full" />
									<Skeleton className="h-4 w-4/5" />
								</div>
							))}
						</div>
						<div className="flex justify-between">
							<Skeleton className="h-10 w-28" />
							<Skeleton className="h-10 w-28" />
						</div>
					</CardContent>
				</Card>
				<Card className="h-fit">
					<CardContent className="space-y-5">
						<Skeleton className="h-6 w-36" />
						<div className="grid grid-cols-5 gap-2">
							{EXAM_QUESTION_NUMBERS.map((question) => (
								<Skeleton key={question} className="h-9 w-9 rounded-lg" />
							))}
						</div>
						<Skeleton className="h-10 w-full" />
					</CardContent>
				</Card>
			</div>
		</LoadingRegion>
	);
}

export function ArticleLoadingSkeleton() {
	return (
		<LoadingRegion label="İçerik yükleniyor">
			<BreadcrumbSkeleton />
			<div className="mx-auto max-w-4xl">
				<div className="mb-10 space-y-5 text-center">
					<Skeleton className="mx-auto h-10 w-4/5 sm:h-12" />
					<Skeleton className="mx-auto h-10 w-3/5 sm:h-12" />
					<div className="flex justify-center gap-3">
						<Skeleton className="h-8 w-28 rounded-full" />
						<Skeleton className="h-8 w-24 rounded-full" />
						<Skeleton className="h-8 w-20 rounded-full" />
					</div>
				</div>
				<Card>
					<CardContent className="space-y-6 py-8">
						<TextLines lines={12} />
					</CardContent>
				</Card>
			</div>
		</LoadingRegion>
	);
}

export function FormLoadingSkeleton() {
	return (
		<LoadingRegion label="Form yükleniyor" className="mx-auto w-full max-w-md space-y-8 py-8">
			<div className="space-y-3 text-center">
				<Skeleton className="mx-auto h-16 w-16 rounded-full" />
				<Skeleton className="mx-auto h-8 w-56" />
				<Skeleton className="mx-auto h-5 w-72 max-w-full" />
			</div>
			<Card>
				<CardContent className="space-y-5">
					<Skeleton className="h-6 w-40" />
					<Skeleton className="h-12 w-full rounded-lg" />
					<Skeleton className="h-12 w-full rounded-lg" />
					<Skeleton className="h-11 w-full rounded-lg" />
				</CardContent>
			</Card>
		</LoadingRegion>
	);
}

export function ReviewListSkeleton({ count = 3 }: Readonly<{ count?: number }>) {
	return (
		<LoadingRegion label="Değerlendirmeler yükleniyor" className="divide-y">
			{Array.from({ length: count }, (_, index) => index).map((item) => (
				<div key={`review-${item}`} className="space-y-3 py-4">
					<div className="flex items-center gap-3">
						<Skeleton className="h-5 w-28" />
						<Skeleton className="h-4 w-20" />
						<Skeleton className="ml-auto h-3 w-20" />
					</div>
					<TextLines lines={2} />
				</div>
			))}
		</LoadingRegion>
	);
}

export function ReportListSkeleton({ count = 3 }: Readonly<{ count?: number }>) {
	return (
		<LoadingRegion label="Raporlar yükleniyor" className="space-y-3">
			{Array.from({ length: count }, (_, index) => index).map((item) => (
				<div
					key={`report-row-${item}`}
					className="bg-card flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
				>
					<div className="flex-1 space-y-2">
						<Skeleton className="h-5 w-2/3" />
						<Skeleton className="h-4 w-1/2" />
					</div>
					<Skeleton className="h-9 w-32 shrink-0" />
				</div>
			))}
		</LoadingRegion>
	);
}
