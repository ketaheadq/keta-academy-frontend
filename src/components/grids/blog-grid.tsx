"use client"

import DynamicGrid from "@/components/dynamic-grid"
import BlogCard from "@/components/blog-card"
import { StrapiBlog } from "@/lib/strapi"
import { BookOpen } from "lucide-react"

interface BlogGridProps {
  items: StrapiBlog[]
  title?: string
  showRelatedData?: boolean
}

export default function BlogGrid({ 
  items, 
  title = "Blog Yazıları",
  showRelatedData = false
}: BlogGridProps) {
  return (
    <DynamicGrid
      items={items}
      searchFields={['title']}
      filterConfigs={[]}
      renderItem={(blog: StrapiBlog) => (
        <BlogCard 
          key={blog.id} 
          blog={blog} 
          showRelatedData={showRelatedData}
        />
      )}
      title={title}
      emptyStateConfig={{
        icon: <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />,
        title: 'Blog yazısı bulunamadı',
        description: 'Aradığınız kriterlere uygun blog yazısı bulunamadı.'
      }}
    />
  )
} 