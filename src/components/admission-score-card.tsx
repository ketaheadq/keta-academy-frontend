"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StrapiAdmissionScore } from "@/lib/strapi"
import { Calendar, FileText, Table, ExternalLink, Star } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

interface AdmissionScoreCardProps {
  admissionScore: StrapiAdmissionScore
  showRelatedData?: boolean
}

export default function AdmissionScoreCard({ 
  admissionScore, 
  showRelatedData = false 
}: AdmissionScoreCardProps) {
    const pathname = usePathname()
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="secondary">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(admissionScore.publishedAt).toLocaleDateString('tr-TR')}
              </Badge>
              {admissionScore.content && admissionScore.content.length > 0 && (
                <Badge className="bg-green-500">
                  <FileText className="h-3 w-3 mr-1" />
                  Taban Puanları
                </Badge>
              )}
              {admissionScore.isPopular && (
                <Badge className="bg-blue-500">
                  <Star className="h-3 w-3 mr-1" />
                  Popüler
                </Badge>
              )}
            </div>
            
            <CardTitle className="text-lg mb-2">
              {admissionScore.title}
            </CardTitle>
            
            {/* Content Preview */}
            {admissionScore.content && admissionScore.content.length > 0 && (
              <div className="text-sm text-gray-600 mb-3">
                <p className="line-clamp-2">
                  {admissionScore.content[0]?.children?.[0]?.text || 'İçerik mevcut'}
                </p>
              </div>
            )}

            {/* Related Data */}
            {showRelatedData && admissionScore.related_datas && admissionScore.related_datas.length > 0 && (
              <div className="space-y-1">
                <span className="text-sm font-medium text-gray-700 block">
                  İlgili Veriler ({admissionScore.related_datas.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {admissionScore.related_datas.slice(0, 2).map((related) => (
                    <Badge key={related.id} variant="outline" className="text-xs">
                      {related.title}
                    </Badge>
                  ))}
                  {admissionScore.related_datas.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{admissionScore.related_datas.length - 2} daha
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Page Reference */}
            {admissionScore.page && (
              <div className="text-xs text-gray-500 mt-2">
                <strong>Sayfa:</strong> {admissionScore.page.title}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Link href={`${pathname}/${admissionScore.slug}`}>
          <Button className="w-full">
            <ExternalLink className="h-4 w-4 mr-2" />
            Detayları Gör
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
} 