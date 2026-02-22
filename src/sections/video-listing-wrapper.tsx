"use client";

import VideoCard from "@/components/shared/cards/video-card";
import type { StrapiVideo } from "@/lib/strapi";
import DynamicListing from "./dynamic-listing";

interface VideoListingProps {
	videos: StrapiVideo[];
	title: React.ReactNode;
}

export default function VideoListing({ videos, title }: Readonly<VideoListingProps>) {
	return (
		<DynamicListing
			items={videos}
			title={title}
			renderItem={(video) => <VideoCard key={video.id} video={video} showRelatedData={true} />}
			maxItems={3}
			gridColumns={{ md: 2, lg: 3 }}
		/>
	);
}
