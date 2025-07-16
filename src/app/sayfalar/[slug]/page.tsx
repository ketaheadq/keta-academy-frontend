import { notFound } from "next/navigation"
import { getPageBySlug, getAdmissionScoresByPage, getVideosByPage, getBlogsByPage } from "@/lib/strapi"
import { BreadcrumbNav } from "@/components/layout/breadcrum-nav"
import AdmissionGrid from "@/components/grids/admission-grid"
import VideoGrid from "@/components/grids/video-grid"
import BlogGrid from "@/components/grids/blog-grid"
import PermissionWarning from "@/components/permission-warning"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  console.log("slug", slug)
  try {
    const page = await getPageBySlug(slug)
    console.log("ad")
    if (!page) {
      notFound()
    }

    // Fetch content based on page type
    let content = null
    
    switch (page.pageType) {
      case 'Üniversite Taban Puanları':
      case 'Bölüm Taban Puanları':
        const admissionScores = await getAdmissionScoresByPage(slug)
        if (admissionScores.length === 0) {
          content = (
            <PermissionWarning 
              contentType="Taban Puanları" 
              endpoint={`admission-scores?filters[page][slug][$eq]=${slug}`}
            />
          )
        } else {
          content = (
            <AdmissionGrid
              items={admissionScores}
              title={page.title}
              showRelatedData={true}
            />
          )
        }
        break
        
      case 'Videolar':
        const videos = await getVideosByPage(slug)
        if (videos.length === 0) {
          content = (
            <PermissionWarning 
              contentType="Videolar" 
              endpoint={`videos?filters[page][slug][$eq]=${slug}`}
            />
          )
        } else {
          content = (
            <VideoGrid
              items={videos}
              title={page.title}
              showRelatedData={true}
            />
          )
        }
        break
        
      case 'Bloglar':
        const blogs = await getBlogsByPage(slug)
        if (blogs.length === 0) {
          content = (
            <PermissionWarning 
              contentType="Blog Yazıları" 
              endpoint={`blogs?filters[page][slug][$eq]=${slug}`}
            />
          )
        } else {
          content = (
            <BlogGrid
              items={blogs}
              title={page.title}
              showRelatedData={true}
            />
          )
        }
        break
        
      case 'Hesaplama Araçları':
        content = (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Hesaplama Araçları</h2>
            <p className="text-gray-600">Calculation tools will be implemented here</p>
          </div>
        )
        break
        
      default:
        content = (
          <div className="text-center">
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {page.content}
            </p>
          </div>
        )
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <BreadcrumbNav 
          breadcrumbs={[
            { label: page.title, href: `/sayfalar/${slug}` }
          ]} 
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{page.title}</h1>
            {page.pageType !== 'Üniversite Taban Puanları' && 
             page.pageType !== 'Bölüm Taban Puanları' && 
             page.pageType !== 'Videolar' &&
             page.pageType !== 'Bloglar' &&
             page.content && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                {page.content}
              </p>
            )}
          </div>
          
          {content}
        </main>
      </div>
    )
  } catch (error) {
    console.error('Error fetching page:', error)
    notFound()
  }
} 