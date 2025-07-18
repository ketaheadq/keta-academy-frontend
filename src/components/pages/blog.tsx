"use client"

import { StrapiBlog } from "@/lib/strapi"
import BlogRichTextRenderer from "@/components/blog-rich-text-renderer"
import { Share2, Calendar, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BlogPageProps {
  blog: StrapiBlog
}

export default function BlogPage({ blog }: BlogPageProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: `${blog.title} - Keta Akademi Blog`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link kopyalandı!")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getReadingTime = (content: any[]) => {
    // Calculate reading time based on content length
    const wordsPerMinute = 200
    let wordCount = 0
    
    content.forEach(block => {
      if (block.children) {
        block.children.forEach((child: any) => {
          if (child.text) {
            wordCount += child.text.split(' ').length
          }
        })
      }
    })
    
    const readingTime = Math.ceil(wordCount / wordsPerMinute)
    return readingTime > 0 ? readingTime : 1
  }

  const readingTime = getReadingTime(blog.content)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Blog Header */}
          <header className="mb-12 text-center">
            <h1 className="text-5xl font-black text-gray-900 mb-8 leading-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {blog.title}
            </h1>
            
            {/* Blog Meta */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-600 mb-8">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="font-medium">{formatDate(blog.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <Clock className="w-4 h-4 text-green-500" />
                <span className="font-medium">{readingTime} dk okuma</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <User className="w-4 h-4 text-purple-500" />
                <span className="font-medium">Keta Akademi</span>
              </div>
            </div>

            {/* Share Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleShare}
                variant="outline"
                size="lg"
                className="flex items-center gap-2 bg-white hover:bg-blue-50 border-blue-200 text-blue-600 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Share2 className="w-4 h-4" />
                Paylaş
              </Button>
            </div>
          </header>

          {/* Blog Content */}
          <article className="bg-white rounded-3xl shadow-xl p-12 border border-gray-100">
            <BlogRichTextRenderer content={blog.content} />
          </article>

          {/* Blog Footer */}
          <footer className="mt-12 p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-xl text-white">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-3">
                Bu yazıyı beğendiniz mi?
              </h3>
              <p className="text-blue-100 mb-6 text-lg font-light">
                Daha fazla eğitim içeriği için blog sayfamızı takip edin.
              </p>
              <Button
                onClick={handleShare}
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Arkadaşlarınla Paylaş
              </Button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
} 