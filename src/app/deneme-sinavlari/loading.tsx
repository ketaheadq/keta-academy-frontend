import { ListingLoadingSkeleton } from "@/components/shared/loading-skeletons";

export default function Loading() {
	return <ListingLoadingSkeleton count={4} gridClassName="lg:grid-cols-2" />;
}
