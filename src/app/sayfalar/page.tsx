import { getPageCategories } from "@/lib/strapi"
import { BreadcrumbNav } from "@/components/layout/breadcrum-nav"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function SayfalarPage() {
  const pageCategories = await getPageCategories()

  return (
    <div className="min-h-screen max-w-6xl mx-auto">
      <BreadcrumbNav 
        breadcrumbs={[
          { label: "Sayfalar", href: "/sayfalar" }
        ]} 
      />
      
      <div className="py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Tüm Sayfalar
        </h1>
        
        <div className="grid gap-8">
          {pageCategories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle className="text-xl">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {category.pages.map((page) => (
                    <Link 
                      key={page.id} 
                      href={`/sayfalar/${page.slug}`}
                      className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <h3 className="font-medium text-gray-900">{page.title}</h3>
                      {page.pageType && (
                        <p className="text-sm text-gray-500 mt-1">Tür: {page.pageType}</p>
                      )}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 