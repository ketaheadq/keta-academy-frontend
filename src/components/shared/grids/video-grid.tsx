"use client";

import { Play } from "lucide-react";
import VideoCard from "@/components/shared/cards/video-card";
import DynamicGrid from "@/components/shared/grids/dynamic-grid";
import type { StrapiVideo } from "@/lib/strapi";

interface VideoGridProps {
	items: StrapiVideo[];
	title?: string;
	showRelatedData?: boolean;
	itemsPerPage?: number;
	enablePagination?: boolean;
}

export default function VideoGrid({
	items,
	title = "Videolar",
	showRelatedData = false,
	itemsPerPage = 9,
	enablePagination,
}: Readonly<VideoGridProps>) {
	return (
		<DynamicGrid
			items={items}
			searchFields={["title"]}
			filterConfigs={[]}
			renderItem={(video: StrapiVideo) => (
				<VideoCard key={video.id} video={video} showRelatedData={showRelatedData} />
			)}
			title={title}
			itemsPerPage={itemsPerPage}
			enablePagination={enablePagination}
			emptyStateConfig={{
				icon: <Play className="mx-auto mb-4 h-12 w-12 text-gray-400" />,
				title: "Video bulunamadı",
				description: "Aradığınız kriterlere uygun video bulunamadı.",
			}}
		/>
	);
}
