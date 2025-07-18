"use client";

import { StrapiVideo } from "@/lib/strapi";
import VideoCard from "@/components/video-card";
import DynamicListing from "./dynamic-listing";

interface VideoListingProps {
    videos: StrapiVideo[];
    title: React.ReactNode;
}

export default function VideoListing({ videos, title }: VideoListingProps) {
    return (
        <DynamicListing
            items={videos}
            title={title}
            renderItem={(video) => (
                <VideoCard 
                    key={video.id} 
                    video={video} 
                    showRelatedData={true}
                />
            )}
            maxItems={3}
            gridColumns={{ md: 2, lg: 3 }}
        />
    )
} 