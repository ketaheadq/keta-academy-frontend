import { PageHeaderSkeleton, ReportListSkeleton } from "@/components/shared/loading-skeletons";

export default function Loading() {
	return (
		<div className="space-y-6">
			<PageHeaderSkeleton />
			<ReportListSkeleton count={5} />
		</div>
	);
}
