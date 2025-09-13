"use client";

import { Calendar, Play, Star } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { StrapiVideo } from "@/lib/strapi";

interface VideoCardProps {
	video: StrapiVideo;
	showRelatedData?: boolean;
}

export default function VideoCard({ video }: VideoCardProps) {
	// Extract YouTube video ID from href for thumbnail
	const getYouTubeVideoId = (url: string): string | null => {
		const patterns = [
			/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
			/youtube\.com\/v\/([^&\n?#]+)/,
			/youtu\.be\/([^&\n?#]+)/,
		];

		for (const pattern of patterns) {
			const match = url.match(pattern);
			if (match?.[1]) {
				return match[1];
			}
		}
		return null;
	};

	const videoId = getYouTubeVideoId(video.href);
	const thumbnailUrl = videoId
		? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
		: "/placeholder.svg";

	// Generate internal video page URL
	const getVideoPageUrl = () => {
		if (video.page?.slug) {
			return `/sayfalar/${video.page.slug}/${video.slug}`;
		}
		// Fallback: if no page is associated, you might want to handle this differently
		return `/videolar/${video.slug}`; // or whatever your fallback route is
	};

	return (
		<Card className="py-0 transition-shadow hover:shadow-lg">
			<CardContent className="p-0">
				<div className="relative">
					<img
						src={thumbnailUrl}
						alt={video.title}
						className="h-48 w-full rounded-t-lg object-cover"
						onError={(e) => {
							e.currentTarget.src = "/placeholder.svg";
						}}
					/>
					<div className="absolute top-2 left-2">
						<Badge variant="secondary">
							<Calendar className="mr-1 h-3 w-3" />
							{new Date(video.publishedAt).toLocaleDateString("tr-TR")}
						</Badge>
					</div>

					<div className="absolute top-2 right-2">
						{video.isPopular && (
							<Badge className="bg-blue-500">
								<Star className="mr-1 h-3 w-3" />
								Popüler
							</Badge>
						)}
					</div>
				</div>
				<div className="p-4">
					<h3 className="mb-2 line-clamp-2 font-semibold text-gray-900">{video.title}</h3>

					{/* Page Reference */}
					{video.page && (
						<div className="mb-3 text-gray-500 text-xs">
							<strong>Sayfa:</strong> {video.page.title}
						</div>
					)}

					<Link href={getVideoPageUrl()}>
						<Button className="w-full">
							<Play className="mr-2 h-4 w-4" />
							Videoyu İzle
						</Button>
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
