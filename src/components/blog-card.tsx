"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StrapiBlog } from "@/lib/strapi"
import { Calendar, FileText, ExternalLink, BookOpen } from "lucide-react"

interface BlogCardProps {
  blog: StrapiBlog
  showRelatedData?: boolean
}

export default function BlogCard({ 
  blog, 
  showRelatedData = false 
}: BlogCardProps) {
  // Extract text from blog content blocks for preview
  const getContentPreview = (): string => {
    if (!blog.content || blog.content.length === 0) return 'İçerik mevcut'
    
    for (const block of blog.content) {
      if (block.children && block.children.length > 0) {
        const text = block.children[0]?.text
        if (text && text.trim()) {
          return text
        }
      }
    }
    return 'İçerik mevcut'
  }

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="secondary">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(blog.publishedAt).toLocaleDateString('tr-TR')}
              </Badge>
              <Badge className="bg-green-500">
                <BookOpen className="h-3 w-3 mr-1" />
                Blog
              </Badge>
              {blog.content && blog.content.length > 0 && (
                <Badge className="bg-blue-500">
                  <FileText className="h-3 w-3 mr-1" />
                  İçerik
                </Badge>
              )}
            </div>
            
            <CardTitle className="text-lg mb-2">
              {blog.title}
            </CardTitle>
            
            {/* Content Preview */}
            <div className="text-sm text-gray-600 mb-3">
              <p className="line-clamp-3">
                {getContentPreview()}
              </p>
            </div>

            {/* Related Data */}
            {showRelatedData && blog.related_datas && blog.related_datas.length > 0 && (
              <div className="space-y-1">
                <span className="text-sm font-medium text-gray-700 block">
                  İlgili Blog Yazıları ({blog.related_datas.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {blog.related_datas.slice(0, 2).map((related) => (
                    <Badge key={related.id} variant="outline" className="text-xs">
                      {related.title}
                    </Badge>
                  ))}
                  {blog.related_datas.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{blog.related_datas.length - 2} daha
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Page Reference */}
            {blog.page && (
              <div className="text-xs text-gray-500 mt-2">
                <strong>Sayfa:</strong> {blog.page.title}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Link href={`/sayfalar/${blog.page?.slug}/${blog.slug}`}>
          <Button className="w-full">
            <ExternalLink className="h-4 w-4 mr-2" />
            Yazıyı Oku
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
} 