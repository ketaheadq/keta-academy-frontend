"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, FileText, School } from "lucide-react"
import RichTextRenderer from "@/components/rich-text-renderer"
import { StrapiBlock } from "@/lib/strapi"

interface ExpandableContentCardProps {
  title?: string
  content?: StrapiBlock[]
}

export default function ExpandableContentCard({ title = "İçerik", content }: ExpandableContentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!content || content.length === 0) {
    return null
  }

  // Extract preview text from the first few blocks
  const getPreviewText = (blocks: StrapiBlock[], maxLength: number = 200): string => {
    let previewText = ""
    
    for (const block of blocks) {
      if (block.type === 'paragraph' && block.children) {
        for (const child of block.children) {
          if (child.text) {
            previewText += child.text + " "
            if (previewText.length >= maxLength) break
          }
        }
        if (previewText.length >= maxLength) break
      }
    }
    
    if (previewText.length > maxLength) {
      return previewText.substring(0, maxLength).trim() + "..."
    }
    
    return previewText.trim()
  }

  const previewText = getPreviewText(content)

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <School className="h-5 w-5 text-blue-600" />
            <span>{title}</span>
          </CardTitle>
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2"
          >
            <span>{isExpanded ? 'Gizle' : 'Daha Fazla Göster'}</span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <RichTextRenderer content={content} />
        </CardContent>
      )}
      
      {!isExpanded && (
        <CardContent className="pt-0">
          <div className="text-gray-700 leading-relaxed">
            {previewText ? (
              <p>{previewText}</p>
            ) : (
              <div className="text-center text-gray-500">
                <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>İçeriği görmek için yukarıdaki butona tıklayın.</p>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
} 