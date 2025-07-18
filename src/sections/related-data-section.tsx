import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

interface RelatedItem {
  title: string
  href: string
}

interface RelatedDataSectionProps {
  title?: string
  items: RelatedItem[]
  className?: string
}

export default function RelatedDataSection({ 
  title = "İlgili Sayfalar", 
  items, 
  className = "" 
}: RelatedDataSectionProps) {
  // Don't render if no items
  if (!items || items.length === 0) {
    return null
  }

  return (
    <section className={`mb-12 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ExternalLink className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900 truncate">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
