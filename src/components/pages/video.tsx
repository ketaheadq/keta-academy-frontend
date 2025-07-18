"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Play, Clock, Video, Eye, BookOpen, Target, GraduationCap } from "lucide-react"
import ShareButton from "@/components/ui/share-button"
import type { StrapiVideo } from "@/lib/strapi"

interface VideoPageProps {
  video: StrapiVideo
  currentVideoSlug?: string
}

export default function VideoPage({ video, currentVideoSlug }: VideoPageProps) {
  const router = useRouter()
  const pathname = usePathname()
  
  // All videos (main video + related videos)
  const allVideos = [video, ...(video.related_datas || [])]
  
  // Determine starting video
  const [currentVideo, setCurrentVideo] = useState<StrapiVideo | null>(null)

  useEffect(() => {
    const targetVideo = currentVideoSlug
      ? allVideos.find(v => v.slug === currentVideoSlug)
      : video // Default to main video

    setCurrentVideo(targetVideo || video)
  }, [currentVideoSlug, video, allVideos])

  // Helper function to extract YouTube video ID from URL
  function extractYouTubeVideoId(url: string): string | null {
    console.log('🔍 Extracting video ID from URL:', url)
    
    // Handle different YouTube URL formats
    const patterns = [
      // youtube.com/watch?v=VIDEO_ID
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      // youtube.com/v/VIDEO_ID
      /youtube\.com\/v\/([^&\n?#]+)/,
      // youtube.com/embed/VIDEO_ID
      /youtube\.com\/embed\/([^&\n?#]+)/,
      // youtu.be/VIDEO_ID
      /youtu\.be\/([^&\n?#]+)/
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        const videoId = match[1]
        console.log('✅ Extracted video ID:', videoId)
        return videoId
      }
    }
    
    console.log('❌ Could not extract video ID from URL:', url)
    return null
  }

  // Helper function to get YouTube thumbnail
  function getYouTubeThumbnail(url: string): string {
    const videoId = extractYouTubeVideoId(url)
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : "/placeholder.svg"
  }

  const getCurrentVideoUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${pathname}?video=${currentVideo?.slug}`
    }
    return ""
  }

  const handleVideoSelect = (selectedVideo: StrapiVideo) => {
    setCurrentVideo(selectedVideo)
    // Update URL with current video
    router.push(`${pathname}?video=${selectedVideo.slug}`, { scroll: false })
  }

  const handleNextVideo = () => {
    const currentIndex = allVideos.findIndex((v) => v.id === currentVideo?.id)
    if (currentIndex < allVideos.length - 1) {
      const nextVideo = allVideos[currentIndex + 1]
      setCurrentVideo(nextVideo)
      router.push(`${pathname}?video=${nextVideo.slug}`, { scroll: false })
    }
  }

  const handlePreviousVideo = () => {
    const currentIndex = allVideos.findIndex((v) => v.id === currentVideo?.id)
    if (currentIndex > 0) {
      const prevVideo = allVideos[currentIndex - 1]
      setCurrentVideo(prevVideo)
      router.push(`${pathname}?video=${prevVideo.slug}`, { scroll: false })
    }
  }

  // Show loading state while video is being initialized
  if (!currentVideo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Video yükleniyor...</p>
        </div>
      </div>
    )
  }

  const youtubeVideoId = extractYouTubeVideoId(currentVideo.href)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content - Video Player */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <Card className="py-6">
            <CardContent >
              <div className="aspect-video bg-black rounded-t-lg relative overflow-hidden">
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
                      <p className="text-lg mb-2">Video yüklenemedi</p>
                      <p className="text-sm text-gray-300">Video URL'si geçersiz: {currentVideo.href}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{currentVideo.title}</h1>
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
                      disabled={allVideos.findIndex((v) => v.id === currentVideo?.id) === 0}
                    >
                      Önceki
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleNextVideo}
                      disabled={allVideos.findIndex((v) => v.id === currentVideo?.id) === allVideos.length - 1}
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
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Video Açıklaması</h3>
                  <p className="text-gray-600 mb-4">{currentVideo.title}</p>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Yayınlanma: {new Date(currentVideo.publishedAt).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    {currentVideo.isPopular && (
                      <div className="flex items-center space-x-2">
                        <Video className="h-4 w-4 text-orange-500" />
                        <span className="text-sm text-orange-600">Popüler İçerik</span>
                      </div>
                    )}
                    {currentVideo.page && (
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Sayfa: {currentVideo.page.title}</span>
                      </div>
                    )}
                    {video.related_datas && video.related_datas.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{video.related_datas.length} İlgili Video</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="rounded-lg bg-gray-100 w-full h-48 flex items-center justify-center">
                    <img
                      src={getYouTubeThumbnail(currentVideo.href)}
                      alt={currentVideo.title}
                      className="rounded-lg object-cover w-full h-48"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg"
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
                <Badge variant="secondary">
                  {allVideos.length} Video
                </Badge>
              </CardTitle>
              <CardDescription>
                {video.related_datas && video.related_datas.length > 0 
                  ? "Ana video ve ilgili videolar" 
                  : "Bu video"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-96">
                <div className="p-4 space-y-3">
                  {allVideos.map((videoItem, index) => (
                    <div key={`${videoItem.id}-${videoItem.documentId}-${index}`}>
                      <div
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          currentVideo?.id === videoItem.id
                            ? "bg-blue-50 border-2 border-blue-200"
                            : "hover:bg-gray-50 border-2 border-transparent"
                        }`}
                        onClick={() => handleVideoSelect(videoItem)}
                      >
                        <div className="flex items-start space-x-3">
                          {/* Video Thumbnail */}
                          <div className="flex-shrink-0">
                            <div className="relative w-16 h-12 bg-gray-200 rounded overflow-hidden">
                              <img
                                src={getYouTubeThumbnail(videoItem.href)}
                                alt={videoItem.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.svg"
                                }}
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Play className="h-4 w-4 text-white drop-shadow-lg" />
                              </div>
                            </div>
                          </div>
                          
                          {/* Video Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
                                {videoItem.title}
                              </p>
                              {videoItem.isPopular && (
                                <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
                                  Popüler
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mb-1">
                              {index === 0 ? "Ana Video" : `İlgili Video ${index}`}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(videoItem.publishedAt).toLocaleDateString('tr-TR')}
                            </p>
                          </div>
                        </div>
                      </div>
                      {index < allVideos.length - 1 && <Separator className="my-3" />}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 