"use client";

import { Calendar, Play, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { StrapiVideo } from "@/lib/strapi";

interface VideoCardProps {
	video: StrapiVideo;
	showRelatedData?: boolean;
}

export default function VideoCard({ video }: Readonly<VideoCardProps>) {
	const router = useRouter();

	// Generate internal video page URL
	const getVideoPageUrl = () => {
		if (video.page?.slug) {
			return `/sayfalar/${video.page.slug}/${video.slug}`;
		}
		// Fallback: if no page is associated, you might want to handle this differently
		return `/videolar/${video.slug}`; // or whatever your fallback route is
	};

	const handleCardClick = () => {
		router.push(getVideoPageUrl());
	};

	// Extract YouTube video ID from href for thumbnail
	const getYouTubeVideoId = (url: string): string | null => {
		const patterns = [
			/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
			/youtube\.com\/v\/([^&\n?#]+)/,
			/youtu\.be\/([^&\n?#]+)/,
		];

		for (const pattern of patterns) {
			const match = new RegExp(pattern).exec(url);
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

	return (
		<Card
			className="group cursor-pointer overflow-hidden py-0 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-lg"
			onClick={handleCardClick}
		>
			<CardContent className="p-0">
				<div className="relative overflow-hidden">
					<Image
						src={thumbnailUrl}
						alt={video.title}
						width={1280}
						height={720}
						className="h-48 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
						onError={(e) => {
							e.currentTarget.src = "/placeholder.svg";
						}}
					/>
					{/* The dim wash and the play badge arrive together, so the thumbnail reads as a control. */}
					<div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/30">
						<span className="flex h-14 w-14 scale-75 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-lg transition-[transform,opacity] duration-300 ease-out group-hover:scale-100 group-hover:opacity-100">
							<Play className="ml-0.5 h-6 w-6 text-slate-950" aria-hidden="true" />
						</span>
					</div>
					<div className="absolute top-2 left-2">
						<Badge variant="secondary">
							<Calendar className="mr-1 h-3 w-3" />
							{new Date(video.publishedAt).toLocaleDateString("tr-TR")}
						</Badge>
					</div>

					<div className="absolute top-2 right-2">
						{video.isPopular && (
							<Badge className="bg-primary">
								<Star className="mr-1 h-3 w-3" />
								Popüler
							</Badge>
						)}
					</div>
				</div>
				<div className="p-4">
					<h3 className="text-foreground group-hover:text-accent mb-2 line-clamp-2 font-semibold transition-colors">
						{video.title}
					</h3>

					{/* Page Reference */}
					{video.page && (
						<div className="text-muted-foreground mb-3 text-xs">
							<strong>Sayfa:</strong> {video.page.title}
						</div>
					)}

					<Button
						className="w-full cursor-pointer transition-transform duration-200 ease-out group-hover:scale-[1.02] active:scale-[0.98]"
						onClick={(e) => {
							e.stopPropagation();
							handleCardClick();
						}}
					>
						<Play className="mr-2 h-4 w-4" />
						Videoyu İzle
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
