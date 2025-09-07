"use client";

import { BookOpen, Eye, Play, Target, Video } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import ShareButton from "@/components/ui/share-button";
import type { StrapiVideo } from "@/lib/strapi";
import { extractYouTubeVideoId } from "@/lib/utils";

interface VideoPageProps {
	video: StrapiVideo;
	currentVideoSlug?: string;
}

export default function VideoPage({ video, currentVideoSlug }: VideoPageProps) {
	const router = useRouter();
	const pathname = usePathname();

	// Memoize all videos to prevent re-creation on every render
	const allVideos = useMemo(() => {
		return [video, ...(video.related_datas || [])];
	}, [video]);

	// Determine starting video
	const [currentVideo, setCurrentVideo] = useState<StrapiVideo | null>(null);

	useEffect(() => {
		const targetVideo = currentVideoSlug
			? allVideos.find((v) => v.slug === currentVideoSlug)
			: video; // Default to main video

		setCurrentVideo(targetVideo || video);
	}, [currentVideoSlug, video, allVideos]);

	// Helper function to get YouTube thumbnail
	function getYouTubeThumbnail(url: string): string {
		const videoId = extractYouTubeVideoId(url);
		return videoId
			? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
			: "/placeholder.svg";
	}

	const getCurrentVideoUrl = () => {
		if (typeof window !== "undefined") {
			return `${window.location.origin}${pathname}?video=${currentVideo?.slug}`;
		}
		return "";
	};

	const handleVideoSelect = (selectedVideo: StrapiVideo) => {
		setCurrentVideo(selectedVideo);
		// Update URL with current video
		router.push(`${pathname}?video=${selectedVideo.slug}`, { scroll: false });
	};

	const handleNextVideo = () => {
		const currentIndex = allVideos.findIndex((v) => v.id === currentVideo?.id);
		if (currentIndex < allVideos.length - 1) {
			const nextVideo = allVideos[currentIndex + 1];
			setCurrentVideo(nextVideo);
			router.push(`${pathname}?video=${nextVideo.slug}`, { scroll: false });
		}
	};

	const handlePreviousVideo = () => {
		const currentIndex = allVideos.findIndex((v) => v.id === currentVideo?.id);
		if (currentIndex > 0) {
			const prevVideo = allVideos[currentIndex - 1];
			setCurrentVideo(prevVideo);
			router.push(`${pathname}?video=${prevVideo.slug}`, { scroll: false });
		}
	};

	// Show loading state while video is being initialized
	if (!currentVideo) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-50">
				<div className="text-center">
					<div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-blue-500 border-b-2" />
					<p className="text-gray-600">Video yükleniyor...</p>
				</div>
			</div>
		);
	}

	const youtubeVideoId = extractYouTubeVideoId(currentVideo.href);

	return (
		<div className="mx-auto px-4 py-6 sm:px-6 lg:px-8">
			<div className="grid gap-6 lg:grid-cols-3">
				{/* Main Content - Video Player */}
				<div className="space-y-6 lg:col-span-2">
					{/* Video Player */}
					<Card className="py-6">
						<CardContent>
							<div className="relative aspect-video overflow-hidden rounded-t-lg bg-black">
								{youtubeVideoId ? (
									<iframe
										key={currentVideo.id} // Force re-render when video changes
										width="100%"
										height="100%"
										src={`https://www.youtube.com/embed/${youtubeVideoId}`}
										title={currentVideo.title}
										frameBorder="0"
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
										allowFullScreen
										className="absolute inset-0"
									/>
								) : (
									<div className="absolute inset-0 flex items-center justify-center text-white">
										<div className="text-center">
											<p className="mb-2 text-lg">Video yüklenemedi</p>
											<p className="text-gray-300 text-sm">
												Video URL'si geçersiz: {currentVideo.href}
											</p>
										</div>
									</div>
								)}
							</div>
							<div className="p-6">
								<div className="mb-4 flex items-center justify-between">
									<div className="flex-1">
										<h1 className="mb-2 font-bold text-2xl text-gray-900">
											{currentVideo.title}
										</h1>
										{currentVideo.isPopular && (
											<Badge variant="secondary" className="mb-2">
												Popüler
											</Badge>
										)}
									</div>
								</div>

								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-4">
										<Button
											variant="outline"
											onClick={handlePreviousVideo}
											disabled={
												allVideos.findIndex(
													(v) => v.id === currentVideo?.id,
												) === 0
											}
										>
											Önceki
										</Button>
										<Button
											variant="outline"
											onClick={handleNextVideo}
											disabled={
												allVideos.findIndex(
													(v) => v.id === currentVideo?.id,
												) ===
												allVideos.length - 1
											}
										>
											Sonraki
										</Button>
									</div>

									<div className="flex items-center space-x-2">
										<ShareButton
											url={getCurrentVideoUrl()}
											title={currentVideo.title}
											description="Bu harika videoyu izle!"
										/>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Video Information */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<BookOpen className="h-5 w-5" />
								<span>Bu Video Hakkında</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid gap-6 md:grid-cols-2">
								<div>
									<h3 className="mb-2 font-semibold text-gray-900">
										Video Açıklaması
									</h3>
									<p className="mb-4 text-gray-600">{currentVideo.title}</p>

									<div className="space-y-2">
										<div className="flex items-center space-x-2">
											<Eye className="h-4 w-4 text-gray-500" />
											<span className="text-gray-600 text-sm">
												Yayınlanma:{" "}
												{new Date(currentVideo.publishedAt).toLocaleDateString(
													"tr-TR",
												)}
											</span>
										</div>
										{currentVideo.isPopular && (
											<div className="flex items-center space-x-2">
												<Video className="h-4 w-4 text-orange-500" />
												<span className="text-orange-600 text-sm">
													Popüler İçerik
												</span>
											</div>
										)}
										{currentVideo.page && (
											<div className="flex items-center space-x-2">
												<Target className="h-4 w-4 text-gray-500" />
												<span className="text-gray-600 text-sm">
													Sayfa: {currentVideo.page.title}
												</span>
											</div>
										)}
										{video.related_datas && video.related_datas.length > 0 && (
											<div className="flex items-center space-x-2">
												<BookOpen className="h-4 w-4 text-gray-500" />
												<span className="text-gray-600 text-sm">
													{video.related_datas.length} İlgili Video
												</span>
											</div>
										)}
									</div>
								</div>

								<div>
									<div className="flex h-48 w-full items-center justify-center rounded-lg bg-gray-100">
										<img
											src={getYouTubeThumbnail(currentVideo.href)}
											alt={currentVideo.title}
											className="h-48 w-full rounded-lg object-cover"
											onError={(e) => {
												e.currentTarget.src = "/placeholder.svg";
											}}
										/>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Sidebar - Related Videos */}
				<div className="lg:col-span-1">
					<Card className="sticky top-6">
						<CardHeader>
							<CardTitle className="flex items-center justify-between">
								<span>Videolar</span>
								<Badge variant="secondary">{allVideos.length} Video</Badge>
							</CardTitle>
							<CardDescription>
								{video.related_datas && video.related_datas.length > 0
									? "Ana video ve ilgili videolar"
									: "Bu video"}
							</CardDescription>
						</CardHeader>
						<CardContent className="p-0">
							<ScrollArea className="h-96">
								<div className="space-y-3 p-4">
									{allVideos.map((videoItem, index) => (
										<div
											key={`${videoItem.id}-${videoItem.documentId}-${index}`}
										>
											<button
												type="button"
												className={`cursor-pointer rounded-lg p-3 transition-colors ${
													currentVideo?.id === videoItem.id
														? "border-2 border-blue-200 bg-blue-50"
														: "border-2 border-transparent hover:bg-gray-50"
												}`}
												onClick={() => handleVideoSelect(videoItem)}
											>
												<div className="flex items-start space-x-3">
													{/* Video Thumbnail */}
													<div className="flex-shrink-0">
														<div className="relative h-12 w-16 overflow-hidden rounded bg-gray-200">
															<img
																src={getYouTubeThumbnail(videoItem.href)}
																alt={videoItem.title}
																className="h-full w-full object-cover"
																onError={(e) => {
																	e.currentTarget.src = "/placeholder.svg";
																}}
															/>
															<div className="absolute inset-0 flex items-center justify-center">
																<Play className="h-4 w-4 text-white drop-shadow-lg" />
															</div>
														</div>
													</div>

													{/* Video Info */}
													<div className="min-w-0 flex-1">
														<div className="mb-1 flex items-start justify-between">
															<p className="line-clamp-2 font-medium text-gray-900 text-sm leading-tight">
																{videoItem.title}
															</p>
															{videoItem.isPopular && (
																<Badge
																	variant="outline"
																	className="ml-2 flex-shrink-0 text-xs"
																>
																	Popüler
																</Badge>
															)}
														</div>
														<p className="mb-1 text-gray-500 text-xs">
															{index === 0
																? "Ana Video"
																: `İlgili Video ${index}`}
														</p>
														<p className="text-gray-400 text-xs">
															{new Date(
																videoItem.publishedAt,
															).toLocaleDateString("tr-TR")}
														</p>
													</div>
												</div>
											</button>
											{index < allVideos.length - 1 && (
												<Separator className="my-3" />
											)}
										</div>
									))}
								</div>
							</ScrollArea>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
